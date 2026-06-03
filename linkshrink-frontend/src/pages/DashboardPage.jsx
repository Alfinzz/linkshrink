import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Copy, Rocket } from "lucide-react";
import api, { getBackendOrigin } from "../lib/axios";
import StatCard from "../components/StatCard.jsx";

export default function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState({ originalUrl: "", title: "", slug: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const backendOrigin = getBackendOrigin();
  const totalClicks = useMemo(
    () => links.reduce((sum, link) => sum + (link._count?.clicks || 0), 0),
    [links]
  );

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

  return (
    <section className="grid gap-6">
      <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 md:p-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-plasma/30 blur-3xl" />
        <div className="absolute -bottom-20 left-12 h-56 w-56 rounded-full bg-cyan/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan">
              <Rocket size={14} />
              Orbit control
            </p>
            <h1 className="font-display text-4xl leading-tight text-starlight md:text-6xl">
              Shrink URLs beyond gravity.
            </h1>
            <p className="mt-4 max-w-2xl text-comet">
              Create branded short links, track every redirect, and monitor click velocity from a decoupled REST backend.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Links" value={links.length} />
            <StatCard label="Clicks" value={totalClicks} accent="plasma" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <form onSubmit={createLink} className="glass-panel rounded-[2rem] p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan/15 text-cyan shadow-neon">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="font-display text-xl">Launch New Link</h2>
              <p className="text-sm text-comet">POST /api/links via Axios JWT interceptor</p>
            </div>
          </div>

          <div className="grid gap-4">
            <input
              className="input-field"
              placeholder="https://example.com/deep-space-campaign"
              value={form.originalUrl}
              onChange={(event) => setForm({ ...form, originalUrl: event.target.value })}
              required
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="input-field"
                placeholder="Campaign title"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
              />
              <input
                className="input-field"
                placeholder="custom-slug"
                value={form.slug}
                onChange={(event) => setForm({ ...form, slug: event.target.value })}
              />
            </div>
            {error ? <p className="rounded-2xl border border-plasma/30 bg-plasma/10 px-4 py-3 text-sm text-plasma">{error}</p> : null}
            <button className="neon-button w-full md:w-fit" disabled={saving} type="submit">
              {saving ? "Compressing..." : "Create Short Link"}
            </button>
          </div>
        </form>

        <div className="glass-panel rounded-[2rem] p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl">Recent Links</h2>
              <p className="text-sm text-comet">Live data from backend REST API</p>
            </div>
            <Link className="text-sm font-semibold text-cyan hover:underline" to="/links">
              View all
            </Link>
          </div>

          {loading ? (
            <p className="text-comet">Loading orbital telemetry...</p>
          ) : (
            <div className="grid gap-3">
              {links.slice(0, 5).map((link) => {
                const shortUrl = `${backendOrigin}/${link.slug}`;
                return (
                  <div key={link.id} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-starlight">{link.title || link.originalUrl}</p>
                        <a className="mt-1 block truncate text-sm text-cyan" href={shortUrl} target="_blank" rel="noreferrer">
                          {shortUrl}
                        </a>
                      </div>
                      <button
                        type="button"
                        className="rounded-xl border border-white/10 p-2 text-comet transition hover:text-cyan"
                        onClick={() => navigator.clipboard.writeText(shortUrl)}
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.22em] text-comet">
                      {link._count?.clicks || 0} clicks
                    </p>
                  </div>
                );
              })}
              {!links.length ? <p className="text-comet">No links yet. Create your first short link.</p> : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
