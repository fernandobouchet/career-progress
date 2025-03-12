import React from "react";
import { Command, HelpCircle, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { CustomSidebarTrigger } from "./custom-sidebar-trigger";
import { ThemeToggle } from "../theme-toggle";
import { NavUser } from "./nav-user";

const CustomSidebarHeader = () => {
  return (
    <header className="flex justify-between w-full h-18 py-4 px-6 bg-sidebar">
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
      <div className="flex items-center">
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
        >
          {<Settings />}
        </Button>
        <ThemeToggle />
        <NavUser
          user={{
            name: "",
            email: "",
            avatar: "",
          }}
        />
      </div>
    </header>
  );
};

export { CustomSidebarHeader };
