import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import db from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds, data } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  if (!data || data.length === 0) {
    return new NextResponse("Quantities are required", { status: 400 });
  }

  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  data.forEach((product: any) => {
    line_items.push({
      quantity: product.quantity,
      price_data: {
        currency: "INR",
        product_data: {
          name: product.name,
        },
        unit_amount: Number(product.price) * 100,
      },
    });
  });

  const order = await db.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: data.map((product: any) => ({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
        })),
      },
    },
  });

  // const order = await db.order.create({
  //   data: {
  //     storeId: params.storeId,
  //     isPaid: false,
  //     orderItems: {
  //       create: productIds.map((productId: string) => ({
  //         product: {
  //           connect: {
  //             id: productId,
  //           },
  //         },
  //       })),
  //     },
  //   },
  // });

  const newProductData = data.map((item: any) => ({
    id: item.id,
    quantity: item.maxQty - item.quantity,
  }));

  console.log(newProductData);

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
      data: JSON.stringify(newProductData),
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
