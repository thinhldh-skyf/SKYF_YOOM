import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Personnal } from "@/components/wrappers/personnalinfo/personnal";
import { mergeOpenGraph } from "@/lib/mergeOpenGraph";
import { Metadata } from "next";

export default function Page() {
  return (
    <section className="pt-24 bg-dark-1 flex-1 text-white min-h-screen">
      <Container>
        <Heading title="My personal meeting room." />
        <Personnal />
      </Container>
    </section>
  );
}

export const metadata: Metadata = {
  title: "SKYTutor - Personal room.",
  description: "Video call application",
  icons: {
    icon: "/logo/logo.png",
  },

  openGraph: mergeOpenGraph({
    title: "SKYTutor - Personal room.",
    url: "/personalroom",
  }),
};
