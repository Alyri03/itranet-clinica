import TablaGestionPaciente from "./recepcionista/components/TablaGestionPacientes";
import { useAuthStore } from "@/store/useAuthStore";

export default function PacientesPage() {
  const rol = useAuthStore((state) => state.user?.rol);

  if (rol === "RECEPCIONISTA") {
    return (
      <div className="p-6 space-y-6">
        <TablaGestionPaciente />
      </div>
    );
  }

  return (
    <div className="p-4 text-center text-muted-foreground">
      No tienes permisos para acceder a esta vista.
    </div>
  );
}
