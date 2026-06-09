import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "belgrave_session";
const SESSION_VALUE = "authenticated";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated =
    request.cookies.get(SESSION_COOKIE)?.value === SESSION_VALUE;

  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    if (isAuthenticated && pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
