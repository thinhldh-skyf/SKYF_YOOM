"use client";
import { Button } from "@/components/ui/button";
import { Row } from "@/components/ui/row";
import { Copy, Edit, Eye, Plus, Trash } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

export const PersonnalCard = ({
  startRoom,
  meetingLink,
  meetingId,
  user,
}: {
  startRoom: () => void;
  meetingLink: string;
  meetingId: string;
  user: any;
}) => {
  const copy = (code: string) => {
    if (code) {
      copyToClipboard(code);
      return;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast("Đã sao chép liên kết");
      })
      .catch((err) => {
        toast("Đã xảy ra lỗi");
      });
  };

  return (
    <div className="mt-4 flex flex-col gap-8">
      <div className="flex flex-col gap-8 ">
        <ul className="flex flex-col gap-4 w-[320px] md:w-full overflow-auto">
          <li className="flex gap-8">
            <span className="text-[#C9DDFF]">Tiêu đề:</span>
            <span className="font-bold text-md capitalize">
              <span className="font-bold text-md capitalize">
                Phòng cá nhân của {user.lastName}
              </span>
            </span>
          </li>
          <li className="flex gap-8">
            <span className="text-[#C9DDFF]">ID cá nhân:</span>
            <span className="">{meetingId}</span>
          </li>

          <li className="flex gap-8">
            <span className="text-[#C9DDFF]">Liên kết mời:</span>
            <span className="text-primary-400 font-bold" title="copier">
              {meetingLink}
            </span>
            <Copy
              onClick={() => copy(meetingLink)}
              className="cursor-pointer"
            />
          </li>
        </ul>

        <div className="inline-flex flex-wrap gap-4 text-white mt-12 max-w-xs">
          <Button
            onClick={startRoom}
            variant="default"
            className="flex-1 capitalize bg-primary-400 hover:bg-white hover:text-black"
          >
            Start
          </Button>
          <Button
            onClick={() => copy(meetingLink)}
            variant="secondary"
            className="flex-1 capitalize px-4 w-fit flex gap-4 hover:bg-white hover:text-black"
            size="icon"
          >
            <Copy />
            <span>Sao chép liên kết</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
