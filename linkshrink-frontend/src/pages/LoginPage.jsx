import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("linkshrink_token", data.token);
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed");
    }
  }

  return (
    <main className="page-shell grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="glass-panel w-full max-w-md rounded-[2rem] p-8">
        <p className="font-display text-3xl">LinkShrink</p>
        <p className="mt-2 text-comet">Enter the orbital console.</p>
        <div className="mt-8 grid gap-4">
          <input className="input-field" placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <input className="input-field" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          {error ? <p className="text-sm text-plasma">{error}</p> : null}
          <button className="neon-button" type="submit">Login</button>
          <p className="text-sm text-comet">
            New here? <Link className="text-cyan" to="/register">Create account</Link>
          </p>
        </div>
      </form>
    </main>
  );
}
