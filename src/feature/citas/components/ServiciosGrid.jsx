import { useServicios } from "../../medicos/hooks/useServicios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ServiciosGrid({ value, onChange }) {
  const { data: servicios = [], isLoading } = useServicios();
  const [pagina, setPagina] = useState(1);
  const serviciosPorPagina = 8;

  const totalPaginas = Math.ceil(servicios.length / serviciosPorPagina);
  const inicio = (pagina - 1) * serviciosPorPagina;
  const fin = inicio + serviciosPorPagina;
  const serviciosPagina = servicios.slice(inicio, fin);

  if (isLoading) {
    return <p className="text-gray-500">Cargando servicios...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {serviciosPagina.map((servicio) => (
          <Card
            key={servicio.id}
            onClick={() => onChange(String(servicio.id))}
            className={`cursor-pointer transition ${
              String(value) === String(servicio.id)
                ? "ring-2 ring-blue-500 bg-blue-50"
                : "hover:ring-2 hover:ring-blue-300"
            }`}
          >
            <CardContent className="flex flex-col items-center justify-center p-4">
              <p className="text-sm font-medium text-center">
                {servicio.nombre}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPaginas > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setPagina((p) => p - 1)}
            disabled={pagina === 1}
          >
            ← Anterior
          </Button>
          <span className="text-sm text-muted-foreground mt-2">
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
    </div>
  );
}
