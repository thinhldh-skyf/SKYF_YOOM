"use client";
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";

export default function MeetingSuccess() {
  const params = useSearchParams();
  const router = useRouter();
  const client = useStreamVideoClient();

  const description = params.get("description");
  const meetingTime = params.get("time");

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current || !client) return;

    hasRun.current = true;
    
    const createAndRedirectMeeting = async () => {
      if (!client) {
        toast.error("Lỗi kết nối Stream API");
        return;
      }

      const callId = crypto.randomUUID();
      const call = client.call("default", callId);

      try {
        await call.getOrCreate({
          data: {
            starts_at: meetingTime,
            custom: { description },
          },
        });

        toast.success("Cuộc họp được tạo thành công!");

        router.push(`/meeting/upcoming`);
      } catch (error) {
        console.error("Lỗi khi tạo cuộc họp", error);
        toast.error("Tạo cuộc họp thất bại!");
      }
    };

    createAndRedirectMeeting();
  }, [client, description, meetingTime, router]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-dark-1 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-xl">Đang tạo cuộc họp, vui lòng chờ...</p>
      </div>
    </div>
  );
}
