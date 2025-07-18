import { useState } from "react";
import { useMedicosByEspecialidad } from "../../medicos/hooks/useMedicosByEspecialidad";
import { useMedico } from "../../medicos/hooks/useMedico";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function MedicosGrid({ especialidadId, value, onChange }) {
  const esDirecto = !especialidadId;

  // Elegimos el hook dependiendo del modo
  const {
    data: medicos = [],
    isLoading,
    isError,
  } = esDirecto
    ? useMedico() // todos los médicos
    : useMedicosByEspecialidad(especialidadId); // por especialidad

  const [pagina, setPagina] = useState(1);
  const medicosPorPagina = 6;
  const totalPaginas = Math.ceil(medicos.length / medicosPorPagina);
  const inicio = (pagina - 1) * medicosPorPagina;
  const fin = inicio + medicosPorPagina;
  const medicosPagina = medicos.slice(inicio, fin);

  return (
    <div className="w-full space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Médico
      </label>

      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Loader2 className="animate-spin" size={18} />
          Cargando médicos...
        </div>
      ) : isError ? (
        <p className="text-red-500 text-sm">Error al cargar médicos.</p>
      ) : medicos.length === 0 ? (
        <p className="text-gray-400 text-sm">
          No hay médicos {esDirecto ? "disponibles" : "para esta especialidad"}.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {medicosPagina.map((medico) => (
              <Card
                key={esDirecto ? medico.id : medico.medicoId}
                onClick={() =>
                  onChange(String(esDirecto ? medico.id : medico.medicoId))
                }
                className={`cursor-pointer transition border hover:ring-2 hover:ring-blue-400 ${
                  String(value) ===
                  String(esDirecto ? medico.id : medico.medicoId)
                    ? "ring-2 ring-blue-600 bg-blue-50"
                    : ""
                }`}
              >
                <CardContent className="p-4 text-center">
                  <h3 className="text-blue-800 font-semibold text-base mb-1">
                    {esDirecto
                      ? `${medico.nombres} ${medico.apellidos}`
                      : medico.nombreMedico}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {esDirecto
                      ? medico.especialidad?.nombre
                      : medico.nombreEspecialidad}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setPagina((p) => p - 1)}
                disabled={pagina === 1}
              >
                ← Anterior
              </Button>
              <span className="text-sm text-muted-foreground mt-1">
                Página {pagina} de {totalPaginas}
              </span>
              <Button
                variant="outline"
                onClick={() => setPagina((p) => p + 1)}
                disabled={pagina === totalPaginas}
              >
                Siguiente →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
