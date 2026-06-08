import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { MousePointerClick, Users, Share2, MapPin, Pencil, Copy, Download, Calendar } from "lucide-react";
import api, { getBackendOrigin } from "../lib/axios";

const DEVICE_COLORS = ["#2563EB", "#3B82F6", "#93C5FD", "#60A5FA"];

const getFilteredChartData = (byDayList, periodValue) => {
  const days = periodValue === "7d" ? 7 : periodValue === "30d" ? 30 : 90;
  const data = [];
  const now = new Date();
  
  const existingMap = new Map((byDayList || []).map(item => [item.date, item.total]));

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const formattedLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
    data.push({
      date: formattedLabel,
      total: existingMap.get(dateStr) || 0
    });
  }
  return data;
};

export default function AnalyticsPage() {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState({
    totalClicks: 0,
    uniqueVisitors: 0,
    byDay: [],
    recentClicks: [],
    locations: [],
    referrers: [],
    devices: [],
    browsers: [],
    link: {}
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7d");

  const backendOrigin = getBackendOrigin();

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      if (id === "demo") {
        const mockByDay = [];
        const now = new Date();
        for (let i = 89; i >= 0; i--) {
          const d = new Date();
          d.setDate(now.getDate() - i);
          mockByDay.push({
            date: d.toISOString().slice(0, 10),
            total: Math.floor(Math.random() * 50) + 5
          });
        }

        setAnalytics({
          totalClicks: 1248,
          uniqueVisitors: 891,
          byDay: mockByDay,
          recentClicks: [],
          locations: [
            { location: "United States", clicks: 750 },
            { location: "Indonesia", clicks: 320 },
            { location: "Singapore", clicks: 110 },
            { location: "Germany", clicks: 68 }
          ],
          referrers: [
            { referrer: "Twitter / X", clicks: 610 },
            { referrer: "Google Search", clicks: 320 },
            { referrer: "GitHub", clicks: 210 },
            { referrer: "Direct", clicks: 108 }
          ],
          devices: [
            { device: "Mobile", clicks: 810 },
            { device: "Desktop", clicks: 350 },
            { device: "Tablet", clicks: 88 }
          ],
          browsers: [
            { browser: "Chrome", clicks: 780 },
            { browser: "Safari", clicks: 310 },
            { browser: "Firefox", clicks: 158 }
          ],
          link: {
            title: "Summer Discount Campaign 2026",
            slug: "summer-sale-2026",
            originalUrl: "https://marketing.globalbrand.com/campaigns/summer-discount-active-leads-collection",
            isArchived: false,
            createdAt: new Date().toISOString()
          }
        });
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/links/${id}/analytics`);
        setAnalytics(data.analytics);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [id]);

  const shortUrl = `${backendOrigin}/${analytics.link?.slug || ""}`;

  // Time-series dynamic chart data
  const chartData = useMemo(() => {
    return getFilteredChartData(analytics.byDay, period);
  }, [analytics.byDay, period]);

  // Devices mapping
  const devicesData = useMemo(() => {
    return analytics.devices && analytics.devices.length > 0
      ? analytics.devices.map(d => ({ name: d.device, value: d.clicks }))
      : [
          { name: "Mobile", value: 0 },
          { name: "Desktop", value: 0 },
          { name: "Tablet", value: 0 }
        ];
  }, [analytics.devices]);

  const totalDeviceClicks = useMemo(() => {
    return devicesData.reduce((sum, d) => sum + d.value, 0);
  }, [devicesData]);

  // Referrers mapping
  const referrersData = useMemo(() => {
    return analytics.referrers && analytics.referrers.length > 0
      ? analytics.referrers.map(r => ({ name: r.referrer, value: r.clicks }))
      : [];
  }, [analytics.referrers]);

  const maxReferrer = useMemo(() => {
    return referrersData.length > 0 ? Math.max(...referrersData.map((r) => r.value)) : 1;
  }, [referrersData]);

  // Top items for stat cards
  const topLocationObj = analytics.locations && analytics.locations[0]
    ? analytics.locations[0]
    : { location: "No traffic", clicks: 0 };

  const topReferrerObj = analytics.referrers && analytics.referrers[0]
    ? analytics.referrers[0]
    : { referrer: "No traffic", clicks: 0 };

  function formatDate(dateString) {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center gap-2">
        <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-500 font-medium">Loading analytics...</span>
      </div>
    );
  }

  return (
    <section className="space-y-6 animate-slideUp">
      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-[280px]">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900 truncate max-w-full">
                {analytics.link?.title || "Untitled Link"}
              </h1>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(shortUrl)}
                  className="rounded p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition"
                  title="Copy short URL"
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-sm">
              <span className="text-primary-600 font-medium hover:underline cursor-pointer">
                {shortUrl.replace(/^https?:\/\//, "")}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 truncate max-w-[320px]" title={analytics.link?.originalUrl}>
                {analytics.link?.originalUrl}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {analytics.link?.isArchived ? (
              <span className="badge-danger">Archived</span>
            ) : (
              <span className="badge-success">● Active</span>
            )}
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar size={12} /> Created {formatDate(analytics.link?.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 border-l-4 border-l-primary-500">
          <div className="flex items-center justify-between">
            <p className="stat-label">Total Clicks</p>
            <MousePointerClick size={18} className="text-primary-500" />
          </div>
          <p className="stat-value mt-2">{analytics.totalClicks.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Total click redirections registered</p>
        </div>

        <div className="card p-5 border-l-4 border-l-blue-400">
          <div className="flex items-center justify-between">
            <p className="stat-label">Unique Visitors</p>
            <Users size={18} className="text-blue-400" />
          </div>
          <p className="stat-value mt-2">{analytics.uniqueVisitors.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Unique IP addresses tracked</p>
        </div>

        <div className="card p-5 border-l-4 border-l-warning-500">
          <div className="flex items-center justify-between">
            <p className="stat-label">Top Referrer</p>
            <Share2 size={18} className="text-warning-500" />
          </div>
          <p className="stat-value mt-2 text-xl truncate">{topReferrerObj.referrer}</p>
          <p className="text-xs text-gray-400 mt-1">
            {topReferrerObj.clicks > 0 
              ? `${topReferrerObj.clicks.toLocaleString()} clicks (${Math.round((topReferrerObj.clicks / analytics.totalClicks) * 100)}%)` 
              : "No clicks yet"}
          </p>
        </div>

        <div className="card p-5 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <p className="stat-label">Top Location</p>
            <MapPin size={18} className="text-green-500" />
          </div>
          <p className="stat-value mt-2 text-xl truncate">{topLocationObj.location}</p>
          <p className="text-xs text-gray-400 mt-1">
            {topLocationObj.clicks > 0 
              ? `${topLocationObj.clicks.toLocaleString()} clicks (${Math.round((topLocationObj.clicks / analytics.totalClicks) * 100)}%)` 
              : "No clicks yet"}
          </p>
        </div>
      </div>

      {/* Clicks Over Time Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Clicks Over Time</h2>
            <p className="text-sm text-gray-400">Visualizing traffic distribution for the selected period</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-primary-600 font-medium outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        <div className="h-[280px]">
          {analytics.totalClicks === 0 ? (
            <div className="h-full flex items-center justify-center border border-dashed border-gray-200 rounded-lg">
              <span className="text-sm text-gray-400">No click data to visualize yet.</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="clicksGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: 13
                  }}
                />
                <Area type="monotone" dataKey="total" stroke="#3B82F6" fill="url(#clicksGradient)" strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Devices + Referrers Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Devices */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Devices</h2>
          {totalDeviceClicks === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No device data available yet.</p>
          ) : (
            <div className="flex flex-wrap items-center justify-around gap-6">
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={devicesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {devicesData.map((entry, index) => (
                        <Cell key={entry.name} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xl font-bold text-gray-900">{totalDeviceClicks}</p>
                  <p className="text-[10px] text-gray-400">Clicks</p>
                </div>
              </div>
              <div className="space-y-3 min-w-[150px]">
                {devicesData.map((device, index) => (
                  <div key={device.name} className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEVICE_COLORS[index % DEVICE_COLORS.length] }} />
                    <span className="text-sm text-gray-600">{device.name}</span>
                    <span className="text-sm font-semibold text-gray-900 ml-auto">
                      {totalDeviceClicks > 0 ? Math.round((device.value / totalDeviceClicks) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Referrers */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Referrers</h2>
          <div className="space-y-4">
            {referrersData.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">No referrer data available yet.</p>
            ) : (
              referrersData.slice(0, 5).map((referrer) => (
                <div key={referrer.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-primary-600">{referrer.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{referrer.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all duration-500"
                      style={{ width: `${(referrer.value / maxReferrer) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Global Reach */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Global Reach</h2>
        <p className="text-sm text-gray-400 mb-4">Breakdown of clicks by visitor locations (countries)</p>

        {analytics.locations.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No location data available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {analytics.locations.map((loc, i) => (
              <div key={loc.location} className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-gray-400 bg-white border border-gray-150 w-5 h-5 rounded-full flex items-center justify-center">
                    #{i + 1}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">{loc.location}</span>
                </div>
                <span className="text-sm font-bold text-primary-600">
                  {loc.clicks.toLocaleString()} clicks ({analytics.totalClicks > 0 ? Math.round((loc.clicks / analytics.totalClicks) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
