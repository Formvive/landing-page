import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check custom token or Google token
  const token = request.cookies.get("authToken")?.value || request.cookies.get("_vercel_jwt")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Optional: decode token and check expiry
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
