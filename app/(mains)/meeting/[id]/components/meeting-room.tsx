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
import { Users, LayoutList, MessageCircle, X } from "lucide-react";
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
import {
  Chat as ChatUI,
  Channel,
  MessageList,
  MessageInput,
  Window,
} from "stream-chat-react";

import "stream-chat-react/dist/css/v2/index.css";
import { useChatChannel } from "@/hooks/useChatChannel";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const CustomEmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
    <div className="text-5xl mb-4">💬</div>
    <h2 className="text-white text-xl font-semibold mb-1">Start chatting!</h2>
    <p className="text-gray-400 text-sm max-w-xs">
      Let’s get this chat started, why not send the first message?
    </p>
  </div>
);

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
    case "grid":
      return <PaginatedGridLayout />;
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
  const [timeLeft, setTimeLeft] = useState<number | null>(60 * 60);

  const { useCallCallingState, useLocalParticipant } = useCallStateHooks();
  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const call = useCall();
  const callId = call?.id || "";
  const { channel: chatChannel, chatClient } = useChatChannel(callId);
  const [showChat, setShowChat] = useState(false);

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
          setTimeLeft(60 * 60);
          return;
        }

        if (startedAt) {
          const started = new Date(startedAt);
          const now = new Date();
          const elapsed = Math.floor(
            (now.getTime() - started.getTime()) / 1000
          );
          setTimeLeft(Math.max(60 * 60 - elapsed, 0));
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

        {showParticipants && (
          <div className="shadow-lg bg-dark-2 px-8 pt-20 transition-all w-[320px] fixed right-0 top-0 min-h-screen z-40">
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </div>
        )}

        {showChat && chatClient && chatChannel && (
          <div className="fixed right-0 top-0 h-screen w-[360px] bg-[#121212] text-white z-40 flex flex-col shadow-xl rounded-l-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold">Chat</h2>
              <button onClick={() => setShowChat(false)}>
                <X className="text-white w-5 h-5" />
              </button>
            </div>
            <ChatUI client={chatClient} theme="str-chat__theme-dark">
              <Channel
                channel={chatChannel}
                EmptyStateIndicator={CustomEmptyState}
              >
                <Window>
                  <MessageList />
                  <MessageInput />
                </Window>
              </Channel>
            </ChatUI>
          </div>
        )}
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
              {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
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

          <button title="Chat" onClick={() => setShowChat((prev) => !prev)}>
            <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <MessageCircle size={20} className="text-white" />
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
