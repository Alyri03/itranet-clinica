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

export default function ProximasCitas() {
  const medicoId = useAuthStore((s) => s.medicoId);
  const { data: citas = [], isLoading, isError } = useCitasConfirmadasPorMedico(medicoId);
  const { data: pacientes = [] } = usePacientes();
  const { data: servicios = [] } = useServicios();

  if (isLoading) return <p className="text-muted-foreground">Cargando citas...</p>;
  if (isError) return <p className="text-red-600">Error al cargar las citas.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Citas Confirmadas</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Notas</TableHead>
            <TableHead>Paciente</TableHead>
            <TableHead>Servicio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {citas.map((cita) => {
            const paciente = pacientes.find((p) => p.id === cita.pacienteId);
            const servicio = servicios.find((s) => s.id === cita.servicioId);
            return (
              <TableRow key={cita.citaId}>
                <TableCell>{cita.fecha}</TableCell>
                <TableCell>{cita.hora}</TableCell>
                <TableCell>{cita.estadoCita}</TableCell>
                <TableCell>{cita.notas}</TableCell>
                <TableCell>
                  {paciente
                    ? `${paciente.nombres} ${paciente.apellidos}`
                    : "No disponible"}
                </TableCell>
                <TableCell>{servicio?.nombre || "No disponible"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
