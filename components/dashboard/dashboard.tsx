import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CustomSidebarHeader } from "./custom-sidebar-header";
import { auth } from "@/server/auth";
import { db } from "@/server/db/drizzle";

async function getStaticCareers(): Promise<Career[]> {
  return await db.query.careers.findMany();
}

const Dashboard = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  const careers = await getStaticCareers();

  return (
    <SidebarProvider className="flex-col h-full">
      <CustomSidebarHeader session={session} />
      <div className="flex min-h-[calc(100dvh-4.5rem)] bg-sidebar">
        <AppSidebar careers={careers} />
        <SidebarInset className="bg-sidebar m-0!">
          <div className=" flex-1 rounded-t-3xl md:rounded-3xl md:min-h-min m-0 md:mb-4 md:mx-4 md:mt-0 p-4 bg-background">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export { Dashboard };
