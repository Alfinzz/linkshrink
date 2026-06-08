const { customAlphabet } = require("nanoid");
const prisma = require("../config/prisma");

const generateSlug = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 7);

function assertValidUrl(url) {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch (_error) {
    const error = new Error("A valid http or https URL is required");
    error.statusCode = 400;
    throw error;
  }
}

async function createUniqueSlug(customSlug) {
  if (customSlug) {
    const cleanSlug = customSlug.trim();
    const exists = await prisma.link.findUnique({ where: { slug: cleanSlug } });

    if (exists) {
      const error = new Error("Slug is already in use");
      error.statusCode = 409;
      throw error;
    }

    return cleanSlug;
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = generateSlug();
    const exists = await prisma.link.findUnique({ where: { slug } });

    if (!exists) {
      return slug;
    }
  }

  const error = new Error("Could not generate a unique slug");
  error.statusCode = 500;
  throw error;
}

async function listLinks(userId) {
  return prisma.link.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { clicks: true }
      }
    }
  });
}

async function createLink(userId, data) {
  assertValidUrl(data.originalUrl);

  const slug = await createUniqueSlug(data.slug);

  return prisma.link.create({
    data: {
      userId,
      slug,
      originalUrl: data.originalUrl,
      title: data.title
    },
    include: {
      _count: {
        select: { clicks: true }
      }
    }
  });
}

async function getOwnedLink(userId, id) {
  const link = await prisma.link.findFirst({
    where: { id, userId },
    include: {
      _count: {
        select: { clicks: true }
      }
    }
  });

  if (!link) {
    const error = new Error("Link not found");
    error.statusCode = 404;
    throw error;
  }

  return link;
}

async function updateLink(userId, id, data) {
  await getOwnedLink(userId, id);

  if (data.originalUrl) {
    assertValidUrl(data.originalUrl);
  }

  return prisma.link.update({
    where: { id },
    data: {
      originalUrl: data.originalUrl,
      title: data.title,
      isArchived: data.isArchived
    },
    include: {
      _count: {
        select: { clicks: true }
      }
    }
  });
}

async function deleteLink(userId, id) {
  await getOwnedLink(userId, id);
  await prisma.link.delete({ where: { id } });
}

const ipCache = new Map();

async function lookupIp(ip) {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return "Localhost";
  }
  if (ipCache.has(ip)) {
    return ipCache.get(ip);
  }
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 1000);

  try {
    const response = await fetch(`https://freeipapi.com/api/json/${ip}`, { signal: controller.signal });
    clearTimeout(id);
    if (response.ok) {
      const data = await response.json();
      const country = data.countryName || "Unknown";
      ipCache.set(ip, country);
      return country;
    }
  } catch (err) {
    clearTimeout(id);
  }
  return "Unknown";
}

function parseReferrer(referrer) {
  if (!referrer) return "Direct";
  try {
    const url = new URL(referrer);
    let host = url.hostname.replace(/^www\./, "");
    if (host.includes("facebook.com")) return "Facebook";
    if (host.includes("twitter.com") || host.includes("t.co") || host.includes("x.com")) return "Twitter / X";
    if (host.includes("linkedin.com")) return "LinkedIn";
    if (host.includes("github.com")) return "GitHub";
    if (host.includes("google.com")) return "Google Search";
    return host;
  } catch (_) {
    return "Direct";
  }
}

function parseUserAgent(userAgent) {
  if (!userAgent) return { browser: "Other", device: "Desktop" };
  
  let device = "Desktop";
  if (/ipad|tablet/i.test(userAgent)) {
    device = "Tablet";
  } else if (/mobi|android|iphone|ipod/i.test(userAgent)) {
    device = "Mobile";
  }

  let browser = "Other";
  if (/edg/i.test(userAgent)) {
    browser = "Edge";
  } else if (/chrome|crios/i.test(userAgent)) {
    browser = "Chrome";
  } else if (/safari/i.test(userAgent)) {
    browser = "Safari";
  } else if (/firefox|fxios/i.test(userAgent)) {
    browser = "Firefox";
  }

  return { browser, device };
}

async function getAnalytics(userId, id) {
  const link = await getOwnedLink(userId, id);

  const clicks = await prisma.click.findMany({
    where: { linkId: id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      ip: true,
      referrer: true,
      userAgent: true,
      createdAt: true
    }
  });

  const byDay = clicks.reduce((acc, click) => {
    const day = click.createdAt.toISOString().slice(0, 10);
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  // Resolve countries for unique IPs
  const uniqueIps = [...new Set(clicks.map(c => c.ip).filter(Boolean))];
  const ipToCountryPairs = await Promise.all(
    uniqueIps.map(async (ip) => {
      const country = await lookupIp(ip);
      return { ip, country };
    })
  );
  const ipToCountryMap = new Map(ipToCountryPairs.map(p => [p.ip, p.country]));

  // Group locations
  const locationCounts = {};
  clicks.forEach(click => {
    const country = ipToCountryMap.get(click.ip) || "Localhost";
    locationCounts[country] = (locationCounts[country] || 0) + 1;
  });
  const locations = Object.entries(locationCounts)
    .map(([location, clicksCount]) => ({ location, clicks: clicksCount }))
    .sort((a, b) => b.clicks - a.clicks);

  // Group referrers
  const referrerCounts = {};
  clicks.forEach(click => {
    const ref = parseReferrer(click.referrer);
    referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
  });
  const referrers = Object.entries(referrerCounts)
    .map(([referrer, clicksCount]) => ({ referrer, clicks: clicksCount }))
    .sort((a, b) => b.clicks - a.clicks);

  // Group devices & browsers
  const deviceCounts = {};
  const browserCounts = {};
  clicks.forEach(click => {
    const { device, browser } = parseUserAgent(click.userAgent);
    deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    browserCounts[browser] = (browserCounts[browser] || 0) + 1;
  });
  const devices = Object.entries(deviceCounts)
    .map(([device, clicksCount]) => ({ device, clicks: clicksCount }))
    .sort((a, b) => b.clicks - a.clicks);
  const browsers = Object.entries(browserCounts)
    .map(([browser, clicksCount]) => ({ browser, clicks: clicksCount }))
    .sort((a, b) => b.clicks - a.clicks);

  return {
    totalClicks: clicks.length,
    uniqueVisitors: uniqueIps.length,
    byDay: Object.entries(byDay)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    recentClicks: clicks.slice(0, 25),
    locations,
    referrers,
    devices,
    browsers,
    link
  };
}

async function getDashboardStats(userId) {
  const links = await prisma.link.findMany({
    where: { userId },
    select: {
      id: true,
      slug: true,
      isArchived: true,
      clicks: {
        select: {
          ip: true,
          referrer: true
        }
      }
    }
  });

  let totalClicks = 0;
  const locationCounts = {};
  const referrerCounts = {};

  const allClicks = [];
  links.forEach(link => {
    link.clicks.forEach(click => {
      allClicks.push(click);
      totalClicks++;
    });
  });

  const uniqueIps = [...new Set(allClicks.map(c => c.ip).filter(Boolean))];
  const ipToCountryPairs = await Promise.all(
    uniqueIps.map(async (ip) => {
      const country = await lookupIp(ip);
      return { ip, country };
    })
  );
  const ipToCountryMap = new Map(ipToCountryPairs.map(p => [p.ip, p.country]));

  allClicks.forEach(click => {
    const country = ipToCountryMap.get(click.ip) || "Localhost";
    locationCounts[country] = (locationCounts[country] || 0) + 1;

    const ref = parseReferrer(click.referrer);
    referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
  });

  const sortedLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1]);
  const topLocation = sortedLocations[0] ? sortedLocations[0][0] : "No traffic yet";
  const topLocationPercent = sortedLocations[0] && totalClicks > 0 
    ? Math.round((sortedLocations[0][1] / totalClicks) * 100) 
    : 0;

  return {
    totalClicks,
    activeLinks: links.filter(l => !l.isArchived).length,
    topLocation: topLocation !== "No traffic yet" ? `${topLocation} (${topLocationPercent}%)` : "No traffic yet",
    topLocationRaw: topLocation
  };
}

async function getRedirectTarget(slug) {
  return prisma.link.findFirst({
    where: {
      slug,
      isArchived: false
    }
  });
}

async function logClick(linkId, req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(",")[0]?.trim() || req.socket.remoteAddress;

  return prisma.click.create({
    data: {
      linkId,
      ip,
      referrer: req.headers.referer || req.headers.referrer,
      userAgent: req.headers["user-agent"]
    }
  });
}

module.exports = {
  listLinks,
  createLink,
  getOwnedLink,
  updateLink,
  deleteLink,
  getAnalytics,
  getDashboardStats,
  getRedirectTarget,
  logClick
};
