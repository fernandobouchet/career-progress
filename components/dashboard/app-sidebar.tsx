"use client";

import {
  Home,
  BookText,
  BarChart3,
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

const data = {
  navMain: [
    {
      title: "Licenciatura Informática",
      url: "#",
      icon: GraduationCap,
      isActive: true,
      items: [
        {
          title: "Programa",
          url: "#",
          icon: BookText,
        },
        {
          title: "Estadísticas",
          url: "#",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Informática",
      url: "#",
      icon: Laptop,
      items: [
        {
          title: "Programa",
          url: "#",
          icon: BookText,
        },
        {
          title: "Estadísticas",
          url: "#",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Programación",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Programa",
          url: "#",
          icon: BookText,
        },
        {
          title: "Estadísticas",
          url: "#",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Redes",
      url: "#",
      icon: Server,
      items: [
        {
          title: "Plan de estudios",
          url: "#",
          icon: BookText,
        },
        {
          title: "Estadísticas",
          url: "#",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "IA",
      url: "#",
      icon: BrainCircuit,
      items: [
        {
          title: "Plan de estudios",
          url: "#",
          icon: BookText,
        },
        {
          title: "Estadísticas",
          url: "#",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Videojuegos",
      url: "#",
      icon: Gamepad2,
      items: [
        {
          title: "Plan de estudios",
          url: "#",
          icon: BookText,
        },
        {
          title: "Estadísticas",
          url: "#",
          icon: BarChart3,
        },
      ],
    },
  ],
};

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
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
              <SidebarMenuButton asChild>
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
