import { Outlet } from "react-router-dom";
import { Bell, User } from "lucide-react";
import Sidebar from "../components/FloatingSidebar.jsx";

export default function AppLayout() {
  // Read real user name from localStorage
  const storedUser = JSON.parse(localStorage.getItem("linkshrink_user") || "{}");
  const userName = storedUser.name || storedUser.email?.split("@")[0] || "User";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main content area */}
      <div className="lg:ml-60 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex items-center justify-end gap-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm px-6 py-3">
          {/* Right side */}
          <div className="flex items-center gap-3">
            <button type="button" className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                {initials}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-700">{userName}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 animate-fadeIn">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
