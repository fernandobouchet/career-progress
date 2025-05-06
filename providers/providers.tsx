import { ThemeProvider } from "next-themes";
import { TRPCReactProvider } from "@/trpc/react";
import { UserDataProvider } from "@/context/user-data-context";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface ProvidersProps {
  session: Session | null;
  children: React.ReactNode;
}

const Providers = ({ session, children }: ProvidersProps) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TRPCReactProvider>
          <UserDataProvider session={session}>{children}</UserDataProvider>
        </TRPCReactProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export { Providers };
