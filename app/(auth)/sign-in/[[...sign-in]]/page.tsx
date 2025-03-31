import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SKYTutor",
  description: "Video call application",
  icons: {
    icon: "/logo/logo.png",
  },
};

export default function Page() {
  return <SignIn />;
}
