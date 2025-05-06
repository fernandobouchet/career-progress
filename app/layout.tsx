import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Dashboard } from "@/components/dashboard/dashboard";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/server/auth";
import { Providers } from "@/providers/providers";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Progreso Carrera - Licenciatura en Informática",
  description:
    "Progreso Carrera es una aplicación web para gestionar tu avance académico en la Licenciatura en Informática. Registrá tus materias, calificaciones y avances de forma sencilla y organizada.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openSans.className} antialiased`}>
        <Providers session={session}>
          <Dashboard>{children}</Dashboard>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
