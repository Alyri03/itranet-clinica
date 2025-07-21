import TablaGestionMedicos from "./recepcionista/TablaGestionMedicos";
import { useAuthStore } from "@/store/useAuthStore";

export default function MedicosPage() {
  const rol = useAuthStore((s) => s.user?.rol);

  return (
    <div className="p-4">
      {rol === "RECEPCIONISTA" || rol === "ADMINISTRADOR" ? (
        <TablaGestionMedicos />
      ) : (
        <p className="text-gray-500">
          No tienes permiso para ver esta sección.
        </p>
      )}
    </div>
  );
}
