import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { MODULOS_ROLES } from "@/utils/ModulosRoles";

export default function ProtectedRoute() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/" replace />;

  const rolKey = user.rol?.toLowerCase();
  const modulosPermitidos = MODULOS_ROLES[rolKey] || [];

  const puedeAcceder = modulosPermitidos.some((modulo) =>
    location.pathname.includes(modulo)
  );

  if (!puedeAcceder) {
    console.warn("🔒 Acceso denegado a:", location.pathname);
    return <Navigate to="/main" replace />;
  }

  return <Outlet />;
}
