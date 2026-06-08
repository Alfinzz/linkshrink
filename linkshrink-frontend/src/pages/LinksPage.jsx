import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, BarChart3, Pencil, Trash2, Search, Download } from "lucide-react";
import api, { getBackendOrigin } from "../lib/axios";

export default function LinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const backendOrigin = getBackendOrigin();

  useEffect(() => {
    async function fetchLinks() {
      const { data } = await api.get("/links");
      setLinks(data.links || []);
      setLoading(false);
    }

    fetchLinks().catch(() => setLoading(false));
  }, []);

  async function deleteLink(linkId) {
    try {
      await api.delete(`/links/${linkId}`);
      setLinks((current) => current.filter((l) => l.id !== linkId));
    } catch {
      // silently fail
    }
  }

  const filteredLinks = links.filter((link) => {
    const term = search.toLowerCase();
    return (
      !term ||
      (link.title || "").toLowerCase().includes(term) ||
      link.originalUrl.toLowerCase().includes(term) ||
      link.slug.toLowerCase().includes(term)
    );
  });

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
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">My Links</h1>
          <p className="page-subtitle">{links.length} links total</p>
        </div>
        <button type="button" className="btn-secondary">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search links by title, URL, or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Title</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Short URL</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Original URL</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Clicks</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Status</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Created</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-6 py-8 text-center text-gray-400" colSpan="7">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : filteredLinks.length === 0 ? (
                <tr>
                  <td className="px-6 py-8 text-center text-gray-400" colSpan="7">
                    {search ? "No links match your search." : "No links yet."}
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => {
                  const shortUrl = `${backendOrigin}/${link.slug}`;
                  return (
                    <tr key={link.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{link.title || "Untitled"}</td>
                      <td className="px-6 py-4 text-sm font-medium text-primary-600">{shortUrl.replace(/^https?:\/\//, '')}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{link.originalUrl}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{(link._count?.clicks || 0).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {link.isArchived ? (
                          <span className="badge-danger">Archived</span>
                        ) : (
                          <span className="badge-success">● Live</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(link.createdAt)}</td>
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
                            title="Copy"
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
      </div>
    </section>
  );
}
