import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SKYTutor",
  description: "Video call application",
  icons: {
    icon: "/logo/logo.svg",
  },
};

export default function Page() {
  return <SignUp afterSignUpUrl="/home" />;
}
