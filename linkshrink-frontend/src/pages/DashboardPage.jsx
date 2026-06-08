import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Link2, Copy, MousePointerClick, MapPin, Trash2, BarChart3, ChevronLeft, ChevronRight, ChevronDown, Check, ExternalLink } from "lucide-react";
import api, { getBackendOrigin } from "../lib/axios";
import StatCard from "../components/StatCard.jsx";
import Toast from "../components/Toast.jsx";

export default function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState({ originalUrl: "", title: "", slug: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [stats, setStats] = useState({ totalClicks: 0, activeLinks: 0, topLocation: "No traffic yet" });
  const [statsLoading, setStatsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const perPage = 5;

  // Get real user name from localStorage
  const storedUser = JSON.parse(localStorage.getItem("linkshrink_user") || "{}");
  const userName = storedUser.name || storedUser.email?.split("@")[0] || "there";

  const backendOrigin = getBackendOrigin();
  const totalClicks = useMemo(
    () => links.reduce((sum, link) => sum + (link._count?.clicks || 0), 0),
    [links]
  );

  const paginatedLinks = useMemo(() => {
    const start = (page - 1) * perPage;
    return links.slice(start, start + perPage);
  }, [links, page]);

  const totalPages = Math.ceil(links.length / perPage);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, key: Date.now() });
  }, []);

  async function fetchStats() {
    setStatsLoading(true);
    try {
      const { data } = await api.get("/links/stats");
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }

  async function fetchLinks() {
    setError("");
    setLoading(true);

    try {
      const { data } = await api.get("/links");
      setLinks(data.links || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load links");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLinks();
    fetchStats();
  }, []);

  async function createLink(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        originalUrl: form.originalUrl,
        title: form.title || undefined,
        slug: form.slug || undefined
      };
      const { data } = await api.post("/links", payload);
      setLinks((current) => [data.link, ...current]);
      setForm({ originalUrl: "", title: "", slug: "" });
      setShowAdvanced(false);
      fetchStats();
      showToast("Link created successfully! 🎉");
    } catch (requestError) {
      const msg = requestError.response?.data?.message || "Could not create link";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteLink(linkId) {
    try {
      await api.delete(`/links/${linkId}`);
      setLinks((current) => current.filter((l) => l.id !== linkId));
      fetchStats();
      showToast("Link deleted successfully");
    } catch {
      showToast("Failed to delete link", "error");
    }
  }

  async function copyToClipboard(text, linkId) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(linkId);
      showToast("Copied to clipboard! 📋");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast("Failed to copy", "error");
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  }

  return (
    <section className="space-y-6 animate-slideUp">
      {/* Toast */}
      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Welcome Header */}
      <div>
        <h1 className="page-title">Welcome back, {userName}! 👋</h1>
        <p className="page-subtitle">
          You have <span className="font-semibold text-primary-600">{links.length}</span> active links tracking <span className="font-semibold text-primary-600">{totalClicks.toLocaleString()}</span> clicks.
        </p>
      </div>

      {/* Shorten URL Bar */}
      <div className="card p-5">
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-3">✨ Shorten a new link</p>
        <form onSubmit={createLink} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Link2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="input-field pl-10"
                placeholder="Paste your long URL here... (e.g. https://example.com/very-long-path)"
                value={form.originalUrl}
                onChange={(e) => setForm({ ...form, originalUrl: e.target.value })}
                required
                type="url"
              />
            </div>
            <button
              className="btn-primary whitespace-nowrap"
              disabled={saving || !form.originalUrl.trim()}
              type="submit"
            >
              <Link2 size={16} />
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Shrinking...
                </>
              ) : (
                "Shrink It!"
              )}
            </button>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-semibold text-gray-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
            >
              {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
              <ChevronDown size={14} className={`transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`} />
            </button>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100 animate-slideUp">
              <div>
                <label className="label-text">Title / Alias (Optional)</label>
                <input
                  className="input-field"
                  placeholder="e.g. My Personal Portfolio"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className="label-text">Custom Slug (Optional)</label>
                <input
                  className="input-field"
                  placeholder="e.g. portfolio"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
            </div>
          )}
        </form>
        {error && (
          <div className="mt-3 rounded-lg border border-danger-200 bg-danger-50 px-4 py-2.5 text-sm text-danger-600 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Clicks"
          value={stats.totalClicks.toLocaleString()}
          subtitle="↗ Real-time tracking"
          icon={MousePointerClick}
          loading={statsLoading}
        />
        <StatCard
          label="Active Links"
          value={stats.activeLinks}
          subtitle={`${Math.min(stats.activeLinks * 2, 100)}% of capacity`}
          icon={Link2}
          loading={statsLoading}
        />
        <StatCard
          label="Top Location"
          value={stats.topLocationRaw || "No traffic yet"}
          subtitle={stats.topLocation || "No traffic yet"}
          icon={MapPin}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          loading={statsLoading}
        />
      </div>

      {/* My Links Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">My Links</h2>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {links.length}
            </span>
          </div>
          <Link className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1" to="/links">
            View all <ExternalLink size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Original URL</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Short URL</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Clicks</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Created</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-36" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                  </tr>
                ))
              ) : paginatedLinks.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center text-gray-400" colSpan="5">
                    <div className="flex flex-col items-center gap-2">
                      <Link2 size={32} className="text-gray-300" />
                      <p className="font-medium">No links yet</p>
                      <p className="text-xs">Create your first short link above to get started!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLinks.map((link) => {
                  const shortUrl = `${backendOrigin}/${link.slug}`;
                  const isCopied = copiedId === link.id;
                  return (
                    <tr key={link.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="max-w-[220px]">
                          <p className="text-sm font-medium text-gray-900 truncate">{link.title || link.originalUrl}</p>
                          <p className="text-xs text-gray-400 truncate">{link.originalUrl}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition-colors truncate max-w-[180px]"
                          >
                            {shortUrl.replace(/^https?:\/\//, '')}
                          </a>
                          <button
                            type="button"
                            className={`rounded-md p-1.5 transition-all duration-200 ${
                              isCopied
                                ? "bg-green-100 text-green-600"
                                : "text-gray-400 hover:bg-primary-50 hover:text-primary-600"
                            }`}
                            onClick={() => copyToClipboard(shortUrl, link.id)}
                            title="Copy Short URL"
                          >
                            {isCopied ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">{(link._count?.clicks || 0).toLocaleString()}</span>
                          {(link._count?.clicks || 0) === 0 && (
                            <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">new</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(link.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/analytics/${link.id}`}
                            className="rounded-lg p-2 text-gray-400 hover:bg-primary-50 hover:text-primary-600 transition"
                            title="View Analytics"
                          >
                            <BarChart3 size={16} />
                          </Link>
                          <button
                            type="button"
                            className="rounded-lg p-2 text-gray-400 hover:bg-danger-50 hover:text-danger-500 transition"
                            onClick={() => deleteLink(link.id)}
                            title="Delete Link"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages} · {links.length} links total
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40"
              >
                <ChevronLeft size={14} />
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
