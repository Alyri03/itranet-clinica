import { useAuthStore } from "@/store/useAuthStore";
import PerfilPaciente from "./paciente/components/PerfilPaciente";
import PerfilMedico from "./medico/components/PerfilMedico";
import PerfilRecepcionista from "./recepcionista/components/PerfilRecepcionista";

export default function PerfilPage() {
  const rol = useAuthStore((s) => s.user?.rol);

  if (!rol) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Rol no definido.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {rol === "PACIENTE" && <PerfilPaciente />}
      {rol === "MEDICO" && <PerfilMedico />}
      {rol === "RECEPCIONISTA" && <PerfilRecepcionista />}
    </div>
  );
}
