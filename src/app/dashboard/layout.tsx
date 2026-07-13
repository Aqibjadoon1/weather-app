import MainLayout from "@/components/layout/MainLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-aether-bg text-aether-text-primary">
      <MainLayout>{children}</MainLayout>
    </div>
  );
}
