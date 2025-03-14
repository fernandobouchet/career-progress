"use client";

import {
  Home,
  Gamepad2,
  Server,
  BrainCircuit,
  SquareTerminal,
  Laptop,
  GraduationCap,
} from "lucide-react";

import { CustomSidebarGroup } from "./custom-side-bar-group";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { usePathname } from "next/navigation";

const data = {
  navMain: [
    {
      title: "Licenciatura Informática",
      url: "licenciatura-informatica",
      icon: GraduationCap,
    },
    {
      title: "Informática",
      url: "tecnicatura-informatica",
      icon: Laptop,
    },
    {
      title: "Programación",
      url: "tecnicatura-programacion",
      icon: SquareTerminal,
    },
    {
      title: "Redes",
      url: "tecnicatura-redes",
      icon: Server,
    },
    {
      title: "IA",
      url: "tecnicatura-ia",
      icon: BrainCircuit,
    },
    {
      title: "Videojuegos",
      url: "tecnicatura-videojuegos",
      icon: Gamepad2,
    },
  ],
};

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const pathName = usePathname();

  return (
    <Sidebar
      variant="inset"
      {...props}
      className="mt-18 h-[calc(100dvh-4.5rem)] md:pr-0"
    >
      <SidebarContent className="pt-18 md:pt-0">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathName === "/"}>
                <Link href="/">
                  <Home className="size-4" />
                  <span>Inicio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <CustomSidebarGroup title="Licenciatura" items={[data.navMain[0]]} />
        <CustomSidebarGroup title="Tecnicatura" items={data.navMain.slice(1)} />
      </SidebarContent>
      <SidebarFooter className="flex items-end">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
};

export { AppSidebar };
