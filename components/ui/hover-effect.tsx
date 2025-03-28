"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { IconButton } from "@radix-ui/themes";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ModalMeeting from "./modal-meeting";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Input } from "./input";
import { Textarea } from "./textarea";
import ReactDatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import { Loader } from "./loader";
registerLocale("fr", fr);

const initialValues = {
  dateTime: new Date(),
  description: "",
  link: "",
};

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
    color: string;
    icon: string;
    option: any;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >(undefined);

  const [titleMeeting, setTitleMeeting] = useState("");
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const { user } = useUser();

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast("Vui lòng chọn ngày và giờ");
        return;
      }

      if (meetingState === "isScheduleMeeting" && !values.description) {
        toast("Vui lòng nhập tiêu đề cuộc họp");
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("Lỗi khi tạo liên kết");
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Cuộc họp cá nhân";
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetail(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast("Cuộc họp đã được tạo");
    } catch (error) {
      console.error(error);
      toast("Réunion echouée");
    }
  };

  const handleClick = (item: any) => {
    setMeetingState(item.option);
    setTitleMeeting(item.title);
    if (item.option === undefined) {
      router.push("/meeting/recordings");
    }
  };

  return (
    <div className={cn("grid grid-cols-1", className)}>
      <Carousel>
        <CarouselContent>
          {items.map((item, idx) => (
            <CarouselItem
              className="basis-1/1 md:basis-1/2 lg:basis-1/2 xl:basis-1/3 2xl:basis-1/4"
              key={idx}
            >
              <div
                key={item?.link}
                className="relative group block p-2 h-full w-full  cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === idx && (
                    <motion.span
                      className="absolute inset-0 h-full w-full bg-white dark:bg-slate-800/[0.8] block rounded-3xl w-[300px]"
                      layoutId="hoverBackground"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.15 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.15, delay: 0.2 },
                      }}
                    />
                  )}
                </AnimatePresence>

                <div
                  onClick={() => handleClick(item)}
                  className={cn(
                    "relative z-50 px-4 py-6 rounded-[14px] w-[300px] md:w-full md:min-w-[280px] cursor-pointer",
                    item.color
                  )}
                >
                  <div className="flex justify-between flex-col w-full h-full">
                    <div>
                      <IconButton
                        color="gray"
                        radius="large"
                        variant="soft"
                        className="p-2"
                      >
                        <Image
                          src={item.icon}
                          width="27"
                          height="27"
                          alt="icon"
                        />
                      </IconButton>
                    </div>

                    <div className="mt-6">
                      <h1 className="capitalize text-base lg:text-xl font-bold">
                        {item.title}
                      </h1>
                      <p className="text-sm font-normal">{item.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <ModalMeeting
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => {
          setMeetingState(undefined);
          setLoading(!loading);
        }}
        title={titleMeeting}
        className="text-center"
        buttonText="Bắt đầu"
        handleClick={() => router.push(values.link)}
        loading={loading}
        setLoading={setLoading}
      >
        <Input
          placeholder="Vui lòng dán liên kết vào đây"
          onChange={(e: any) => setValues({ ...values, link: e.target.value })}
          className="border-none text-center text-black text-xl bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </ModalMeeting>

      <ModalMeeting
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => {
          setMeetingState(undefined);
          setLoading(false);
        }}
        title={titleMeeting}
        className="text-center"
        buttonText="Bắt đầu"
        handleClick={createMeeting}
        loading={loading}
        setLoading={setLoading}
      ></ModalMeeting>

      {!callDetail ? (
        <ModalMeeting
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => {
            setMeetingState(undefined);
            setLoading(false);
          }}
          title="Lên lịch cuộc họp"
          handleClick={createMeeting}
          loading={loading}
          setLoading={setLoading}
          className="bg-dark-1"
          buttonText="Lên lịch cuộc họp"
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Nội dung
            </label>
            <Textarea
              autoFocus
              required
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e: any) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Chọn ngày và giờ
            </label>
            <ReactDatePicker
              required
              locale="vi"
              selected={values.dateTime}
              onChange={(date: any) =>
                setValues({ ...values, dateTime: date! })
              }
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Thời gian"
              dateFormat="dd/MM/yyyy HH:mm"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </ModalMeeting>
      ) : (
        <ModalMeeting
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => {
            setMeetingState(undefined);
            setLoading(false);
          }}
          title="Cuộc họp đã được tạo"
          loading={loading}
          setLoading={setLoading}
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast("Đã sao chép liên kết");
          }}
          className="text-center"
          buttonText="Sao chép liên kết"
        />
      )}
    </div>
  );
};
