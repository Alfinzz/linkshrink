import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Link2, ArrowRight, BarChart3, Shield } from "lucide-react";
import api from "../lib/axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms of Service");
      return;
    }

    try {
      const { data } = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password
      });
      localStorage.setItem("linkshrink_token", data.token);
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed");
    }
  }

  return (
    <main className="min-h-screen flex bg-white">
      {/* Left Blue Panel */}
      <div className="hidden lg:flex lg:w-[38%] relative overflow-hidden flex-col justify-between p-10 text-white"
        style={{ background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #1D4ED8 100%)" }}
      >
        <div>
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8">
            <Link2 size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold leading-snug">Join LinkShrink</h2>
          <p className="text-blue-100 mt-2 text-sm leading-relaxed max-w-xs">
            Start managing your links with precision and clarity.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <BarChart3 size={16} />
            </div>
            <span className="text-sm font-medium">Real-time Analytics</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Shield size={16} />
            </div>
            <span className="text-sm font-medium">Secure Infrastructure</span>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <form onSubmit={submit} className="w-full max-w-lg">
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 mt-1">Manage your digital footprint efficiently.</p>

            <div className="mt-8 space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="register-name" className="label-text">Full Name</label>
                <input
                  id="register-name"
                  className="input-field"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="register-email" className="label-text">Email Address</label>
                <input
                  id="register-email"
                  className="input-field"
                  placeholder="john@example.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              {/* Password row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="register-password" className="label-text">Password</label>
                  <input
                    id="register-password"
                    className="input-field"
                    placeholder="••••••••"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label htmlFor="register-confirm-password" className="label-text">Confirm Password</label>
                  <input
                    id="register-confirm-password"
                    className="input-field"
                    placeholder="••••••••"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <button type="button" className="text-primary-600 font-medium hover:text-primary-700">
                    Terms of Service
                  </button>
                </span>
              </label>

              {error && (
                <div className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-600">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button className="btn-primary w-full py-3" type="submit">
                Create Account <ArrowRight size={16} />
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link className="font-semibold text-primary-600 hover:text-primary-700" to="/login">
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 text-center">
          <p className="text-xs text-gray-400">© 2024 LinkShrink SaaS Platform. All rights reserved.</p>
          <div className="mt-1 flex items-center justify-center gap-4 text-xs text-gray-400">
            <button type="button" className="hover:text-gray-600">Privacy Policy</button>
            <button type="button" className="hover:text-gray-600">Support</button>
          </div>
        </div>
      </div>
    </main>
  );
}
