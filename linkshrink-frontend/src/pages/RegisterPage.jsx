import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/register", form);
      localStorage.setItem("linkshrink_token", data.token);
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed");
    }
  }

  return (
    <main className="page-shell grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="glass-panel w-full max-w-md rounded-[2rem] p-8">
        <p className="font-display text-3xl">Create Orbit</p>
        <p className="mt-2 text-comet">Register a LinkShrink workspace.</p>
        <div className="mt-8 grid gap-4">
          <input className="input-field" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <input className="input-field" placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <input className="input-field" placeholder="Password min. 8 chars" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          {error ? <p className="text-sm text-plasma">{error}</p> : null}
          <button className="neon-button" type="submit">Register</button>
          <p className="text-sm text-comet">
            Already have an account? <Link className="text-cyan" to="/login">Login</Link>
          </p>
        </div>
      </form>
    </main>
  );
}
