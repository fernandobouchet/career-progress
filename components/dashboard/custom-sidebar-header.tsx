"use client";

import { Command, HelpCircle, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { CustomSidebarTrigger } from "./custom-sidebar-trigger";
import { NavUser } from "./nav-user";
import { Session } from "next-auth";
import { LoginButton } from "../login-button";
import { useState } from "react";
import { SettingsModal } from "./settings-modal";

interface Props {
  session: Session | null;
}

const CustomSidebarHeader = ({ session }: Props) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="flex justify-between w-full h-18 py-4 px-4 bg-sidebar">
        <div className="flex items-center gap-5">
          <CustomSidebarTrigger />
          <Button variant="ghost" size="lg" asChild>
            <a href="#" className="p-0!">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Universidad</span>
              </div>
            </a>
          </Button>
        </div>

        <div className="flex items-center gap-1">
          {session ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer rounded-full"
              >
                {<HelpCircle className="w-6 h-6" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer rounded-full"
                onClick={() => setIsSettingsOpen(true)}
              >
                {<Settings />}
              </Button>
              <NavUser user={session?.user} />
            </>
          ) : (
            <>
              <LoginButton />
            </>
          )}
        </div>
      </header>
      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
};

export { CustomSidebarHeader };
