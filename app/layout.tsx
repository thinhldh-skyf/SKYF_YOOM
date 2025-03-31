import "./globals.css";
import "@/components/ui/seo";
import { ibm } from "./fonts";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { mergeOpenGraph } from "@/lib/mergeOpenGraph";

//SEO GLOBAL
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://skyf.vercel.app"
  ),
  applicationName: "SKYTutor app",
  keywords: ["nextjs", "zoom", "video", "netlify", "SKYFTutor", "skyf"],
  authors: [{ name: "skyf", url: "https://skyf.vercel.app" }],
  publisher: "skyf",

  alternates: {
    canonical: "/",
    languages: {
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
    icon: "/logo/logo.png",
    shortcut: "/logo/logo.png",
    apple: "/logo/logo.png",
  },

  twitter: {
    card: "summary_large_image",
    title: "SKYTutor Application",
    description:
      "SKYFTutor: Today’s most popular platform for booking teachers",
    siteId: "",
    creator: "SKYF",
    images: [`https://skyf.vercel.app/logo/logo.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={cn(
          "animate-loading-transition min-h-screen overflow-hidden",
          ibm.className
        )}
      >
        {children}
      </body>
    </html>
  );
}
