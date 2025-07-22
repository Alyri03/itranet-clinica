import { useAuthStore } from "@/store/useAuthStore";
import { useServicios } from "../../../medicos/hooks/useServicios";
import { useMedico } from "../../../medicos/hooks/useMedico";
import { useTodasCitasPorPaciente } from "../../hooks/useTodasCitasPorPaciente";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { useState, useMemo } from "react";

// Badge visual con tus variantes
function EstadoBadge({ estado }) {
  const mapEstadoToVariant = {
    PENDIENTE: "estado-pendiente",
    CONFIRMADA: "estado-confirmada",
    CANCELADA: "estado-cancelada",
    ATENDIDA: "estado-atendida",
    NO_PRESENTADO: "estado-no-presentado",
    REPROGRAMADA: "estado-reprogramada",
  };
  return (
    <Badge variant={mapEstadoToVariant[estado] || "outline"}>
      {estado.replace(/_/g, " ")}
    </Badge>
  );
}

const formatearFecha = (fecha) =>
  new Date(fecha).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

const formatearHora = (hora) => hora?.slice(0, 5);

// Saca iniciales para el avatar
function getInitials(nombreCompleto = "") {
  if (!nombreCompleto) return "";
  const partes = nombreCompleto.split(" ");
  return (partes[0]?.[0] ?? "") + (partes.at(-1)?.[0] ?? "");
}

// Prioridad de estados para el ordenamiento
const ESTADO_PRIORIDAD = [
  "CONFIRMADA",
  "PENDIENTE",
  "CANCELADA",
  "ATENDIDA",
  "NO_PRESENTADO",
  "REPROGRAMADA",
];

export default function TablaCitas() {
  const pacienteId = useAuthStore((s) => s.pacienteId);
  const {
    data: citas = [],
    isLoading,
    error,
  } = useTodasCitasPorPaciente(pacienteId);

  // Carga todos los servicios y médicos
  const { data: servicios = [] } = useServicios();
  const { data: medicos = [] } = useMedico();

  const getMedicoNombre = (id) => {
    const medico = medicos.find((m) => m.id === id);
    return medico ? `${medico.nombres} ${medico.apellidos}` : `Médico #${id}`;
  };

  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const abrirDetalle = (cita) => {
    setCitaSeleccionada(cita);
    setDialogOpen(true);
  };

  const getServicioNombre = (id) =>
    servicios.find((s) => s.id === id)?.nombre || `Servicio #${id}`;

  // Ordena las citas por prioridad de estado y por fecha descendente
  const citasOrdenadas = useMemo(() => {
    const getPrioridad = (estado) => {
      const index = ESTADO_PRIORIDAD.indexOf(estado);
      return index === -1 ? 99 : index;
    };
    return [...citas].sort((a, b) => {
      const pa = getPrioridad(a.estadoCita);
      const pb = getPrioridad(b.estadoCita);
      if (pa !== pb) return pa - pb;
      // Si están en el mismo grupo, ordena por fecha descendente
      return new Date(b.fecha) - new Date(a.fecha);
    });
  }, [citas]);

  // Paginación
  const citasPorPagina = 7; // puedes ajustar el número aquí
  const [pagina, setPagina] = useState(1);
  const totalPaginas = Math.ceil(citasOrdenadas.length / citasPorPagina);
  const citasPagina = citasOrdenadas.slice(
    (pagina - 1) * citasPorPagina,
    pagina * citasPorPagina
  );

  if (isLoading) return <p className="text-muted">Cargando tus citas...</p>;
  if (error) return <p className="text-red-500">Error al cargar citas.</p>;

  return (
    <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Todas tus Citas</h2>
      {citas.length === 0 ? (
        <p className="text-muted-foreground">No tienes citas registradas.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Fecha</TableHead>
                <TableHead className="w-[75px]">Hora</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead className="w-[110px]">Estado</TableHead>
                <TableHead className="w-[70px] text-center">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {citasPagina.map((cita) => (
                <TableRow key={cita.citaId}>
                  <TableCell>{formatearFecha(cita.fecha)}</TableCell>
                  <TableCell>{formatearHora(cita.hora)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-purple-700 text-white font-semibold">
                          {getInitials(getMedicoNombre(cita.medicoId))}
                        </AvatarFallback>
                      </Avatar>
                      <span>{getMedicoNombre(cita.medicoId)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getServicioNombre(cita.servicioId)}</TableCell>
                  <TableCell>
                    <EstadoBadge estado={cita.estadoCita} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => abrirDetalle(cita)}
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* PAGINACIÓN */}
          <div className="flex justify-between items-center mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagina((prev) => Math.max(1, prev - 1))}
              disabled={pagina === 1}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {pagina} de {totalPaginas}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagina((prev) => Math.min(totalPaginas, prev + 1))
              }
              disabled={pagina === totalPaginas}
            >
              Siguiente
            </Button>
          </div>
        </>
      )}

      {/* Dialog para ver detalles */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalle de la cita</DialogTitle>
            <DialogClose />
          </DialogHeader>
          {citaSeleccionada && (
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Fecha:</span>{" "}
                {formatearFecha(citaSeleccionada.fecha)}
              </div>
              <div>
                <span className="font-semibold">Hora:</span>{" "}
                {formatearHora(citaSeleccionada.hora)}
              </div>
              <div>
                <span className="font-semibold">Médico:</span>{" "}
                {getMedicoNombre(citaSeleccionada.medicoId)}
              </div>
              <div>
                <span className="font-semibold">Servicio:</span>{" "}
                {getServicioNombre(citaSeleccionada.servicioId)}
              </div>
              <div>
                <span className="font-semibold">Estado:</span>{" "}
                <EstadoBadge estado={citaSeleccionada.estadoCita} />
              </div>
              <div>
                <span className="font-semibold">Notas:</span>{" "}
                {citaSeleccionada.notas || (
                  <span className="italic text-muted-foreground">
                    Sin notas
                  </span>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
