"use client";
import { Container } from "@/components/ui/container";
import { HomeCard } from "@/components/wrappers/home/home-card";
import { MeetingActions } from "@/components/wrappers/meeting/meeting-actions";
import { mergeOpenGraph } from "@/lib/mergeOpenGraph";
import { useUser } from "@clerk/nextjs";
import { Grid } from "@radix-ui/themes";
import axios from "axios";
import { StarIcon, HeartIcon, XIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { loadStripe } from "@stripe/stripe-js";

const tutors = [
  {
    id: 1,
    email: "hoangthinhza@gmail.com",
    name: "Nghiem E.",
    education: "Vietnamese",
    language: "Vietnamese (Native), English (Fluent)",
    students: "15",
    rating: 4.5,
    price: 10,
    reviews: 6,
    description:
      "Certified tutor with 5 years of experience — Hello everyone, my name is Nghiem. I'm from Da Nang city. Currently I'm living and working in Hanoi the capital Vietnam. Vietnamese is my mother tongue, I can speak with northern accents and southern accents.\nWith the long-term experience, I will help you learn Vietnamese in the fastest and most effective way by teaching methods suitable to each person's ability.",
  },
  {
    id: 2,
    email: "hoangthinhza@gmail.com",
    name: "Trinh T.",
    education: "Vietnamese",
    language: "Vietnamese (Native), English (Fluent)",
    students: "60",
    rating: 4.8,
    price: 15,
    reviews: 8,
    description:
      "Certified tutor with 5 years of experience — Hello everyone, my name is Nghiem. I'm from Da Nang city. Currently I'm living and working in Hanoi the capital Vietnam. Vietnamese is my mother tongue, I can speak with northern accents and southern accents.\nWith the long-term experience, I will help you learn Vietnamese in the fastest and most effective way by teaching methods suitable to each person's ability.",
  },
  {
    id: 3,
    email: "hoangthinhza@gmail.com",
    name: "Nam P.",
    education: "Vietnamese",
    language: "Vietnamese (Native), English (Fluent)",
    students: "15",
    rating: 5,
    price: 20,
    reviews: 6,
    description:
      "Certified tutor with 5 years of experience — Hello everyone, my name is Nghiem. I'm from Da Nang city. Currently I'm living and working in Hanoi the capital Vietnam. Vietnamese is my mother tongue, I can speak with northern accents and southern accents.\nWith the long-term experience, I will help you learn Vietnamese in the fastest and most effective way by teaching methods suitable to each person's ability.",
  },
  {
    id: 4,
    email: "hoangthinhza@gmail.com",
    name: "Thuong L.",
    education: "Vietnamese",
    language: "Vietnamese (Native), English (Fluent)",
    students: "15",
    rating: 4.6,
    price: 20,
    reviews: 7,
    description:
      "Certified tutor with 5 years of experience — Hello everyone, my name is Nghiem. I'm from Da Nang city. Currently I'm living and working in Hanoi the capital Vietnam. Vietnamese is my mother tongue, I can speak with northern accents and southern accents.\nWith the long-term experience, I will help you learn Vietnamese in the fastest and most effective way by teaching methods suitable to each person's ability.",
  },
  {
    id: 5,
    email: "hoangthinhza@gmail.com",
    name: "Nga E.",
    education: "Vietnamese",
    language: "Vietnamese (Native), English (Fluent)",
    students: "15",
    rating: 5,
    price: 25,
    reviews: 10,
    description:
      "Certified tutor with 5 years of experience — Hello everyone, my name is Nghiem. I'm from Da Nang city. Currently I'm living and working in Hanoi the capital Vietnam. Vietnamese is my mother tongue, I can speak with northern accents and southern accents.\nWith the long-term experience, I will help you learn Vietnamese in the fastest and most effective way by teaching methods suitable to each person's ability.",
  },
];

const stripePromise = loadStripe(
  "pk_test_51R7xP3H4TOvaCBB4IRwXIQRy1O91cCI2UNVR60vNmiFA3hIMHiT6eCzQBMVUcWvvy9rbWK9w8QVTwoGElpVBMqbA00EnIFoE88"
);

export default function Page() {
  const [isModalOpen, setModalOpen] = useState(false);
  const initialValues = {
    dateTime: new Date(),
    link: "",
  };
  const [values, setValues] = useState(initialValues);

  const startsAt =
    values.dateTime.toISOString() || new Date(Date.now()).toISOString();
  const { user } = useUser();

  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    try {
      setIsLoading(true);

      const stripe = await stripePromise;

      const { data } = await axios.post("/api/checkout", {
        tutorId: selectedTutor.id,
        time: selectedDate.toISOString(),
        description: `Cuộc họp của ${user?.fullName} với giáo viên ${selectedTutor.name}`,
        price: selectedTutor.price,
      });

      if (stripe && data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-[120px] bg-dark-1 flex-1 text-white max-h-screen  overflow-y-auto">
      <Container>
        <Grid className="grid grid-rows-auto space-y-4">
          <HomeCard />
          <MeetingActions />
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold">
              5 Vietnamese teachers available
            </h2>
            <div className="rounded-xl shadow-lg p-4 space-y-4 ">
              {tutors.map((tutor) => (
                <div key={tutor.id} className="flex gap-4 border-b pb-4 mb-4">
                  <div className="flex flex-col justify-between flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-xl">{tutor.name}</h3>
                        <p className="text-sm text-white">{tutor.language}</p>
                        <p className="text-sm text-white">
                          {tutor.students} active students
                        </p>
                        <div className="flex items-center gap-1 text-sm text-white">
                          <StarIcon className="w-4 h-4 text-yellow-400" />{" "}
                          {tutor.rating} ({tutor.reviews} reviews)
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <HeartIcon className="w-5 h-5 text-white cursor-pointer hover:text-red-500 transition" />
                        <span className="font-bold text-lg">
                          ${tutor.price}
                        </span>
                        <span className="text-xs text-gray-500">
                          50-min lesson
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-white line-clamp-2 mt-2">
                      {tutor.description}
                    </p>

                    <div className="flex gap-2 mt-2">
                      <button
                        className="px-4 py-2 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-pink-600 transition"
                        onClick={() => {
                          setModalOpen(true);
                          setSelectedTutor(tutor);
                        }}
                      >
                        Book trial lesson
                      </button>
                      <button className="px-4 py-2 rounded-lg border border-gray-300 text-white hover:bg-gray-100 transition">
                        Send message
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {isModalOpen && (
                <div className="fixed inset-0 bg-gray-950 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-gray-950 p-6 rounded-xl shadow-lg w-full max-w-lg relative">
                    <button
                      onClick={() => setModalOpen(false)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
                    >
                      <XIcon />
                    </button>
                    <h2 className="text-xl font-semibold mb-4">
                      Book a trial lesson
                    </h2>
                    <p className="text-gray-600 mb-6">
                      To discuss your level and learning plan
                    </p>
                    <div className="flex w-full flex-col gap-2.5">
                      <label className="text-base font-normal leading-[22.4px] text-sky-2">
                        Chọn ngày và giờ
                      </label>
                      <ReactDatePicker
                        required
                        locale="vi"
                        selected={selectedDate}
                        onChange={(date: any) => {
                          setSelectedDate(date);
                          setValues({ ...values, dateTime: date });
                        }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Thời gian"
                        dateFormat="dd/MM/yyyy HH:mm"
                        className="w-full rounded text-black bg-dark-3 p-2 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleContinue}
                      disabled={isLoading}
                      className="mt-4 w-full py-2 bg-emerald-600 rounded-lg text-white font-semibold hover:bg-green-600 transition flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        </>
                      ) : (
                        "Continue"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
}

// export const metadata: Metadata = {
//   title: "SKYFTutor - Trang chủ",
//   description:
//     "Nền tảng hội nghị truyền hình miễn phí trên web dành cho cá nhân và doanh nghiệp.",
//   icons: {
//     icon: "/logo/logo.svg",
//   },

//   openGraph: mergeOpenGraph({
//     title: "SKYFTutor - Trang chủ",
//     url: "/",
//   }),
// };
