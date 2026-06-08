import { Outlet } from "react-router-dom";
import { Search, Bell, User } from "lucide-react";
import Sidebar from "../components/FloatingSidebar.jsx";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main content area */}
      <div className="ml-60 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm px-6 py-3">
          {/* Search */}
          <div className="relative max-w-md flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search links..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button type="button" className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
              <User size={16} />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 animate-fadeIn">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
