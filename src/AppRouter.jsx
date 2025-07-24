import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/router/layout";
import { useAuthStore } from "./store/useAuthStore";
import AuthPage from "./feature/auth/AuthPage";
import CitasPage from "./feature/citas/CitasPage";
import DashboardPage from "./feature/dashboard/DashboardPage";
import MainPage from "./feature/main/MainPage";
import MedicosPage from "./feature/medicos/MedicosPage";
import PacientesPage from "./feature/pacientes/PacientesPage";
import PerfilPage from "./feature/perfil/PerfilPage";
import RecepcionistasPage from "./feature/recepcionistas/RecepcionistasPage";
import AgendaPage from "./feature/agenda/AgendaPage";
import AtencionPage from "./feature/atencion/AtencionPage";
import ProtectedRoute from "./router/ProtectedRoute";
import RegisterPage from "./feature/auth/components/RegisterPage";
import DisponibilidadPage from "./feature/disponibilidad/DisponibilidadPage";

export default function AppRouter() {
  const user = useAuthStore((s) => s.user);
  console.log("Usuario actual:", user);

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        {/* Rutas protegidas */}
        {user && (
          <Route path="/" element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="main" element={<MainPage />} />
              <Route path="citas" element={<CitasPage />} />
              <Route path="medicos" element={<MedicosPage />} />
              <Route path="pacientes" element={<PacientesPage />} />
              <Route path="perfil" element={<PerfilPage />} />
              <Route path="recepcionistas" element={<RecepcionistasPage />} />
              <Route path="agenda" element={<AgendaPage />} />
              <Route path="atencion" element={<AtencionPage />} />
              <Route
                path="atencion/:pacienteId/:citaId"
                element={<AtencionPage />}
              />
              <Route path="disponibilidad" element={<DisponibilidadPage />} /> {/* <-- AQUI */}
              <Route path="*" element={<Navigate to="/main" />} />
            </Route>
          </Route>
        )}

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
