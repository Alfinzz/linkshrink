import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Link2, Copy, MousePointerClick, MapPin, Pencil, Trash2, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import api, { getBackendOrigin } from "../lib/axios";
import StatCard from "../components/StatCard.jsx";

export default function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState({ originalUrl: "", title: "", slug: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 3;

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
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not create link");
    } finally {
      setSaving(false);
    }
  }

  async function deleteLink(linkId) {
    try {
      await api.delete(`/links/${linkId}`);
      setLinks((current) => current.filter((l) => l.id !== linkId));
    } catch {
      // silently fail
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
      {/* Welcome Header */}
      <div>
        <h1 className="page-title">Welcome back, Alex!</h1>
        <p className="page-subtitle">
          You have {links.length} active links tracking {totalClicks.toLocaleString()} clicks this month.
        </p>
      </div>

      {/* Shorten URL Bar */}
      <div className="card p-5">
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-3">Shorten a new link</p>
        <form onSubmit={createLink} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Link2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input-field pl-10"
              placeholder="https://very-long-and-complex-url-to-shrink.com/analytics/path"
              value={form.originalUrl}
              onChange={(e) => setForm({ ...form, originalUrl: e.target.value })}
              required
            />
          </div>
          <button className="btn-primary whitespace-nowrap" disabled={saving} type="submit">
            <Link2 size={16} />
            {saving ? "Shrinking..." : "Shrink"}
          </button>
        </form>
        {error && (
          <div className="mt-3 rounded-lg border border-danger-200 bg-danger-50 px-4 py-2.5 text-sm text-danger-600">
            {error}
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Clicks"
          value={totalClicks.toLocaleString()}
          subtitle="↗ +12.5% this week"
          icon={MousePointerClick}
        />
        <StatCard
          label="Active Links"
          value={links.length}
          subtitle={`${Math.min(links.length * 2, 100)}% of monthly limit used`}
          icon={Link2}
        />
        <StatCard
          label="Top Location"
          value="United States"
          subtitle="📍 California (28%)"
          icon={MapPin}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
      </div>

      {/* My Links Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">My Links</h2>
          <Link className="text-sm font-medium text-primary-600 hover:text-primary-700" to="/links">
            View all →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Original URL</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Short URL</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Clicks</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Created Date</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-6 py-8 text-center text-gray-400" colSpan="5">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                      Loading links...
                    </div>
                  </td>
                </tr>
              ) : paginatedLinks.length === 0 ? (
                <tr>
                  <td className="px-6 py-8 text-center text-gray-400" colSpan="5">
                    No links yet. Create your first short link above.
                  </td>
                </tr>
              ) : (
                paginatedLinks.map((link) => {
                  const shortUrl = `${backendOrigin}/${link.slug}`;
                  return (
                    <tr key={link.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="max-w-[200px]">
                          <p className="text-sm font-medium text-gray-900 truncate">{link.originalUrl}</p>
                          <p className="text-xs text-gray-400 truncate">{link.title || "Untitled"}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-primary-600">{shortUrl.replace(/^https?:\/\//, '')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-warning-600">{(link._count?.clicks || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(link.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/analytics/${link.id}`}
                            className="rounded-lg p-2 text-gray-400 hover:bg-primary-50 hover:text-primary-600 transition"
                            title="Analytics"
                          >
                            <BarChart3 size={16} />
                          </Link>
                          <button
                            type="button"
                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                            onClick={() => navigator.clipboard.writeText(shortUrl)}
                            title="Copy URL"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            type="button"
                            className="rounded-lg p-2 text-gray-400 hover:bg-danger-50 hover:text-danger-500 transition"
                            onClick={() => deleteLink(link.id)}
                            title="Delete"
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
        {links.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {Math.min(paginatedLinks.length, perPage)} of {links.length} links
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
