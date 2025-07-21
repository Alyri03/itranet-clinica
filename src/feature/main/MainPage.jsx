import { useAuthStore } from "@/store/useAuthStore";

import InicioMedico from "./medico/components/InicioMedico";
import InicioPaciente from "./paciente/components/InicioPaciente";

export default function MainPage() {
  const rol = useAuthStore((s) => s.user?.rol);

  if (rol === "MEDICO") {
    return <InicioMedico />;
  }

  if (rol === "PACIENTE") {
    return <InicioPaciente />;
  }

  return <h1>Página principal</h1>;
}
