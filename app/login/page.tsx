"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      body: JSON.stringify({ username, password }),
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
      <button type="submit" disabled={loading}>
        {loading ? "..." : "enter"}
      </button>
      {error ? <p className="login-error">{error}</p> : null}
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="login-page">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
