import { useAuthStore } from "@/store/useAuthStore";
import InicioMedico from "./medico/components/InicioMedico";

export default function MainPage() {
  const rol = useAuthStore((s) => s.user?.rol);

  if (rol === "MEDICO") {
    return <InicioMedico />;
  }

  return <h1>Página principal</h1>;
}
