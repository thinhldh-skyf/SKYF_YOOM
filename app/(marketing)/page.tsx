import { HeroTwo } from "@/components/wrappers/hero/hero-two";
import { mergeOpenGraph } from "@/lib/mergeOpenGraph";
import { Metadata } from "next";

export default function Page() {
  return <HeroTwo />;
}

export const metadata: Metadata = {
  title: "SKYTutor - Marketing",
  description: "Video call application",
  icons: {
    icon: "/logo/logo.svg",
  },

  openGraph: mergeOpenGraph({
    title: "SKYTutor - Marketing",
    url: "/",
  }),
};
