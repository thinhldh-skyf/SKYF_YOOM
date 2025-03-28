import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Meeting } from "@/components/wrappers/meeting/meeting";
import { mergeOpenGraph } from "@/lib/mergeOpenGraph";
import { Metadata } from "next";

export default function Page() {
  return (
    <section className="pt-[100px] bg-dark-1 flex-1 text-white min-h-50">
      <Container>
        <Heading title="Cuộc họp đã kết thúc" />
        <Meeting show={6} type="ended" />
      </Container>
    </section>
  );
}

export const metadata: Metadata = {
  title: "SKYF YOOM - Cuộc họp đã kết thúc",
  description: "Application d'appel vidéo",
  icons: {
    icon: "/logo/logo.svg",
  },

  openGraph: mergeOpenGraph({
    title: "SKYF YOOM - Cuộc họp đã kết thúc",
    url: "/meeting/previous",
  }),
};
