import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import TablaCitas from "./paciente/components/TablaCitas";
import CrearCita from "./paciente/components/CrearCita";

export default function CitasPage() {
  const rol = useAuthStore((s) => s.user?.rol);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

  if (rol !== "PACIENTE") {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Solo los pacientes pueden ver sus próximas citas.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {!mostrandoFormulario ? (
        <>
          <div className="flex items-center justify-between">
            <Button onClick={() => setMostrandoFormulario(true)} className="">
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
