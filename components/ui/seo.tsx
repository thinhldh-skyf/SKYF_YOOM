import { mergeOpenGraph } from "@/lib/mergeOpenGraph";
import { Metadata } from "next";

//SEO GLOBAL
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://skyf.vercel.app"
  ),
  applicationName: "zoom",
  keywords: ["nextjs", "zoom", "live"],
  authors: [{ name: "SKYF", url: "https://skyf.vercel.app" }],
  publisher: "SKYF",

  alternates: {
    canonical: "/",
    languages: {
      fr: "fr",
      vi: "vi",
    },
  },

  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      noimageindex: false,
    },
  },

  manifest: `https://skyf.vercel.app/manifest.json`,

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  twitter: {
    card: "summary_large_image",
    title: "SKYTutor",
    description: "Nền tảng phát trực tiếp và họp video",
    siteId: "",
    creator: "SKYF",
    images: [`https://skyf.vercel.app/images/og.jpg`],
  },

  openGraph: mergeOpenGraph(),
};
