"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();

  const handleOnClick = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      onClick={handleOnClick}
      variant="ghost"
      size="icon"
      className="cursor-pointer rounded-full"
    >
      {theme === "light" ? (
        <Moon className="h-6 w-6" />
      ) : (
        <Sun className="h-6 w-6" />
      )}
    </Button>
  );
};

export { ThemeToggle };
