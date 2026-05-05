import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "./providers/ConvexClerkProvider";
import ThemeProvider from "./providers/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RA | Blog and read about your Interest with AI Powered Features to generate blog and thumbnail for free, Anytime, Anywhere. ",
  description: "AI Powered Blogging App",
  icons: {
    icon: '/logo/favicon-32x32.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ConvexClerkProvider>{children}</ConvexClerkProvider>
        </ThemeProvider>
        <ScrollToTop></ScrollToTop>
      </body>
    </html>
  );
}
