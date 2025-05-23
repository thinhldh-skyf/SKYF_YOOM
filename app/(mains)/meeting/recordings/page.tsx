import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Meeting } from "@/components/wrappers/meeting/meeting";
import { mergeOpenGraph } from "@/lib/mergeOpenGraph";
import { Metadata } from "next";

export default function Page() {
  return (
    <section className="pt-24 bg-dark-1 flex-1 text-white min-h-screen">
      <Container>
        <Heading title="Meeting recorded." />
        <Meeting show={6} type="recordings" />
      </Container>
    </section>
  );
}

export const metadata: Metadata = {
  title: "SKYTutor - Meeting recorded.",
  description: "Video call appo",
  icons: {
    icon: "/logo/logo.svg",
  },

  openGraph: mergeOpenGraph({
    title: "SKYTutor - Meeting recorded.",
    url: "/meeting/previous",
  }),
};
