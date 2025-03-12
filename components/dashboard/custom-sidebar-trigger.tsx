"use client";

import { MenuIcon } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const CustomSidebarTrigger = ({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="lg"
      className={cn("h-7 w-7 align-sub cursor-pointer", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <MenuIcon className="size-6" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

export { CustomSidebarTrigger };
