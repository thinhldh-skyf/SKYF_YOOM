//Open graph sert à optimiser le partage de la page sur les réseaux sociaux
import type { Metadata } from "next";

const defaultOpenGraph: Metadata["openGraph"] = {
  title: "SKYFTutor",
  description: "Nền tảng booking giáo viên phổ biến nhất hiện nay.",
  images: [
    {
      url: `https://skyf.vercel.app/logo/logo.png`,
    },
  ],
  type: "website",
  url: `https://skyf.vercel.app`,
};

export const mergeOpenGraph = (og?: Metadata["openGraph"]) => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
    title: og?.title ? og.title : defaultOpenGraph.title,
    url: og?.url ? og.url : defaultOpenGraph.url,
  };
};
