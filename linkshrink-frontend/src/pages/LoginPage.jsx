import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Link2 } from "lucide-react";
import api from "../lib/axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("linkshrink_token", data.token);
      localStorage.setItem("linkshrink_user", JSON.stringify(data.user));
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed");
    }
  }

  return (
    <main className="min-h-screen flex">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col items-center justify-center p-12"
        style={{
          background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 30%, #e0e7ff 60%, #f1f5f9 100%)"
        }}
      >
        {/* Abstract Branding Graphic */}
        <div className="relative w-72 h-72 mb-8">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-300/60 to-gray-400/40 backdrop-blur-sm shadow-xl rotate-3" />
          <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-sm flex items-center justify-center">
            <div className="relative">
              {/* Concentric circles */}
              <div className="w-40 h-40 rounded-full border-2 border-primary-400/30 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                <div className="w-28 h-28 rounded-full border-2 border-primary-500/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-primary-600/50 flex items-center justify-center">
                    <Link2 size={28} className="text-primary-600" />
                  </div>
                </div>
              </div>
              {/* Orbital dots */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2.5 h-2.5 rounded-full bg-primary-500" />
              <div className="absolute bottom-2 right-0 w-2 h-2 rounded-full bg-primary-400" />
              <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1 w-2 h-2 rounded-full bg-primary-300" />
            </div>
          </div>
          <p className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm font-bold tracking-[0.3em] text-primary-600/70 uppercase">
            ConnectFlow
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 text-center leading-snug mt-4">
          Simplify your digital<br />footprint.
        </h2>
        <p className="text-gray-500 text-center mt-4 max-w-xs text-sm leading-relaxed">
          Track, manage, and optimize every link you share with our enterprise-grade analytics suite.
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-8 pt-6">
          <Link2 size={22} className="text-primary-600" />
          <span className="text-lg font-bold text-primary-600">LinkShrink</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <form onSubmit={submit} className="w-full max-w-md">
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-1">Enter your credentials to access your dashboard</p>

            <div className="mt-8 space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="login-email" className="label-text">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="login-email"
                    className="input-field pl-10"
                    placeholder="name@company.com"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="text-sm font-medium text-gray-700">Password</label>
                  <button type="button" className="text-xs font-medium text-primary-600 hover:text-primary-700">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="login-password"
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Device */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">Remember this device</span>
              </label>

              {error && (
                <div className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-600">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button className="btn-primary w-full py-3" type="submit">
                Sign In <ArrowRight size={16} />
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400 tracking-wider">Or continue with</span>
                </div>
              </div>

              {/* Google Button */}
              <button type="button" className="btn-secondary w-full py-3">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link className="font-semibold text-primary-600 hover:text-primary-700" to="/register">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 text-center text-xs text-gray-400">
          © 2024 LinkShrink. All rights reserved.
        </div>
      </div>
    </main>
  );
}
