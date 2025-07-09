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
import { api } from "@/trpc/react";

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
}: { careers: Career[] } & React.ComponentProps<typeof Sidebar>) => {
  const pathName = usePathname();

  // Obtener las carreras seleccionadas por el usuario
  const { data: userCareers } = api.user.getUserCareers.useQuery();

  // Filtrar las carreras para mostrar solo las seleccionadas por el usuario
  const filteredCareers = careers.filter((career) =>
    userCareers?.some((userCareer) => userCareer.id === career.id)
  );

  const fetchedCareers = filteredCareers?.map((career) => ({
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
        {degrees.length > 0 && (
          <CustomSidebarGroup title="Licenciatura" items={degrees} />
        )}
        {technicalPrograms.length > 0 && (
          <CustomSidebarGroup title="Tecnicatura" items={technicalPrograms} />
        )}
        {filteredCareers.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No hay carreras seleccionadas.
            <br />
            Ve a configuración para seleccionar tus carreras.
          </div>
        )}
      </SidebarContent>
      <SidebarFooter className="flex items-end">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
};

export { AppSidebar };
