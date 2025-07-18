import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { MODULOS_ROLES } from "@/utils/ModulosRoles";

export default function ProtectedRoute() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/" replace />;

  const currentPath = location.pathname.split("/")[1];
  const rolKey = user.rol?.toLowerCase();

  const modulosPermitidos = MODULOS_ROLES[rolKey] || [];

  const puedeAcceder = modulosPermitidos.includes(currentPath);

  if (!puedeAcceder) {
    console.warn("🔒 Acceso denegado a:", currentPath);
    return <Navigate to="/main" replace />;
  }

  return <Outlet />;
}
