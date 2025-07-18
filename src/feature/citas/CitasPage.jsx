import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import TablaCitas from "./paciente/components/TablaCitas";
import CrearCita from "./components/CrearCita";
import TablaGestionCitas from "./recepcionista/components/TablaGestionCitas";

export default function CitasPage() {
  const rol = useAuthStore((s) => s.user?.rol);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

  if (rol === "PACIENTE") {
    return (
      <div className="p-6 space-y-6">
        {!mostrandoFormulario ? (
          <>
            <div className="flex items-center justify-between">
              <Button onClick={() => setMostrandoFormulario(true)}>
                + Solicitar nueva cita
              </Button>
            </div>
            <TablaCitas />
          </>
        ) : (
          <CrearCita onSuccess={() => setMostrandoFormulario(false)} />
        )}
      </div>
    );
  }

  if (rol === "RECEPCIONISTA") {
    return (
      <div className="p-6 space-y-6">
        {!mostrandoFormulario ? (
          <>
            <div className="flex items-center justify-between">
              <Button onClick={() => setMostrandoFormulario(true)}>
                + Registrar nueva cita
              </Button>
            </div>
            <TablaGestionCitas />
          </>
        ) : (
          <CrearCita onSuccess={() => setMostrandoFormulario(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="p-4 text-center text-muted-foreground">
      No tienes permisos para acceder a esta vista.
    </div>
  );
}
