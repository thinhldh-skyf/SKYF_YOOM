import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SKYTutor",
  description: "Ứng dụng gọi video",
  icons: {
    icon: "/logo/logo.png",
  },
};

export default function Page() {
  return <SignIn />;
}
