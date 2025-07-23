import { useCitasHoy } from "../hooks/useCitasHoy";
import { useServicios } from "../../medicos/hooks/useServicios";
import { useMedico } from "../../medicos/hooks/useMedico";
import { usePacientes } from "../../pacientes/hooks/usePacientes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "../../../utils/Avatar";
import { Badge } from "@/components/ui/badge";
import { normalizarEstadoBadge } from "../../../utils/badgeEstadoNormalizer";
import Spinner from "../../../components/Spinner";

export default function TablaCitasHoy() {
  const { data: citas = [], isLoading } = useCitasHoy();
  const { data: servicios = [] } = useServicios();
  const { data: medicos = [] } = useMedico();
  const { data: pacientes = [] } = usePacientes();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-32">
        <Spinner />
        <span className="ml-3 text-muted-foreground">Cargando citas...</span>
      </div>
    );

  return (
    <div className="border rounded-md p-4 space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paciente</TableHead>
            <TableHead>Médico</TableHead>
            <TableHead>Servicio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Nota</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(citas) && citas.length > 0 ? (
            citas.map((cita) => {
              const paciente = pacientes.find((p) => p.id === cita.pacienteId);
              const medico = medicos.find((m) => m.id === cita.medicoId);
              const servicio = servicios.find((s) => s.id === cita.servicioId);
              const badgeVariant = `estado-${normalizarEstadoBadge(
                cita.estadoCita
              )}`;

              return (
                <TableRow key={cita.citaId}>
                  {/* PACIENTE */}
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

                  {/* MÉDICO */}
                  <TableCell>
                    {medico ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          {medico.imagenUrl ? (
                            <AvatarImage
                              src={medico.imagenUrl}
                              alt={`${medico.nombres} ${medico.apellidos}`}
                            />
                          ) : null}
                          <AvatarFallback className="bg-purple-700 text-white">
                            {getInitials(medico.nombres, medico.apellidos)}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {medico.nombres} {medico.apellidos}
                        </span>
                      </div>
                    ) : (
                      "No disponible"
                    )}
                  </TableCell>

                  {/* SERVICIO */}
                  <TableCell>{servicio?.nombre || "No disponible"}</TableCell>
                  {/* ESTADO */}
                  <TableCell>
                    <Badge variant={badgeVariant}>
                      {cita.estadoCita?.replace(/_/g, " ").toUpperCase() || "—"}
                    </Badge>
                  </TableCell>
                  {/* HORA */}
                  <TableCell>
                    {cita.hora ? cita.hora.slice(0, 5) : "—"}
                  </TableCell>
                  {/* NOTA */}
                  <TableCell>{cita.notas || "—"}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No hay citas programadas para hoy.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
