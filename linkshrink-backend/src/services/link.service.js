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

async function getAnalytics(userId, id) {
  await getOwnedLink(userId, id);

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

  return {
    totalClicks: clicks.length,
    byDay: Object.entries(byDay)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    recentClicks: clicks.slice(0, 25)
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
  getRedirectTarget,
  logClick
};
