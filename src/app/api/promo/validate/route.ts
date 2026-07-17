import { NextResponse } from "next/server";
import { validatePromoCode } from "@/lib/promoCodes/redeem";
import { parseValidateRequest } from "@/lib/promoCodes/validation";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_code", message: "Invalid request body." },
      { status: 400 }
    );
  }

  try {
    const { code } = parseValidateRequest(body);
    const result = await validatePromoCode(code);

    if (!result.ok) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request.";

    return NextResponse.json(
      { ok: false, error: "invalid_code", message },
      { status: 400 }
    );
  }
}
