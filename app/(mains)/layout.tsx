import { HeaderOne } from "@/components/wrappers/header/header-one";
import { SidebarOne } from "@/components/wrappers/sidebar/sidebar-one";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Providers } from "@/providers";
import ClientLayoutWrapper from "@/components/wrappers/client-layout-wrapper/ClientLayoutWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <Providers>
      <HeaderOne />
      <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
    </Providers>
  );
}
