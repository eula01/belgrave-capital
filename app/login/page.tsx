"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Disclaimer from "@/components/Disclaimer";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const username = String(form.get("username") ?? "");
    const password = String(form.get("password") ?? "");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, rememberMe }),
    });

    if (!res.ok) {
      setError("invalid credentials");
      setLoading(false);
      return;
    }

    const next = searchParams.get("from") || "/";
    router.push(next);
    router.refresh();
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1>belgrave capital ltd — client login</h1>
      <label>
        user
        <input name="username" type="text" autoComplete="username" required />
      </label>
      <label>
        pass
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      <label className="login-remember">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        remember me
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "..." : "enter"}
      </button>
      {error ? <p className="login-error">{error}</p> : null}
      <p className="login-back">
        <a href="/">← back to site</a>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="login-page">
      <div>
        <Suspense>
          <LoginForm />
        </Suspense>
        <Disclaimer className="disclaimer login-disclaimer" />
      </div>
    </div>
  );
}
