import { mergeOpenGraph } from "@/lib/mergeOpenGraph";
import { Metadata } from "next";

//SEO GLOBAL
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000/"
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

  manifest: `  ${process.env.NEXT_PUBLIC_SERVER_URL}/manifest.json`,

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  twitter: {
    card: "summary_large_image",
    title: "SKYF Yoom",
    description: "Nền tảng phát trực tiếp và họp video",
    siteId: "",
    creator: "SKYF",
    images: [` ${process.env.NEXT_PUBLIC_SERVER_URL}/images/og.jpg`],
  },

  openGraph: mergeOpenGraph(),
};
