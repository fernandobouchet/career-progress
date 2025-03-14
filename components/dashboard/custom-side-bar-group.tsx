"use client";

import {
  BarChart3,
  BookText,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const subItems = [
  {
    title: "Programa",
    url: "programa",
    icon: BookText,
  },
  {
    title: "Estadísticas",
    url: "estadisticas",
    icon: BarChart3,
  },
];

const CustomSidebarGroup = ({
  title,
  items,
}: {
  title: string;
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}) => {
  const pathName = usePathname();

  return (
    <SidebarGroup className="md:pr-0">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathName.startsWith(`/${item.url}`);

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`${
                      isActive ? "bg-accent" : "bg-sidebar"
                    } cursor-pointer`}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight
                      className={`ml-auto transition-transform duration-200 ${
                        isActive ? "rotate-90" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {subItems.map((subItem) => {
                      const isSubItemActive = pathName.includes(
                        `/${item.url}/${subItem.url}`
                      );

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={`${
                              isSubItemActive ? "bg-accent" : "bg-sidebar"
                            } cursor-pointer`}
                          >
                            <Link href={`/${item.url}/${subItem.url}`}>
                              {subItem.icon && (
                                <subItem.icon className="size-4 mr-1" />
                              )}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export { CustomSidebarGroup };
