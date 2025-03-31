import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import MeetingCalendar from "@/components/wrappers/calendar/meeting-calendar";
import { Meeting } from "@/components/wrappers/meeting/meeting";
import { mergeOpenGraph } from "@/lib/mergeOpenGraph";
import { Metadata } from "next";

export default function Page() {
  return (
    <section className="pt-24 bg-dark-1 flex-1 text-white min-h-screen">
      <Container>
        <Heading title="Upcoming meetings." />
        {/* <Meeting show={6} type="upcoming" /> */}
        <MeetingCalendar />
      </Container>
    </section>
  );
}

export const metadata: Metadata = {
  title: "SKYTutor - Upcoming meetings.",
  description: "Video call application",
  icons: {
    icon: "/logo/logo.svg",
  },

  openGraph: mergeOpenGraph({
    title: "SKYTutor - Upcoming meetings.",
    url: "/meeting/upcoming",
  }),
};
