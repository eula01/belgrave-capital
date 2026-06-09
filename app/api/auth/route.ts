import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "belgrave_session";
const SESSION_VALUE = "authenticated";

function validCredentials(username: string, password: string) {
  const expectedUser = process.env.BELGRAVE_USERNAME ?? "client";
  const expectedPass = process.env.BELGRAVE_PASSWORD ?? "belgrave2026";
  return username === expectedUser && password === expectedPass;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const username = String(body.username ?? "");
  const password = String(body.password ?? "");

  if (!validCredentials(username, password)) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
