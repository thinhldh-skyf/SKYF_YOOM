import { Container } from "@/components/ui/container";
import { HomeCard } from "@/components/wrappers/home/home-card";
import { MeetingActions } from "@/components/wrappers/meeting/meeting-actions";
import { mergeOpenGraph } from "@/lib/mergeOpenGraph";
import { Grid } from "@radix-ui/themes";
import { Metadata } from "next";

export default function Page() {
  return (
    <section className="py-[120px] bg-dark-1 flex-1 text-white max-h-screen">
      <Container>
        <Grid className="grid grid-rows-auto space-y-4">
          <HomeCard />
          <MeetingActions />
        </Grid>
      </Container>
    </section>
  );
}

export const metadata: Metadata = {
  title: "YOOM - Trang chủ",
  description:
    "Nền tảng hội nghị truyền hình miễn phí trên web dành cho cá nhân và doanh nghiệp.",
  icons: {
    icon: "/logo/logo.svg",
  },

  openGraph: mergeOpenGraph({
    title: "YOOM - Trang chủ",
    url: "/",
  }),
};
