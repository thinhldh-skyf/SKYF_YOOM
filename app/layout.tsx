import "./globals.css";
import "@/components/ui/seo";
import { ibm } from "./fonts";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { mergeOpenGraph } from "@/lib/mergeOpenGraph";

//SEO GLOBAL
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000/"
  ),
  applicationName: "SKYF YOOM app",
  keywords: ["nextjs", "zoom", "video", "netlify", "yoom", "skyf"],
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

  manifest: `  ${process.env.NEXT_PUBLIC_SERVER_URL}/manifest.json`,

  icons: {
    icon: "/logo/logo.png",
    shortcut: "/logo/logo.png",
    apple: "/logo/logo.png",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ứng dụng SKYF YOOM",
    description:
      "YOOM App: Nền tảng hội họp video miễn phí dành cho cá nhân và doanh nghiệp.",
    siteId: "",
    creator: "SKYF",
    images: [`${process.env.NEXT_PUBLIC_SERVER_URL}/logo/logo.png`],
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
