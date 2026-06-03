export default function StatCard({ label, value, accent = "cyan" }) {
  const accentClass = accent === "plasma" ? "text-plasma shadow-magenta" : "text-cyan shadow-neon";

  return (
    <div className="glass-panel rounded-[1.75rem] p-5">
      <p className="text-sm uppercase tracking-[0.25em] text-comet">{label}</p>
      <p className={`mt-4 font-display text-4xl ${accentClass}`}>{value}</p>
    </div>
  );
}
