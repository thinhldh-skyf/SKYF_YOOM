import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  const { tutorId, price, time, description, email } = await req.json();

  const selectedTime = new Date(time);
  const conflict = await db.meeting.findFirst({
    where: {
      OR: [
        {
          tutorEmail: email,
          startsAt: {
            lt: new Date(new Date(selectedTime).getTime() + 60 * 60 * 1000),
            gt: new Date(new Date(selectedTime).getTime() - 60 * 60 * 1000),
          },
        },
        {
          studentEmail: email,
          startsAt: {
            lt: new Date(new Date(selectedTime).getTime() + 60 * 60 * 1000),
            gt: new Date(new Date(selectedTime).getTime() - 60 * 60 * 1000),
          },
        },
      ],
    },
  });

  if (conflict) {
    return NextResponse.json(
      {
        error: "This time slot is already booked. Please choose another time.",
      },
      { status: 400 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Lesson with tutor ID ${tutorId}`,
          },
          unit_amount: Math.max(price * 100, 50), // $12.30
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/meeting-success?description=${encodeURIComponent(
      description
    )}&time=${time}&email=${email}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment?status=cancel`,
  });

  return NextResponse.json({ url: session.url });
}
