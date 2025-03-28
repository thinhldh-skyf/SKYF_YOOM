import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SKYTutor",
    short_name: "SKYTutor",
    description:
      "Nền tảng hội họp video miễn phí dành cho cá nhân và doanh nghiệp.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/logo/logo.png",
        sizes: "64x64",
        type: "image/png",
      },
    ],
  };
}
