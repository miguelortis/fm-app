import { Sidebar } from "@/components/dashboard/Sidebar";
import { AuthGuard } from "@/components/dashboard/AuthGuard";
import { MobileNavigation } from "@/components/dashboard/MobileNavigation";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value || undefined;

  return (
    <AuthGuard token={token}>
      <div className="flex min-h-screen bg-slate-50/50 text-slate-800 antialiased">
        {/* 1. SIDEBAR FIJO EN ESCRITORIO */}
        <div className="hidden lg:flex lg:shrink-0">
          <Sidebar />
        </div>
        {/* 3. CONTENEDOR CENTRAL DE TRABAJO */}
        <div className="flex flex-2 flex-col overflow-hidden">
          <MobileNavigation />
          <main className="flex-2 overflow-y-auto bg-slate-50/30 py-6 focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
