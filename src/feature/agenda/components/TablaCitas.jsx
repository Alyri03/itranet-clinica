import { useCitasDelDiaPorMedico } from "../../citas/hooks/useCitasDelDiaPorMedico";
import { usePacientes } from "../../pacientes/hooks/usePacientes";
import { useServicios } from "../../medicos/hooks/useServicios";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CircleCheckBig } from "lucide-react";
import { Link } from "react-router-dom";

export default function TablaCitasHoyDia() {
  const medicoId = useAuthStore((s) => s.medicoId);
  const {
    data: citas = [],
    isLoading,
    isError,
  } = useCitasDelDiaPorMedico(medicoId);
  const { data: pacientes = [] } = usePacientes();
  const { data: servicios = [] } = useServicios();

  if (isLoading)
    return <p className="text-muted-foreground">Cargando citas de hoy...</p>;
  if (isError)
    return <p className="text-red-600">Error al cargar las citas de hoy.</p>;

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-4">Citas de Hoy</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Paciente</TableHead>
            <TableHead>Servicio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
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
                <TableCell>
                  {paciente
                    ? `${paciente.nombres} ${paciente.apellidos}`
                    : "No disponible"}
                </TableCell>
                <TableCell>{servicio?.nombre || "No disponible"}</TableCell>
                <TableCell>{cita.estadoCita}</TableCell>
                <TableCell>
                  <Button
                    asChild
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Link to={`/atencion/${cita.pacienteId}/${cita.citaId}`}>
                      <CircleCheckBig className="w-4 h-4 mr-1" />
                      Atender
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
