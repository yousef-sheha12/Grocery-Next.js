import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    "/login",
    "/register",
    "/forget-pass",
    "/otp",
    "/reset-pass",
    "/set-new-pass",
  ];

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  if (!token && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.svg).*)",
  ],
};
