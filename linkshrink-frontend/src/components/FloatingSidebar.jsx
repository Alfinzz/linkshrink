import { BarChart3, Gauge, Link2, LogOut, Settings } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/links", label: "My Links", icon: Link2 },
  { to: "/analytics/demo", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings }
];

export default function FloatingSidebar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("linkshrink_token");
    navigate("/login", { replace: true });
  }

  return (
    <aside className="glass-panel sticky top-4 z-10 flex h-fit w-full flex-col rounded-[2rem] p-4 md:w-72">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan/50 bg-cyan/15 text-xl font-black text-cyan shadow-neon">
          LS
        </div>
        <div>
          <p className="font-display text-lg tracking-[0.22em] text-starlight">LINKSHRINK</p>
          <p className="text-xs uppercase tracking-[0.34em] text-comet">anti-gravity links</p>
        </div>
      </div>

      <nav className="grid gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                  isActive
                    ? "border border-cyan/40 bg-cyan/15 text-cyan shadow-neon"
                    : "text-comet hover:bg-white/[0.07] hover:text-starlight"
                ].join(" ")
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-6 flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-plasma transition hover:bg-plasma/10"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
