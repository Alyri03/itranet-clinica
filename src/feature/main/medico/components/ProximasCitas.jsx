import { useAuthStore } from "@/store/useAuthStore";
import { useCitasConfirmadasPorMedico } from "../../../medicos/hooks/useCitasConfirmadasPorMedico";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePacientes } from "../../../pacientes/hooks/usePacientes";
import { useServicios } from "../../../medicos/hooks/useServicios";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "../../../../utils/Avatar";
import Spinner from "../../../../components/Spinner";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

// Utilidad para obtener el badge correcto según estado
function obtenerBadgeVariant(estado) {
  if (!estado) return "default";
  return `estado-${estado.replace(/_/g, "-").toLowerCase()}`;
}

// Utilidad para poner estado bonito
function formatearEstadoTexto(estado) {
  if (!estado) return "";
  return estado.replace(/_/g, " ").toUpperCase();
}

export default function ProximasCitas() {
  const medicoId = useAuthStore((s) => s.medicoId);
  const {
    data: citas = [],
    isLoading,
    isError,
  } = useCitasConfirmadasPorMedico(medicoId);
  const { data: pacientes = [] } = usePacientes();
  const { data: servicios = [] } = useServicios();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-40">
        <Spinner />
        <span className="ml-3 text-muted-foreground">Cargando citas...</span>
      </div>
    );
  if (isError)
    return <p className="text-red-600">Error al cargar las citas.</p>;

  return (
    <div className="border rounded-md p-4 bg-white shadow-sm space-y-4">
      <h2 className="text-lg font-semibold mb-4">Citas Confirmadas</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paciente</TableHead>
            <TableHead>Servicio</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Notas</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {citas.map((cita) => {
            const paciente = pacientes.find((p) => p.id === cita.pacienteId);
            const servicio = servicios.find((s) => s.id === cita.servicioId);

            return (
              <TableRow key={cita.citaId}>
                <TableCell>
                  {paciente ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        {paciente.imagenUrl ? (
                          <AvatarImage
                            src={paciente.imagenUrl}
                            alt={`${paciente.nombres} ${paciente.apellidos}`}
                          />
                        ) : null}
                        <AvatarFallback className="bg-blue-500 text-white">
                          {getInitials(paciente.nombres, paciente.apellidos)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {paciente.nombres} {paciente.apellidos}
                      </span>
                    </div>
                  ) : (
                    "No disponible"
                  )}
                </TableCell>
                <TableCell>{servicio?.nombre || "No disponible"}</TableCell>
                <TableCell>{cita.fecha}</TableCell>
                <TableCell>{cita.hora}</TableCell>
                <TableCell>
                  <Badge variant={obtenerBadgeVariant(cita.estadoCita)}>
                    {formatearEstadoTexto(cita.estadoCita)}
                  </Badge>
                </TableCell>
                <TableCell>{cita.notas}</TableCell>
                <TableCell className="text-center">
                  <Button size="icon" variant="outline" title="Ver detalle">
                    <Eye className="w-5 h-5" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {citas.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No hay citas confirmadas para mostrar.
        </div>
      )}
    </div>
  );
}
