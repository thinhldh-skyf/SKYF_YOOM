"use client";

import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { Row } from "@/components/ui/row";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import React from "react";
import { MobileMenu } from "./mobile-menu";
import { Button } from "@radix-ui/themes";

export const HeaderOne = () => {
  const { user } = useUser();

  const role = user?.publicMetadata?.role;

  return (
    <header className="fixed top-0 bg-dark-2 w-full h-[72px] z-50">
      <Container className="xl:p-inherit">
        <Row className="justify-between h-full items-center">
          <Logo />

          <div className="ms-auto me-8 flex items-center gap-6">
            {role === "student" && (
              <div className="border-2 border-white rounded-md">
                <Button
                  variant="surface"
                  className="p-2 border-2 border-white rounded-md bg-dark-2 transition"
                >
                  <span className="text-white">Become a mentor</span>
                </Button>
              </div>
            )}

            <UserButton afterSignOutUrl="/" />
          </div>

          <div className="md:hidden">
            <MobileMenu />
          </div>
        </Row>
      </Container>
    </header>
  );
};
