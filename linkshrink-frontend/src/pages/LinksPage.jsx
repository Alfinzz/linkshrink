import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Copy, BarChart3, Trash2, Search, Download, Link2, Check, ExternalLink } from "lucide-react";
import api, { getBackendOrigin } from "../lib/axios";
import Toast from "../components/Toast.jsx";

export default function LinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const backendOrigin = getBackendOrigin();

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, key: Date.now() });
  }, []);

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

  function exportCSV() {
    if (links.length === 0) {
      showToast("No links to export", "info");
      return;
    }
    const headers = "Title,Short URL,Original URL,Clicks,Status,Created\n";
    const rows = links
      .map((link) => {
        const shortUrl = `${backendOrigin}/${link.slug}`;
        return `"${link.title || 'Untitled'}","${shortUrl}","${link.originalUrl}",${link._count?.clicks || 0},${link.isArchived ? "Archived" : "Live"},"${new Date(link.createdAt).toLocaleDateString()}"`;
      })
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "linkshrink_export.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported successfully! 📁");
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
      {/* Toast */}
      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">My Links</h1>
          <p className="page-subtitle">
            <span className="font-semibold text-primary-600">{links.length}</span> links total
          </p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={exportCSV}
        >
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
              <tr className="border-b border-gray-100 bg-gray-50/60">
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
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-10" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-14" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                  </tr>
                ))
              ) : filteredLinks.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center text-gray-400" colSpan="7">
                    <div className="flex flex-col items-center gap-2">
                      <Link2 size={32} className="text-gray-300" />
                      <p className="font-medium">{search ? "No links match your search" : "No links yet"}</p>
                      <p className="text-xs">{search ? "Try adjusting your search terms" : "Go to Dashboard to create your first link"}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => {
                  const shortUrl = `${backendOrigin}/${link.slug}`;
                  const isCopied = copiedId === link.id;
                  return (
                    <tr key={link.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{link.title || "Untitled"}</td>
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
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{link.originalUrl}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">{(link._count?.clicks || 0).toLocaleString()}</span>
                          {(link._count?.clicks || 0) === 0 && (
                            <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">new</span>
                          )}
                        </div>
                      </td>
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
                            onClick={() => copyToClipboard(shortUrl, link.id)}
                            title="Copy"
                          >
                            {isCopied ? <Check size={16} /> : <Copy size={16} />}
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
