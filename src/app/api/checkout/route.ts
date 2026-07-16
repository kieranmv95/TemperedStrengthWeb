import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";

type CheckoutRequestBody = {
  variantId?: unknown;
};

export async function POST(request: Request) {
  let body: CheckoutRequestBody;

  try {
    body = (await request.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.variantId !== "string" || body.variantId.trim() === "") {
    return NextResponse.json({ error: "Missing variantId" }, { status: 400 });
  }

  try {
    const mutation = `
      mutation CartCreate($lines: [CartLineInput!]) {
        cartCreate(input: { lines: $lines }) {
          cart {
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await shopifyFetch<{
      cartCreate: {
        cart: { checkoutUrl: string } | null;
        userErrors: Array<{ field: string[] | null; message: string }>;
      };
    }>(mutation, {
      lines: [{ merchandiseId: body.variantId, quantity: 1 }],
    });

    const { cart, userErrors } = data.cartCreate;

    if (userErrors.length > 0) {
      return NextResponse.json({ error: userErrors[0].message }, { status: 400 });
    }

    if (!cart?.checkoutUrl) {
      return NextResponse.json(
        { error: "Checkout URL was not returned." },
        { status: 502 }
      );
    }

    return NextResponse.json({ checkoutUrl: cart.checkoutUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
