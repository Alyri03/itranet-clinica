import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();

  // Mapea rutas a títulos de módulo
  const routeTitles = {
    "/dashboard": "Dashboard",
    "/main": "Inicio",
    "/citas": "Citas",
    "/medicos": "Médicos",
    "/pacientes": "Pacientes",
    "/perfil": "Perfil",
    "/recepcionistas": "Recepcionistas",
    "/agenda": "Agenda",
    "/atencion": "Atención",
    "/disponibilidad": "Disponibilidad",
  };
  const currentPath = location.pathname;
  const basePath = "/" + currentPath.split("/")[1]; 
  const title = routeTitles[basePath] || "Módulo";

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
