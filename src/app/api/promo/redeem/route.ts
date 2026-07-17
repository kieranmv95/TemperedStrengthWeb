import { NextResponse } from "next/server";
import { redeemPromoCode } from "@/lib/promoCodes/redeem";
import { parseRedeemRequest, validateEmailFormat } from "@/lib/promoCodes/validation";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_email", message: "Invalid request body." },
      { status: 400 }
    );
  }

  try {
    const { code, email, password } = parseRedeemRequest(body);

    if (!validateEmailFormat(email)) {
      return NextResponse.json(
        {
          ok: false,
          error: "invalid_email",
          message: "Invalid email address.",
        },
        { status: 400 }
      );
    }

    const result = await redeemPromoCode({ code, email, password });

    if (!result.ok) {
      const status =
        result.error === "invalid_code" || result.error === "exhausted"
          ? 404
          : 400;

      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request.";

    return NextResponse.json(
      { ok: false, error: "invalid_email", message },
      { status: 400 }
    );
  }
}
