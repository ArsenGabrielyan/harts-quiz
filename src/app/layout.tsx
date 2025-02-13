import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Հարց (Բետա 2)",
  description: "Հարցը խաղ է, որտեղ դուք կպատասխանեք հարցաշարին և կստանաք միավորներ։ Ձեր գիտելիքը՝ Ձեր հաղթանակը",
  authors: {
    url: "https://github.com/ArsenGabrielyan",
    name: "Արսեն Գաբրիելյան"
  },
  applicationName: "Հարց",
  icons: {
    icon: "/app-icon.png",
    apple: "/app-icon.png"
  },
};

export const viewport: Viewport = {
  themeColor: "#002a4f"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
