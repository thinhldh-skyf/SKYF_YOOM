import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

export async function GET(req: Request) {
  const serverClient = StreamChat.getInstance(
    "7m7pmhda3pcj",
    "meevbeubtfs2pfhwk57kj7gcywmqb3mwh7pv4zaje4j9vhpmfbq69z3a357xkn8v"
  );

  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const token = serverClient.createToken(userId);
  return NextResponse.json({ token });
}
