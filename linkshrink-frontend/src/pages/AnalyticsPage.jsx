import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../lib/axios";

export default function AnalyticsPage() {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState({ totalClicks: 0, byDay: [], recentClicks: [] });

  useEffect(() => {
    async function fetchAnalytics() {
      if (id === "demo") {
        setAnalytics({
          totalClicks: 128,
          byDay: [
            { date: "2026-05-28", total: 14 },
            { date: "2026-05-29", total: 18 },
            { date: "2026-05-30", total: 13 },
            { date: "2026-05-31", total: 25 },
            { date: "2026-06-01", total: 31 },
            { date: "2026-06-02", total: 27 }
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

  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan">Analytics</p>
        <h1 className="font-display text-3xl">{analytics.totalClicks} Total Clicks</h1>
      </div>

      <div className="h-[360px] rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={analytics.byDay}>
            <defs>
              <linearGradient id="clicks" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#20F7FF" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#20F7FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="date" stroke="#8EA4C8" />
            <YAxis stroke="#8EA4C8" />
            <Tooltip contentStyle={{ background: "#0B1026", border: "1px solid rgba(32,247,255,0.28)", borderRadius: 16 }} />
            <Area type="monotone" dataKey="total" stroke="#20F7FF" fill="url(#clicks)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
