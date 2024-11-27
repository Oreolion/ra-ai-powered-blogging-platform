import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "./providers/ConvexClerkProvider";
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
  children: React.ReactNode;cre
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClerkProvider>{children}</ConvexClerkProvider>
        <ScrollToTop></ScrollToTop>
      </body>
    </html>
  );
}
