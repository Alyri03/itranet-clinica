import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router";

export default function Layout() {
  const location = useLocation();

  // Mapea rutas a títulos de módulo
  const routeTitles = {
    "/citas": "Dashboard",
    "/pacientes": "Inventario",
    "/medicos": "Pedidos en Tienda",
    "/perfil": "Caja",
  };

  const currentPath = location.pathname;
  const title = routeTitles[currentPath] || "Módulo";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main>
          <SidebarTrigger />
          <div style={{ padding: "20px" }}>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b pb-2">
              {title}
            </h1>
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
