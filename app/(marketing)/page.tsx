import { HeroTwo } from "@/components/wrappers/hero/hero-two";
import { mergeOpenGraph } from "@/lib/mergeOpenGraph";
import { Metadata } from "next";

export default function Page() {
  return <HeroTwo />;
}

export const metadata: Metadata = {
  title: "SKYF YOOM - Trang Marketing",
  description: "Ứng dụng gọi video",
  icons: {
    icon: "/logo/logo.svg",
  },

  openGraph: mergeOpenGraph({
    title: "SKYF YOOM - Trang Marketing",
    url: "/",
  }),
};
