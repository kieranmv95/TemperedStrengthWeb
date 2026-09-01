import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { safePortalNext } from "@/lib/portal/authRedirect";

function publicOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (process.env.NODE_ENV !== "development" && forwardedHost) {
    return `https://${forwardedHost}`;
  }
  return request.nextUrl.origin;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const origin = publicOrigin(request);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const safeNext = safePortalNext(searchParams.get("next"));

  if (tokenHash) {
    const confirmUrl = new URL("/portal/auth/confirm", origin);
    confirmUrl.searchParams.set("token_hash", tokenHash);
    const type = searchParams.get("type");
    if (type) confirmUrl.searchParams.set("type", type);
    confirmUrl.searchParams.set("next", safeNext);
    return NextResponse.redirect(confirmUrl);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/portal/login?error=auth`);
  }

  const successRedirect = NextResponse.redirect(`${origin}${safeNext}`);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            successRedirect.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/portal/login?error=auth&message=${encodeURIComponent(error.message)}`
    );
  }

  return successRedirect;
}
