import { useState, useMemo } from "react";
import { ordenarCitas } from "../../../../utils/FiltrarCitas";
import { useGetCitas } from "../../hooks/useGetCitas";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useServicios } from "../../../medicos/hooks/useServicios";
import { useMedico } from "../../../medicos/hooks/useMedico";
import { usePacientes } from "../../../pacientes/hooks/usePacientes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, CheckCircle, XCircle } from "lucide-react";
import { Eye } from "lucide-react";
import DialogConfirmar from "../../components/DialogConfirmar";
import DialogCancelar from "../../components/DialogCancelar";
import { useConfirmarCita } from "../../hooks/useConfirmarCita";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "../../../../components/Spinner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "../../../../utils/Avatar";
import { normalizarEstadoBadge } from "../../../../utils/badgeEstadoNormalizer";

export default function TablaGestionCitas() {
  const { data: citasRaw = [], isLoading } = useGetCitas();
  const { data: servicios = [] } = useServicios();
  const { data: medicos = [] } = useMedico();
  const { data: pacientes = [] } = usePacientes();
  const queryClient = useQueryClient();

  const citas = useMemo(
    () =>
      ordenarCitas(
        citasRaw.map((c) => ({
          ...c,
          id: c.citaId,
        }))
      ),
    [citasRaw]
  );

  const [paginaActual, setPaginaActual] = useState(1);
  const citasPorPagina = 6;
  const totalPaginas = Math.ceil(citas.length / citasPorPagina);
  const citasPaginadas = citas.slice(
    (paginaActual - 1) * citasPorPagina,
    paginaActual * citasPorPagina
  );

  const [citaAConfirmar, setCitaAConfirmar] = useState(null);
  const [dialogCancelar, setDialogCancelar] = useState({
    open: false,
    citaId: null,
  });

  const confirmarCitaMutation = useConfirmarCita();

  function formatearEstadoTexto(estado) {
    if (!estado) return "";
    return estado.replace(/_/g, " ").toUpperCase();
  }

  const handleAbrirConfirmar = (cita) => setCitaAConfirmar(cita);
  const handleCerrarConfirmar = () => setCitaAConfirmar(null);

  const handleConfirmar = (citaId) => {
    confirmarCitaMutation.mutate(citaId, {
      onSuccess: () => {
        handleCerrarConfirmar();
        queryClient.invalidateQueries({ queryKey: ["Citas"] });
      },
      onError: () => {
        handleCerrarConfirmar();
      },
    });
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-40">
        <Spinner />
        <span className="ml-3 text-muted-foreground">Cargando citas...</span>
      </div>
    );

  return (
    <div className="border rounded-md p-4 space-y-4">
      <h2 className="text-lg font-semibold mb-4">Gestión de Citas</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paciente</TableHead>
            <TableHead>Médico</TableHead>
            <TableHead>Servicio</TableHead>
            <TableHead>Fecha y Hora</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {citasPaginadas.map((cita) => {
            const paciente = pacientes.find((p) => p.id === cita.pacienteId);
            const medico = medicos.find((m) => m.id === cita.medicoId);
            const servicio = servicios.find((s) => s.id === cita.servicioId);
            const badgeVariant = `estado-${normalizarEstadoBadge(
              cita.estadoCita
            )}`;

            return (
              <TableRow key={cita.id}>
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
                        <AvatarFallback className="bg-blue-500 text-white ">
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
                        <AvatarFallback className="bg-purple-700 text-white ">
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

                <TableCell>{servicio?.nombre || "No disponible"}</TableCell>
                <TableCell>
                  <div>
                    {cita.fecha}
                    <div className="text-xs text-gray-500">{cita.hora}</div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant={badgeVariant}>
                    {formatearEstadoTexto(cita.estadoCita)}
                  </Badge>
                </TableCell>

                <TableCell className="flex justify-center gap-2">
                  {cita.estadoCita === "PENDIENTE" ? (
                    <>
                      <Button variant="outline" size="icon" title="Reprogramar">
                        <CalendarClock className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        title="Confirmar"
                        onClick={() => handleAbrirConfirmar(cita)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        title="Cancelar"
                        onClick={() =>
                          setDialogCancelar({ open: true, citaId: cita.id })
                        }
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="icon" title="Ver Detalles">
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <DialogConfirmar
        open={!!citaAConfirmar}
        onOpenChange={(open) => {
          if (!open) handleCerrarConfirmar();
        }}
        cita={citaAConfirmar}
        onConfirm={handleConfirmar}
        isLoading={confirmarCitaMutation.isLoading}
      />

      <DialogCancelar
        open={dialogCancelar.open}
        citaId={dialogCancelar.citaId}
        onOpenChange={(open) => setDialogCancelar({ ...dialogCancelar, open })}
      />

      <div className="flex justify-between items-center pt-2">
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
          onClick={() =>
            setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
          }
          disabled={paginaActual === totalPaginas}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
