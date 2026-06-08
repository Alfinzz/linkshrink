import { BarChart3, Gauge, Link2, LogOut, Plus, Settings, HelpCircle, Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/links", label: "My Links", icon: Link2 },
  { to: "/analytics/demo", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings }
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function logout() {
    localStorage.removeItem("linkshrink_token");
    localStorage.removeItem("linkshrink_user");
    navigate("/login", { replace: true });
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 pt-5 pb-2">
        <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center shadow-md">
          <Link2 size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">LinkShrink</p>
          <p className="text-[10px] text-gray-400 leading-tight">SaaS Platform</p>
        </div>
      </div>

      {/* Shrink URL Button */}
      <div className="px-4 mt-4 mb-2">
        <button
          type="button"
          onClick={() => {
            navigate("/");
            setMobileOpen(false);
          }}
          className="btn-primary w-full py-2.5 text-sm"
        >
          <Plus size={16} />
          Shrink URL
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                ].join(" ")
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer links */}
      <div className="px-3 pb-5 space-y-1">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-900"
        >
          <HelpCircle size={18} />
          Support
        </button>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors duration-150 hover:bg-danger-50 hover:text-danger-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        type="button"
        className="lg:hidden fixed top-3 left-3 z-50 rounded-lg p-2 bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50 transition"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-40 flex h-screen w-60 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 z-30 h-screen w-60 flex-col border-r border-gray-200 bg-white">
        {sidebarContent}
      </aside>
    </>
  );
}
