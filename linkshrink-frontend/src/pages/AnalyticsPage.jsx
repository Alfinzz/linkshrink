import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { MousePointerClick, Users, Share2, MapPin, Pencil, Copy, Download, Calendar } from "lucide-react";
import api from "../lib/axios";

const DEVICE_COLORS = ["#2563EB", "#3B82F6", "#93C5FD"];

const demoDevices = [
  { name: "Mobile", value: 70 },
  { name: "Desktop", value: 25 },
  { name: "Tablet", value: 5 }
];

const demoReferrers = [
  { name: "Twitter.com", value: 4203 },
  { name: "Facebook.com", value: 2810 },
  { name: "LinkedIn.com", value: 1540 },
  { name: "Direct / Other", value: 920 }
];

export default function AnalyticsPage() {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState({ totalClicks: 0, byDay: [], recentClicks: [] });
  const [period, setPeriod] = useState("7d");

  useEffect(() => {
    async function fetchAnalytics() {
      if (id === "demo") {
        setAnalytics({
          totalClicks: 12482,
          uniqueVisitors: 8912,
          byDay: [
            { date: "Mon", total: 1400 },
            { date: "Tue", total: 1800 },
            { date: "Wed", total: 2500 },
            { date: "Thu", total: 1900 },
            { date: "Fri", total: 2100 },
            { date: "Sat", total: 1600 },
            { date: "Sun", total: 1200 }
          ],
          recentClicks: []
        });
        return;
      }

      const { data } = await api.get(`/links/${id}/analytics`);
      setAnalytics(data.analytics);
    }

    fetchAnalytics().catch(() => undefined);
  }, [id]);

  const totalDeviceClicks = demoDevices.reduce((sum, d) => sum + d.value, 0);
  const maxReferrer = Math.max(...demoReferrers.map((r) => r.value));

  return (
    <section className="space-y-6 animate-slideUp">
      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">lnk.sh/summer-sale-2024</h1>
              <button type="button" className="text-gray-400 hover:text-gray-600"><Copy size={16} /></button>
              <button type="button" className="text-gray-400 hover:text-gray-600"><Pencil size={16} /></button>
            </div>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-primary-500" />
              https://marketing.globalbrand.com/campai...
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge-success">● Active</span>
            <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12} /> Created Jul 12, 2024</span>
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
          <p className="stat-value mt-2">{analytics.totalClicks?.toLocaleString()}</p>
          <p className="text-xs text-success-600 mt-1">↗ +14.2% vs last week</p>
        </div>

        <div className="card p-5 border-l-4 border-l-blue-400">
          <div className="flex items-center justify-between">
            <p className="stat-label">Unique Visitors</p>
            <Users size={18} className="text-blue-400" />
          </div>
          <p className="stat-value mt-2">{(analytics.uniqueVisitors || 8912).toLocaleString()}</p>
          <p className="text-xs text-success-600 mt-1">↗ +8.1% vs last week</p>
        </div>

        <div className="card p-5 border-l-4 border-l-warning-500">
          <div className="flex items-center justify-between">
            <p className="stat-label">Top Referrer</p>
            <Share2 size={18} className="text-warning-500" />
          </div>
          <p className="stat-value mt-2 text-2xl">Twitter</p>
          <p className="text-xs text-gray-400 mt-1">4,203 clicks (33%)</p>
        </div>

        <div className="card p-5 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <p className="stat-label">Top Location</p>
            <MapPin size={18} className="text-green-500" />
          </div>
          <p className="stat-value mt-2 text-2xl">USA</p>
          <p className="text-xs text-gray-400 mt-1">📍 8,110 clicks (65%)</p>
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
            <button type="button" className="rounded-lg border border-gray-200 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition">
              <Download size={16} />
            </button>
          </div>
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.byDay}>
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
        </div>
      </div>

      {/* Devices + Referrers Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Devices */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Devices</h2>
          <div className="flex items-center gap-8">
            <div className="relative w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demoDevices}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {demoDevices.map((entry, index) => (
                      <Cell key={entry.name} fill={DEVICE_COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-bold text-gray-900">12k</p>
                <p className="text-[10px] text-gray-400">Clicks</p>
              </div>
            </div>
            <div className="space-y-3">
              {demoDevices.map((device, index) => (
                <div key={device.name} className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEVICE_COLORS[index] }} />
                  <span className="text-sm text-gray-600">{device.name}</span>
                  <span className="text-sm font-semibold text-gray-900 ml-auto">{device.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Referrers */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Referrers</h2>
          <div className="space-y-4">
            {demoReferrers.map((referrer) => (
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
            ))}
          </div>
        </div>
      </div>

      {/* Global Reach */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Global Reach</h2>
          <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View Detailed Map
          </button>
        </div>
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 h-48 flex items-center justify-center">
          {/* Stylized world map background dots */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary-300"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.8 + 0.2
                }}
              />
            ))}
          </div>
          <div className="relative text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Top Region</p>
            <p className="text-2xl font-bold text-white mt-1">North America</p>
            <p className="text-sm text-gray-400 mt-0.5">62% of all traffic</p>
          </div>
        </div>
      </div>
    </section>
  );
}
