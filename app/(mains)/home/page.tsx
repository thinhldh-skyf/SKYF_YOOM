"use client";
import { Container } from "@/components/ui/container";
import { HomeCard } from "@/components/wrappers/home/home-card";
import { MeetingActions } from "@/components/wrappers/meeting/meeting-actions";
import { mergeOpenGraph } from "@/lib/mergeOpenGraph";
import { useUser } from "@clerk/nextjs";
import { Grid } from "@radix-ui/themes";
import axios from "axios";
import { StarIcon, HeartIcon, XIcon, Loader2, X } from "lucide-react";
import { useMemo, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

const tutors = [
  {
    id: 1,
    avatar: "https://avatars.preply.com/i/logos/i/logos/avatar_22ws8cubbit.jpg",
    category: ["Vietnamese", "English", "Chinese"],
    weekday: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    email: "teacher@skytutor.com",
    name: "Nghiem E.",
    language: "Vietnamese (Native), English (Fluent)",
    students: "15",
    rating: 4.9,
    price: 12,
    reviews: 2,
    comments: [
      {
        name: "Terry",
        comment:
          "Outstanding Vietnamese Teacher. Nghiem is very professional; his setup to teach Vietnamese is prepared for each lessons. Each lessons is thoroughly prepared specially for the student. The experience he already have as a Vietnamese teacher makes the difference. Thank you!",
        createdAt: "November 25, 2024",
      },
    ],
    description:
      "Certified tutor with 5 years of experience — Hello everyone, my name is Nghiem. I'm from Da Nang city. Currently I'm living and working in Hanoi the capital Vietnam. Vietnamese is my mother tongue, I can speak with northern accents and southern accents.\nWith the long-term experience, I will help you learn Vietnamese in the fastest and most effective way by teaching methods suitable to each person's ability.",
  },
  {
    id: 2,
    avatar: "https://avatars.preply.com/i/logos/i/logos/avatar_wftmsr3e7r.jpg",
    category: ["Vietnamese", "Japanese", "Korean"],
    weekday: ["Monday", "Thursday", "Friday"],
    email: "teacher@skytutor.com",
    name: "Trinh T.",
    students: "60",
    rating: 4.8,
    price: 15,
    reviews: 4,
    comments: [
      {
        name: "Louis",
        comment:
          "She is an excellent teacher. She is very patient and detailed. She will not move on to a new word or sound until I have said it correctly and I really like that. I highly recommend her.",
        createdAt: "September 18, 2024",
      },
    ],
    description:
      "Interested in Vietnam? Get customized Vietnamese lessons for holidays or business. — I am originally from Danang, Vietnam - a beautiful beachside city. I worked as a university lecturer for 10 years before starting a tourism and hospitality business that I now operate in Hoi An, Vietnam. I am passionate about cooking, traveling, and learning about people.",
  },
  {
    id: 3,
    avatar: "https://avatars.preply.com/i/logos/i/logos/avatar_4ijidxpd3uh.jpg",
    category: ["Vietnamese", "France", "Chinese", "English"],
    weekday: ["Tuesday", "Thursday", "Friday"],
    email: "teacher@skytutor.com",
    name: "Hieu Hanh N.",
    students: "15",
    rating: 5,
    price: 35,
    reviews: 6,
    comments: [
      {
        name: "Daniel",
        comment:
          "Hannah is an excellent and dedicated teacher, with a very good English! She’s also very interested in learning more about other cultures herself, which makes the whole learning process much more interesting to all of us. Cảm ơn, Hannah!",
        createdAt: "September 18, 2024",
      },
    ],
    description:
      "Certified Vietnamese teacher for all levels/Southern-Northern-Central Accent/Lots of patience/Well-structured lessons from A1->C2 — Hi! I'm Hao from Vietnam - a country of timeless charm. With a deep understanding about Northern, Central and Southern accents, I'm passionate about popularizing Vietnamese among foreigners. I find joy in promoting the vibrant cultural and linguistic aspects of my mother tongue to learners from 4 corners of the world",
  },
  {
    id: 4,
    avatar: "https://avatars.preply.com/i/logos/i/logos/avatar_viambjs5aoa.jpg",
    category: ["Vietnamese", "Korean", "English"],
    weekday: ["Monday", "Wednesday", "Friday"],
    email: "teacher@skytutor.com",
    name: "Thuong L.",
    students: "15",
    rating: 4.6,
    price: 45,
    reviews: 7,
    comments: [
      {
        name: "Peter",
        comment:
          "Hannah is an excellent and dedicated teacher, with a very good English! She’s also very interested in learning more about other cultures herself, which makes the whole learning process much more interesting to all of us. Thank you, Hannah!",
        createdAt: "September 18, 2024",
      },
    ],
    description:
      "Learning with happy Hannah Speaking Vietnamese is just a piece of 'bánh mì' — Hello, this is Hieu Hanh. I am a 25-year-old Vietnamese super tutor offering unique and versatile language teaching methods covering Northern and Southern accents. I have a huge love for art and music, I am also a mama of two lazy cats. I have taught many students from different countries in the world.",
  },
  {
    id: 5,
    avatar: "https://avatars.preply.com/i/logos/i/logos/avatar_22j0rgn6yl3.jpg",
    category: ["Japanese", "France", "English"],
    weekday: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    email: "teacher@skytutor.com",
    name: "Nga E.",
    students: "15",
    rating: 5,
    price: 55,
    reviews: 10,
    comments: [
      {
        name: "Peter",
        comment:
          "I am adult trying to learn Japanese. I have found Ms. Yen to be a very good teacher. She allows you to pick which dialect (there are several dialects in Vietnam) to learn. She provides you with a free e-book and daily assignments to ensure that you are getting the most out of your tutoring sessions. She is always on time to the sessions and she does not give you a hard time when you need to reschedule. ",
        createdAt: "September 18, 2024",
      },
    ],
    description:
      "Your 5-year Experienced Japanese, France, English Tutor / Southern accent — My name is Yến. I have been teaching now for the past 5 years.I’m a native Japanese speaker with a deep understanding of communication. I have a clear voice with a standard Southern accent which is widely accepted in Japan. My passion for teaching from my desire to help others reach higher standards.",
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

  const { user } = useUser();
  console.log(user);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const [expandedTutor, setExpandedTutor] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedTutor(expandedTutor === id ? null : id);
  };

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const [weekday, setWeekday] = useState("All");
  const [price, setPrice] = useState("All");
  const [sort, setSort] = useState("");

  const allWeekdays = [
    "All",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleContinue = async () => {
    try {
      setIsLoading(true);

      const stripe = await stripePromise;

      const { data } = await axios.post("/api/checkout", {
        tutorId: selectedTutor.id,
        time: selectedDate.toISOString(),
        description: `${user?.username}'s meeting with tutor ${selectedTutor.name}`,
        email: selectedTutor.email,
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

  const SelectItem = ({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) => (
    <Select.Item
      value={value}
      className="text-sm py-2 px-3 hover:bg-gray-200 cursor-pointer"
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute right-2">
        <Check className="w-4 h-4" />
      </Select.ItemIndicator>
    </Select.Item>
  );

  const allCategories = useMemo(() => {
    const uniqueCategories = new Set(tutors.flatMap((tutor) => tutor.category));
    return ["All", ...Array.from(uniqueCategories)];
  }, []);

  const filteredTutors = useMemo(() => {
    let result = tutors.filter((tutor) => {
      const matchesCategory =
        category === "All" || tutor.category.includes(category);
      const matchesWeekday =
        weekday === "All" || tutor.weekday.includes(weekday);
      const matchesKeyword =
        !keyword ||
        tutor.category.some((cat) =>
          cat.toLowerCase().includes(keyword.toLowerCase())
        ) ||
        tutor.name.toLowerCase().includes(keyword.toLowerCase());

      const matchesPrice =
        price === "All" ||
        (price === "3-10" && tutor.price >= 3 && tutor.price <= 10) ||
        (price === "10-20" && tutor.price > 10 && tutor.price <= 20) ||
        (price === "20-30" && tutor.price > 20 && tutor.price <= 30) ||
        (price === "30-40" && tutor.price > 30);

      return (
        matchesCategory && matchesWeekday && matchesKeyword && matchesPrice
      );
    });

    switch (sort) {
      case "priceHighLow":
        result.sort((a, b) => b.price - a.price);
        break;
      case "priceLowHigh":
        result.sort((a, b) => a.price - b.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "popularity":
        result.sort((a, b) => parseInt(b.students) - parseInt(a.students));
        break;
      default:
        break;
    }

    return result;
  }, [category, keyword, weekday, price, sort]);
  return (
    <section className="py-[120px] bg-dark-1 flex-1 text-white max-h-screen  overflow-y-auto">
      <Container>
        <Grid className="grid grid-rows-auto space-y-4">
          <HomeCard />
          {/* <MeetingActions /> */}

          <div className="flex flex-col gap-4" style={{ marginTop: "40px" }}>
            <h2 className="text-3xl font-bold text-left">
              Online tutors & teachers for private lessons
            </h2>

            <div className="flex flex-col gap-4 items-center justify-center">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                <Select.Root value={category} onValueChange={setCategory}>
                  <Select.Trigger className="w-full bg-white text-black py-2 px-3 rounded flex flex-col gap-3 h-full">
                    <span className="text-gray-400 text-sm text-left">
                      I want to learn
                    </span>
                    <div className="flex items-center justify-between w-full">
                      <Select.Value placeholder="All" />
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content
                      className="bg-white rounded shadow-lg w-[var(--radix-select-trigger-width)] max-h-[200px] overflow-auto"
                      position="popper"
                    >
                      <Select.Viewport>
                        {allCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>

                <Select.Root value={weekday} onValueChange={setWeekday}>
                  <Select.Trigger className="w-full bg-white text-black py-2 px-3 rounded flex flex-col gap-3 h-full">
                    <span className="text-gray-400 text-sm text-left">
                      I&apos;m available
                    </span>
                    <div className="flex items-center justify-between w-full">
                      <Select.Value placeholder="All" />
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content
                      className="bg-white rounded shadow-lg w-[var(--radix-select-trigger-width)] max-h-[200px] overflow-auto"
                      position="popper"
                    >
                      <Select.Viewport>
                        {allWeekdays.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>

                <Select.Root value={price} onValueChange={setPrice}>
                  <Select.Trigger className="w-full bg-white text-black py-2 px-3 rounded flex flex-col gap-3 h-full">
                    <span className="text-gray-400 text-sm text-left">
                      Price per lession
                    </span>
                    <div className="flex items-center justify-between w-full">
                      <Select.Value placeholder="Price" />
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content
                      className="bg-white rounded shadow-lg w-[var(--radix-select-trigger-width)] max-h-[200px] overflow-auto"
                      position="popper"
                      sideOffset={4}
                    >
                      <Select.Viewport>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="3-10">$3 – $10</SelectItem>
                        <SelectItem value="10-20">$10 – $20</SelectItem>
                        <SelectItem value="20-30">$20 – $30</SelectItem>
                        <SelectItem value="30-40">$30 – $40+</SelectItem>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>

                <Select.Root value={sort} onValueChange={setSort}>
                  <Select.Trigger className="w-full bg-white text-black py-2 px-3 rounded flex flex-col gap-3 h-full">
                    <span className="text-gray-400 text-sm text-left">
                      Sort by
                    </span>
                    <div className="flex items-center justify-between w-full">
                      <Select.Value placeholder="Our Top Picks" />
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content
                      className="bg-white rounded shadow-lg w-[var(--radix-select-trigger-width)] max-h-[200px] overflow-auto"
                      position="popper"
                      sideOffset={4}
                    >
                      <Select.Viewport>
                        <SelectItem value="ourTopPicks">
                          Our Top Picks
                        </SelectItem>
                        <SelectItem value="priceHighLow">
                          Price High → Low
                        </SelectItem>
                        <SelectItem value="priceLowHigh">
                          Price Low → High
                        </SelectItem>
                        <SelectItem value="rating">Best Rating</SelectItem>
                        <SelectItem value="popularity">Popularity</SelectItem>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              {/* Second row - input field */}
              <div className="w-full">
                <Input
                  placeholder="Search name or keyword"
                  className="w-full py-7 px-4 bg-white text-black"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4" style={{ marginTop: "40px" }}>
            <h2 className="text-3xl font-bold">
              {filteredTutors.length} {category !== "All" ? category : ""}{" "}
              teachers available
            </h2>
            <div className="rounded-xl shadow-lg p-4 space-y-4 ">
              {filteredTutors.map((tutor) => (
                <div key={tutor.id} className="flex gap-4 border-b pb-4 mb-4">
                  <div>
                    <Image
                      src={tutor.avatar}
                      alt={tutor.name}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover flex-shrink-0"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-xl">{tutor.name}</h3>
                        <p className="text-sm text-white">{tutor.language}</p>
                        <p className="text-sm text-white">
                          {tutor.students} active students
                        </p>
                        <div className="flex items-center gap-1 text-sm text-white">
                          <StarIcon className="w-4 h-4 text-yellow-400" />
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

                    <p className="text-sm text-white mt-2">
                      {expandedTutor === tutor.id
                        ? tutor.description
                        : `${tutor.description.substring(0, 150)}...`}
                      <button
                        onClick={() => toggleExpand(tutor.id)}
                        className="text-emerald-500 font-semibold ml-2"
                      >
                        {expandedTutor === tutor.id
                          ? "Hide details"
                          : "Read more"}
                      </button>
                    </p>

                    {expandedTutor === tutor.id && (
                      <div className="mt-4 bg-dark-2 p-3 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">
                          Why choose {tutor.name}
                        </h4>
                        {tutor.comments.map((comment, index) => (
                          <div
                            key={index}
                            className="bg-dark-3 p-2 rounded-lg mb-2"
                          >
                            <p className="text-sm italic">
                              &ldquo;{comment.comment}&rdquo;
                            </p>
                            <div className="text-xs mt-2 text-gray-400">
                              {comment.name} - {comment.createdAt}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 mt-2">
                      <button
                        className="px-4 py-2 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-pink-600 transition"
                        onClick={() => {
                          setModalOpen(true);
                          setSelectedTutor(tutor);
                        }}
                      >
                        Book lesson
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
                      Book a lesson
                    </h2>
                    <p className="text-gray-600 mb-6">
                      To discuss your level and learning plan
                    </p>
                    <div className="flex w-full flex-col gap-2.5">
                      <label className="text-base font-normal leading-[22.4px] text-sky-2">
                        Select date and time
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
                        timeCaption="Time"
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
