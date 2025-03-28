import { HoverEffect } from "@/components/ui/hover-effect";
import React from "react";

export const MeetingActions = () => {
  return <HoverEffect items={cards} />;
};

export const cards = [
  {
    color: "bg-meeting",
    icon: "/icons/plus.svg",
    title: "Tạo cuộc họp",
    description: "Cấu hình ghi hình.",
    link: "https://stripe.com",
    option: "isInstantMeeting",
  },
  {
    color: "bg-primary-400",
    icon: "/icons/meeting.svg",
    title: "Tham gia cuộc họp",
    description: "Qua đường link mời.",
    link: "https://stripe.com",
    option: "isJoiningMeeting",
  },
  {
    color: "bg-schedule",
    icon: "/icons/calendar.svg",
    title: "Lên lịch cuộc họp",
    description: "Qua đường link mời.",
    link: "https://stripe.com",
    option: "isScheduleMeeting",
  },
  {
    color: "bg-recording",
    icon: "/icons/video.svg",
    title: "Xem bản ghi",
    description: "Bản ghi cuộc họp.",
    link: "https://stripe.com",
    option: undefined,
  },
];
