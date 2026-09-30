"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AdminTokenContext = createContext<string | null>(null);

export function useAdminToken() {
  return useContext(AdminTokenContext);
}

export default function AdminTokenProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/token")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setToken(d.token))
      .catch(() => setToken(null));
  }, []);

  if (!token) return <div style={{ padding: 24, fontFamily: "system-ui" }}>Loading admin session…</div>;

  return <AdminTokenContext.Provider value={token}>{children}</AdminTokenContext.Provider>;
}