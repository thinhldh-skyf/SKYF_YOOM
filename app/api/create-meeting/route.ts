import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    const user = await currentUser();
    if (!userId || !user?.emailAddresses[0]?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tutorEmail, startsAt, description, callId } = await req.json();

    if (!tutorEmail || !startsAt || !callId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const userEmail = user.emailAddresses[0].emailAddress;


    const meeting = await db.meeting.create({
      data: {
        callId,
        studentEmail: userEmail,
        tutorEmail,
        description,
        startsAt: new Date(startsAt),
      },
    });

    return NextResponse.json(meeting);
  } catch (error) {
    console.error("❌ API create-meeting error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
