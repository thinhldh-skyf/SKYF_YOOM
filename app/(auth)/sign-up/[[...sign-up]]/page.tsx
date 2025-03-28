import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SKYTutor",
  description: "Ứng dụng gọi video",
  icons: {
    icon: "/logo/logo.svg",
  },
};

export default function Page() {
  return <SignUp afterSignUpUrl="/home" />;
}
