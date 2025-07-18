import { useAuthStore } from "@/store/useAuthStore";
import { useCitasPaciente } from "../../hooks/useCitasPaciente";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function EstadoBadge({ estado }) {
  const variant = `estado-${estado.toLowerCase().replace("_", "-")}`;
  return <Badge variant={variant}>{estado}</Badge>;
}

const formatearFecha = (fecha) =>
  new Date(fecha).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

const formatearHora = (hora) => hora?.slice(0, 5);
export default function TablaCitas() {
  const pacienteId = useAuthStore((s) => s.pacienteId);
  const { data: citas = [], isLoading, error } = useCitasPaciente(pacienteId);

  if (isLoading) return <p className="text-muted">Cargando tus citas...</p>;
  if (error) return <p className="text-red-500">Error al cargar citas.</p>;

  return (
    <div className="p-4 bg-white dark:bg-zinc-900 shadow rounded-md space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Próximas Citas</h2>
      </div>

      {citas.length === 0 ? (
        <p className="text-muted-foreground">No tienes citas pendientes.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Médico</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {citas.map((cita) => (
              <TableRow key={cita.citaId}>
                <TableCell>{formatearFecha(cita.fecha)}</TableCell>
                <TableCell>{formatearHora(cita.hora)}</TableCell>
                <TableCell>{cita.medicoNombreCompleto}</TableCell>
                <TableCell>{cita.servicioNombre}</TableCell>
                <TableCell>
                  <EstadoBadge estado={cita.estadoCita} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
