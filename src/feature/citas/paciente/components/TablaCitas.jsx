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
import { getInitials } from "../../../../utils/Avatar";
import { useState } from "react";

function EstadoBadge({ estado }) {
  if (estado === "CONFIRMADA")
    return (
      <Badge className="bg-green-100 text-green-700 font-semibold px-3">
        {estado}
      </Badge>
    );
  if (estado === "CANCELADA")
    return (
      <Badge className="bg-red-100 text-red-700 font-semibold px-3">
        {estado}
      </Badge>
    );
  return (
    <Badge className="bg-yellow-100 text-yellow-700 font-semibold px-3">
      {estado}
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

export default function TablaCitas() {
  const pacienteId = useAuthStore((s) => s.pacienteId);
  const { data: citas = [], isLoading, error } = useCitasPaciente(pacienteId);

  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const abrirDetalle = (cita) => {
    setCitaSeleccionada(cita);
    setDialogOpen(true);
  };

  if (isLoading) return <p className="text-muted">Cargando tus citas...</p>;
  if (error) return <p className="text-red-500">Error al cargar citas.</p>;

  return (
    <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Próximas Citas</h2>
      {citas.length === 0 ? (
        <p className="text-muted-foreground">No tienes citas pendientes.</p>
      ) : (
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
            {citas.map((cita) => (
              <TableRow key={cita.citaId}>
                <TableCell>{formatearFecha(cita.fecha)}</TableCell>
                <TableCell>{formatearHora(cita.hora)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-purple-700 text-white font-semibold">
                        {getInitials(cita.medicoNombreCompleto)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{cita.medicoNombreCompleto}</span>
                  </div>
                </TableCell>
                <TableCell>{cita.servicioNombre}</TableCell>
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
                {citaSeleccionada.medicoNombreCompleto}
              </div>
              <div>
                <span className="font-semibold">Servicio:</span>{" "}
                {citaSeleccionada.servicioNombre}
              </div>
              <div>
                <span className="font-semibold">Estado:</span>{" "}
                <EstadoBadge estado={citaSeleccionada.estadoCita} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
