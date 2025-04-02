"use client";
import { Container } from "@/components/ui/container";
import { Col } from "@/components/ui/col";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { sidebar } from "@/constants/index";
import { useUser } from "@clerk/nextjs";

export const SidebarOne = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarItems, setSidebarItems] = useState(sidebar);
  const { user } = useUser();

  useEffect(() => {
    const role = user?.publicMetadata?.role;

    if (role === "teacher") {
      setSidebarItems(
        sidebar.filter((item) => item.route === "/meeting/upcoming")
      );
      if (pathname === "/" || pathname === "/home") {
        router.replace("/meeting/upcoming");
      }
    } else {
      setSidebarItems(sidebar);
      if (pathname === "/") {
        router.replace("/home");
      }
    }
  }, [user, pathname, router]);

  const handleClick = (link: string) => {
    router.push(link, {});
  };

  return (
    <aside
      className={cn(
        "min-h-screen bg-gray-50 text-dark-1 pt-28 w-[264px]",
        className
      )}
    >
      <Container>
        <Col className="gap-[16px]">
          {sidebarItems.map((item, idx) => {
            const Icon = item.icon;

            return (
              <Button
                onClick={() => handleClick(item.route)}
                key={idx}
                className={cn(
                  "p-6 flex justify-start items-center gap-3 rounded-[4px] w-full transition duration-300 ease-in-out",
                  item.route === pathname
                    ? "bg-dark-2 text-white"
                    : "bg-transparent text-dark-2 hover:bg-dark-2 hover:text-white"
                )}
              >
                {Icon && (
                  <Icon className="w-5 h-5" />
                )}
                <span className="text-[16px] font-[100]">{item.label}</span>
              </Button>
            );
          })}
        </Col>
      </Container>
    </aside>
  );
};
