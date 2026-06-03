export default function SettingsPage() {
  return (
    <section className="glass-panel rounded-[2rem] p-6">
      <p className="text-sm uppercase tracking-[0.25em] text-plasma">Settings</p>
      <h1 className="mt-2 font-display text-3xl">Workspace Controls</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-comet">
          Default domain
          <input className="input-field" placeholder="https://linkshrink-backend.vercel.app" />
        </label>
        <label className="grid gap-2 text-sm text-comet">
          Brand name
          <input className="input-field" placeholder="LinkShrink" />
        </label>
      </div>
    </section>
  );
}
