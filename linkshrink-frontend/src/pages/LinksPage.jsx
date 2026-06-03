import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getBackendOrigin } from "../lib/axios";

export default function LinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendOrigin = getBackendOrigin();

  useEffect(() => {
    async function fetchLinks() {
      const { data } = await api.get("/links");
      setLinks(data.links || []);
      setLoading(false);
    }

    fetchLinks().catch(() => setLoading(false));
  }, []);

  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <div className="mb-6">
        <h1 className="font-display text-3xl">My Links</h1>
        <p className="text-comet">Data table sourced from `/api/links`.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-y-3 text-left">
          <thead className="text-xs uppercase tracking-[0.22em] text-comet">
            <tr>
              <th className="px-4">Title</th>
              <th className="px-4">Short URL</th>
              <th className="px-4">Clicks</th>
              <th className="px-4">Status</th>
              <th className="px-4">Analytics</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-5 text-comet" colSpan="5">Loading...</td></tr>
            ) : links.map((link) => (
              <tr key={link.id} className="bg-white/[0.05]">
                <td className="rounded-l-2xl px-4 py-4 font-semibold">{link.title || "Untitled"}</td>
                <td className="px-4 py-4 text-cyan">{backendOrigin}/{link.slug}</td>
                <td className="px-4 py-4">{link._count?.clicks || 0}</td>
                <td className="px-4 py-4">{link.isArchived ? "Archived" : "Live"}</td>
                <td className="rounded-r-2xl px-4 py-4">
                  <Link className="text-plasma hover:underline" to={`/analytics/${link.id}`}>Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
