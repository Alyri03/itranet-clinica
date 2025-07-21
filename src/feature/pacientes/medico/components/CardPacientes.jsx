import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePacientesDeUnMedico } from "../../../citas/hooks/usePacientesDeUnMedico";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function CardPacientes() {
  const medicoId = useAuthStore((s) => s.medicoId);
  const { data: pacientes = [], isLoading, isError } = usePacientesDeUnMedico(medicoId);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const pacientesPorPagina = 6;
  const totalPaginas = Math.ceil(pacientes.length / pacientesPorPagina);
  const pacientesPaginados = pacientes.slice(
    (paginaActual - 1) * pacientesPorPagina,
    paginaActual * pacientesPorPagina
  );

  if (isLoading) return <p className="text-muted-foreground">Cargando pacientes...</p>;
  if (isError) return <p className="text-red-500">Error al cargar pacientes</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Tarjetas de Pacientes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pacientesPaginados.map((p, i) => (
          <Card key={p.numeroIdentificacion || i} className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" alt={`${p.nombres} ${p.apellidos}`} />
                  <AvatarFallback className="bg-blue-500 text-white font-semibold">
                    {p.nombres[0]}{p.apellidos[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium">{p.nombres} {p.apellidos}</p>
                  <p className="text-sm text-muted-foreground">{p.edad} años • {p.sexo}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 relative">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="text-blue-500 h-4 w-4" />
                <span>{p.telefono}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <IdCard className="text-blue-500 h-4 w-4" />
                <span>{p.numeroIdentificacion}</span>
              </div>
              {/* Botón de ver detalle */}
              <Button 
                size="sm" 
                variant="outline" 
                className="absolute top-4 right-4"
                title={`Ver detalle de ${p.nombres} ${p.apellidos}`}
                onClick={() => alert(`Ver detalle de ${p.nombres} ${p.apellidos}`)} // Puedes cambiar esta función por la navegación real
              >
                <Eye className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
        >
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {paginaActual} de {totalPaginas}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
