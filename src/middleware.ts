import { NextRequest, NextResponse } from "next/server";

function isValidAdminBasicAuth(authHeader: string | null, password: string): boolean {
  if (!authHeader?.startsWith("Basic ")) return false;
  try {
    const decoded = atob(authHeader.slice(6));
    const [, providedPassword] = decoded.split(":");
    return providedPassword === password;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    if (process.env.NODE_ENV === "development") return NextResponse.next();
    return new NextResponse("Admin no configurado", { status: 503 });
  }

  if (isValidAdminBasicAuth(request.headers.get("authorization"), adminPassword)) {
    return NextResponse.next();
  }

  return new NextResponse("Autenticación requerida", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="JUNUBA Admin"' },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
