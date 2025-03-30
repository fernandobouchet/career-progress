"use client";

import {
  Home,
  Gamepad2,
  Server,
  BrainCircuit,
  SquareTerminal,
  Laptop,
  GraduationCap,
  LucideProps,
  FileWarning,
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

const iconMap: { [key: string]: React.ComponentType<LucideProps> } = {
  "licenciatura-informatica": GraduationCap,
  "tecnicatura-informatica": Laptop,
  "tecnicatura-programacion": SquareTerminal,
  "tecnicatura-redes": Server,
  "tecnicatura-ia": BrainCircuit,
  "tecnicatura-videojuegos": Gamepad2,
};

const AppSidebar = ({
  careers,
  ...props
}: { careers: career[] } & React.ComponentProps<typeof Sidebar>) => {
  const pathName = usePathname();
  const initialCareers = careers;

  const fetchedCareers = initialCareers?.map((career) => ({
    ...career,
    icon: iconMap[career.slug] || FileWarning,
  }));

  const degrees = fetchedCareers?.filter((career) => career.isDegree) || [];
  const technicalPrograms =
    fetchedCareers?.filter((career) => !career.isDegree) || [];

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
        <CustomSidebarGroup title="Licenciatura" items={degrees} />
        <CustomSidebarGroup title="Tecnicatura" items={technicalPrograms} />
      </SidebarContent>
      <SidebarFooter className="flex items-end">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
};

export { AppSidebar };
