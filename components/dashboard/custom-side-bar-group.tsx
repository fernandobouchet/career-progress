"use client";

import { LucideProps } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  title: string;
  items: (Career & { icon: React.ComponentType<LucideProps> })[];
}

const CustomSidebarGroup = ({ title, items }: Props) => {
  const pathName = usePathname();

  return (
    <SidebarGroup className="md:pr-0">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathName.startsWith(`/${item.slug}`);
          const itemName = item.name.split(" ").slice(2).join(" ");
          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                asChild
                tooltip={itemName}
                className={`${
                  isActive ? "bg-accent" : "bg-sidebar"
                } flex w-full cursor-pointer`}
              >
                <Link href={item.slug}>
                  {item.icon && <item.icon />}
                  <span className="line-clamp-1">{itemName}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export { CustomSidebarGroup };
