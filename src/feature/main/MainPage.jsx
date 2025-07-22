import { useAuthStore } from "@/store/useAuthStore";
import InicioMedico from "./medico/components/InicioMedico";
import InicioPaciente from "./paciente/components/InicioPaciente";
import Spinner from "../../components/Spinner";

export default function MainPage() {
  const rol = useAuthStore((s) => s.user?.rol);

  if (rol === undefined) {
    // Muestra spinner mientras se obtiene el rol del usuario (o se loguea)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (rol === "MEDICO") {
    return <InicioMedico />;
  }

  if (rol === "PACIENTE") {
    return <InicioPaciente />;
  }

  return <h1>Página principal</h1>;
}
