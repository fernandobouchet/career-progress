"use client";

import {
  BookOpen,
  Bot,
  Home,
  BookText,
  BarChart3,
  Code,
  Palette,
} from "lucide-react";

import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Ingeniería",
      url: "#",
      icon: Code,
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
      title: "Medicina",
      url: "#",
      icon: Bot,
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
      title: "Derecho",
      url: "#",
      icon: BookOpen,
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
      title: "Arquitectura",
      url: "#",
      icon: Palette,
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
  ],
};

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar
      variant="inset"
      {...props}
      className="mt-18 h-[calc(100dvh-4.5rem)]"
    >
      <SidebarContent>
        <SidebarGroup className="md:pr-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#">
                  <Home className="size-4" />
                  <span>Inicio</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};

export { AppSidebar };
