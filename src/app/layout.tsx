import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ThemeDataProvider from "@/context/theme-data-provider";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Հարց (Բետա 3)",
  description: "Հարցը խաղ է, որտեղ դուք կպատասխանեք հարցաշարին և կստանաք միավորներ։ Ձեր գիտելիքը՝ Ձեր հաղթանակը",
  authors: {
    url: "https://github.com/ArsenGabrielyan",
    name: "Արսեն Գաբրիելյան"
  },
  applicationName: "Հարց",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/app-icon.png", sizes: "192x192", type: "image/png"}
    ],
    apple: "/app-icon.png"
  },
};

export const viewport: Viewport = {
  themeColor: "#002a4f"
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <html lang="hy" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeDataProvider>
              <Toaster/>
              {children}
            </ThemeDataProvider>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
