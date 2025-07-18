import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/router/layout";
import { useAuthStore } from "./store/useAuthStore";
import AuthPage from "./feature/auth/authPage";
import CitasPage from "./feature/citas/CitasPage";
import DashboardPage from "./feature/dashboard/DashboardPage";
import MainPage from "./feature/main/MainPage";
import MedicosPage from "./feature/medicos/MedicosPage";
import PacientesPage from "./feature/pacientes/PacientesPage";
import PerfilPage from "./feature/perfil/PerfilPage";
import RecepcionistasPage from "./feature/recepcionistas/RecepcionistasPage";

export default function AppRouter() {
  const user = useAuthStore((s) => s.user);
  console.log("Usuario actual:", user);
  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="main" element={<MainPage />} />
          <Route path="citas" element={<CitasPage />} />
          <Route path="medicos" element={<MedicosPage />} />
          <Route path="pacientes" element={<PacientesPage />} />
          <Route path="perfil" element={<PerfilPage />} />
          <Route path="recepcionistas" element={<RecepcionistasPage />} />
          <Route path="*" element={<Navigate to="/main" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
