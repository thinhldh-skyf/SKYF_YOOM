"use client";
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

export default function MeetingSuccess() {
  const params = useSearchParams();
  const router = useRouter();
  const client = useStreamVideoClient();

  const description = params.get("description");
  const meetingTime = params.get("time");
  const tutorEmail = params.get("email");

  const hasRun = useRef(false);

  const { user } = useUser();

  useEffect(() => {
    if (hasRun.current || !client || !user?.emailAddresses?.[0]?.emailAddress)
      return;

    hasRun.current = true;

    const createAndRedirectMeeting = async () => {
      const studentEmail = user.emailAddresses[0].emailAddress;
      const callId = crypto.randomUUID();
      const call = client.call("default", callId);

      try {
        await call.getOrCreate({
          data: {
            starts_at: meetingTime || undefined,
            custom: { description },
          },
        });

        // ✅ Gọi API để lưu vào database
        await fetch("/api/create-meeting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            callId,
            tutorEmail,
            startsAt: meetingTime,
            description,
          }),
        });

        toast.success("Meeting created successfully!");
        router.push(`/meeting/upcoming`);
      } catch (error) {
        console.error("Error creating meeting", error);
        toast.error("Failed to create meeting!");
      }
    };

    createAndRedirectMeeting();
  }, [client, description, meetingTime, router]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-dark-1 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-xl">Creating meeting, please wait...</p>
      </div>
    </div>
  );
}
