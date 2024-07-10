import DashboardNav from "@/components/DashboardNav";
import MobileDashBoardNav from "@/components/MobileDashBoardNav";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative h-screen w-full">
      <DashboardNav></DashboardNav>
      <MobileDashBoardNav></MobileDashBoardNav>

      {children}
    </main>
  );
}
