"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) router.push("/admin");
    else setError("Incorrect email or password.");
  }

  return (
    <div style={{ maxWidth: 380, margin: "80px auto", padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: "1.4rem", marginBottom: 20 }}>Admin sign in</h1>
      <form onSubmit={submit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email"
          style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ccc", borderRadius: 6 }} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password"
          style={{ width: "100%", padding: 10, marginBottom: 14, border: "1px solid #ccc", borderRadius: 6 }} />
        {error && <p style={{ color: "crimson", marginBottom: 10 }}>{error}</p>}
        <button type="submit" style={{ width: "100%", padding: 12, background: "#0F2A4A", color: "#fff", border: 0, borderRadius: 6 }}>
          Sign in
        </button>
      </form>
    </div>
  );
}
