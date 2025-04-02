"use client";

import { SidebarOne } from "@/components/wrappers/sidebar/sidebar-one";
import { usePathname } from "next/navigation";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideSidebar =
    /^\/meeting\/[^/]+$/.test(pathname) && !pathname.includes("upcoming");
  return (
    <main className="flex h-screen">
      {!hideSidebar && <SidebarOne className="hidden lg:block" />}
      {children}
    </main>
  );
}
