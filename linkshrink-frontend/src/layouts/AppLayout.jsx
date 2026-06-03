import { Outlet } from "react-router-dom";
import FloatingSidebar from "../components/FloatingSidebar.jsx";

export default function AppLayout() {
  return (
    <div className="page-shell">
      <div className="pointer-events-none fixed left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan/20 blur-3xl animate-pulseGlow" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-4 md:flex-row md:px-6 md:py-6">
        <FloatingSidebar />
        <main className="w-full flex-1 animate-rise">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
