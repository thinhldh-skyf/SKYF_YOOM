import { auth, currentUser } from "@clerk/nextjs/server"; // dùng đúng phiên bản
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user?.emailAddresses[0]?.emailAddress) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user.emailAddresses[0].emailAddress;
  if (!email) return NextResponse.json([], { status: 401 });

  const isAdmin = email === "admin@skytutor.com";

  const meetings = await db.meeting.findMany({
    where: isAdmin
      ? {}
      : {
          OR: [{ studentEmail: email }, { tutorEmail: email }],
        },
    orderBy: { startsAt: "asc" },
  });

  return NextResponse.json(meetings);
}
