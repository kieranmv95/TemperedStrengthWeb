import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const code = request.nextUrl.searchParams.get("code");

  // Supabase magic links sometimes land on Site URL (/) with ?code= when the
  // callback URL is not allowlisted — forward to the portal auth handler.
  if (code && pathname !== "/portal/auth/callback") {
    const callbackUrl = request.nextUrl.clone();
    callbackUrl.pathname = "/portal/auth/callback";
    if (!callbackUrl.searchParams.has("next")) {
      callbackUrl.searchParams.set("next", "/portal");
    }
    return NextResponse.redirect(callbackUrl);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicPortalRoute =
    pathname === "/portal/login" ||
    pathname === "/portal/setup" ||
    pathname.startsWith("/portal/auth/");

  if (pathname.startsWith("/portal") && !isPublicPortalRoute && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/portal/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/portal/login" && user) {
    const portalUrl = request.nextUrl.clone();
    portalUrl.pathname = "/portal";
    portalUrl.search = "";
    return NextResponse.redirect(portalUrl);
  }

  if (pathname === "/portal/setup" && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/portal/login";
    loginUrl.searchParams.set("next", "/portal/setup");
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
