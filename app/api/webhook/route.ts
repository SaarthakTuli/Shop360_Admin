import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import db from "@/lib/prismadb";

export async function POST(req: Request) {
  const body = await req.json();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(", ");

  if (event.type === "checkout.session.completed") {
    console.log("Updating order");
    const order = await db.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
      },
      include: {
        orderItems: true,
      },
    });

    console.log("Updated order");

    console.log("Data is: ", session?.metadata?.data);

    const data = (session?.metadata?.data || []) as {
      id: string;
      quantity: number;
    }[];

    console.log("Dets: ", data);

    data.forEach(
      async (item) =>
        await db.product.update({
          where: {
            id: item.id,
          },
          data: {
            quantity: item.quantity,
          },
        })
    );

    // for (const item of data) {
    //   console.log(item);

    //   await db.product.update({
    //     where: {
    //       id: item.id,
    //     },
    //     data: {
    //       quantity: item.quantity,
    //     },
    //   });
    // }

    // await db.product.updateMany({
    //   where: {
    //     id: {
    //       in: [...productIds],
    //     },
    //   },
    //   data: {
    //     quantity: quantities.
    //   },
    // });

    console.log("Finished");
  }

  return new NextResponse(null, { status: 200 });
}
