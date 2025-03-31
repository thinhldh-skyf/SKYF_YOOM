"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useGetCalls } from "@/hooks/useGetCalls";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardCopyIcon, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import toast from "react-hot-toast";

export default function MeetingCalendar() {
  const { upcomingCalls, isLoading } = useGetCalls();
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const events = useMemo(() => {
    if (!upcomingCalls) return [];

    return upcomingCalls.map((call) => {
      const start = new Date(call.state?.startsAt ?? new Date());
      const end = new Date(start.getTime() + 50 * 60 * 1000); // +50 phút

      return {
        id: call.id,
        title: call.state?.custom?.description || "Cuộc họp cá nhân",
        start,
        end,
        extendedProps: {
          participants: call.state?.members || {},
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`,
        },
      };
    });
  }, [upcomingCalls]);

  const handleEventClick = (info: any) => {
    info.jsEvent.preventDefault();
    setSelectedMeeting(info.event);
    setIsOpen(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(selectedMeeting.extendedProps.url);
  };

  if (isLoading) return <p className="text-white text-center">Loading...</p>;

  return (
    <div className="p-4 h-[80vh] bg-dark-1 text-white rounded-xl relative">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
        allDaySlot={false}
        editable={false}
        selectable={false}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        eventClick={handleEventClick}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        height="100%"
      />

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
          <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black p-6 rounded-xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-semibold">
                {selectedMeeting?.title}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-600 hover:text-black">
                  <X />
                </button>
              </Dialog.Close>
            </div>

            <p>
              🕒 <strong>Start:</strong>{" "}
              {selectedMeeting?.start.toLocaleString()}
            </p>
            <p>
              🕓 <strong>End:</strong> {selectedMeeting?.end.toLocaleString()}
            </p>

            <div className="mt-6 flex justify-between gap-4">
              <Button
                className="bg-blue-600 text-white"
                onClick={() =>
                  window.open(selectedMeeting.extendedProps.url, "_blank")
                }
              >
                Start Meeting
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(
                    selectedMeeting.extendedProps.url
                  );
                  toast.success("Link copied to clipboard!");
                }}
              >
                <ClipboardCopyIcon className="w-4 h-4" />
                Copy Link
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
