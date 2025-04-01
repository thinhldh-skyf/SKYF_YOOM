"use client";

import { useState, useEffect } from "react";
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
} from "@stream-io/video-react-sdk";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, LayoutList } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader } from "@/components/ui/loader";
import EndCallButton from "./end-call-button";
import { cn } from "@/lib/utils";
import ModalMeeting from "@/components/ui/modal-meeting";
import { Input } from "@/components/ui/input";
import sendEmail from "@/actions/sendemail";

type CallLayoutType = "speaker-left" | "speaker-right";

const CountdownTimer = ({ timeLeft }: { timeLeft: number | null }) => {
  return (
    <div className="absolute top-4 right-2 bg-black/50 px-4 py-2 rounded-xl text-white text-sm font-bold z-50">
      {timeLeft !== null
        ? `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(
            timeLeft % 60
          ).padStart(2, "0")}`
        : "Đang đồng bộ..."}
    </div>
  );
};

const CallLayoutComponent = ({ layout }: { layout: CallLayoutType }) => {
  switch (layout) {
    // case "grid":
    //   return <PaginatedGridLayout />;
    case "speaker-right":
      return <SpeakerLayout participantsBarPosition="left" />;
    default:
      return <SpeakerLayout participantsBarPosition="right" />;
  }
};

export const MeetingRoom = () => {
  const initialValues = {
    email: "hoangrey272284@gmail.com",
    name: "hoangrey",
  };

  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const [meetingState, setMeetingState] = useState<"shareLink" | undefined>(
    undefined
  );
  const [values, setValues] = useState(initialValues);
  const [timeLeft, setTimeLeft] = useState<number | null>(50 * 60);

  const { useCallCallingState, useLocalParticipant } = useCallStateHooks();
  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const call = useCall();

  const isHost =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  // Set startedAt nếu là host
  useEffect(() => {
    const maybeSetStartedAt = async () => {
      if (callingState === CallingState.JOINED && call) {
        const startedAt = call.state.custom?.startedAt;

        if (!startedAt && isHost) {
          const now = new Date().toISOString();
          await call.update({
            custom: { ...call.state.custom, startedAt: now },
          });
          setTimeLeft(50 * 60);
          return;
        }

        if (startedAt) {
          const started = new Date(startedAt);
          const now = new Date();
          const elapsed = Math.floor(
            (now.getTime() - started.getTime()) / 1000
          );
          setTimeLeft(Math.max(50 * 60 - elapsed, 0));
        }
      }
    };

    maybeSetStartedAt();
  }, [callingState, call, isHost]);

  // Đếm ngược thời gian còn lại
  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          call?.endCall();
          router.push("/home");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, call, router]);

  if (callingState !== CallingState.JOINED) return <Loader />;

  const handleClick = async () => {
    await sendEmail(values);
  };

  return (
    <section className="relative w-full overflow-hidden text-white">
      <CountdownTimer timeLeft={timeLeft} />

      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[700px] items-center">
          <CallLayoutComponent layout={layout} />
        </div>
        <div
          className={cn(
            "shadow-lg bg-dark-2 px-8 pt-20 transition-all w-[320px] fixed right-0 top-0 min-h-screen",
            showParticipants ? "block" : "hidden"
          )}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center gap-5 justify-center pt-20">
        <CallControls onLeave={() => router.push("/home")} />
        <div className="flex gap-4">
          <DropdownMenu>
            <div className="flex items-center">
              <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                <LayoutList size={20} className="text-white" />
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent className="border-dark-1 bg-dark-2 text-white rounded-sm">
              {["Speaker-Left", "Speaker-Right"].map((item, index) => (
                <div key={index}>
                  <DropdownMenuItem
                    onClick={() =>
                      setLayout(item.toLowerCase() as CallLayoutType)
                    }
                  >
                    {item}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-dark-1" />
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <CallStatsButton />

          <button
            title="Participants"
            onClick={() => setShowParticipants((prev) => !prev)}
          >
            <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <Users size={20} className="text-white" />
            </div>
          </button>

          {!isPersonalRoom && <EndCallButton />}
        </div>
      </div>

      <ModalMeeting
        title="Share Link"
        isOpen={meetingState === "shareLink"}
        onClose={() => setMeetingState(undefined)}
        className="text-center"
        buttonText="Share"
        handleClick={handleClick}
      >
        <Input
          required
          placeholder="Please enter the recipient's email address."
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          className="border-none text-center text-black text-xl bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Input
          required
          placeholder="Please enter the recipient's name."
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          className="border-none text-center text-black text-xl bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </ModalMeeting>
    </section>
  );
};
