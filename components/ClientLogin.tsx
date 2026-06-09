"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function ClientLogin({ className = "client-login-link" }: { className?: string }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/auth");
    const data = await res.json();
    setAuthenticated(Boolean(data.authenticated));
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthenticated(false);
  }

  if (!ready) return null;

  if (authenticated) {
    return (
      <button type="button" className={className} onClick={handleLogout}>
        Logout
      </button>
    );
  }

  return (
    <Link href="/login" className={className}>
      Client Login
    </Link>
  );
}
