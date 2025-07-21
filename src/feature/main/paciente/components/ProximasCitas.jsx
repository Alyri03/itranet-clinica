import { useState } from "react";
import { useCitasPaciente } from "../../../citas/hooks/useCitasPaciente";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { getInitials } from "../../../../utils/Avatar";

function ordenarCitas(citas) {
  return [...citas].sort((a, b) => {
    const dateA = new Date(`${a.fecha}T${a.hora}`);
    const dateB = new Date(`${b.fecha}T${b.hora}`);
    return dateA - dateB;
  });
}

function formatoFecha(fecha) {
  const f = new Date(fecha);
  return isNaN(f) ? fecha : f.toLocaleDateString();
}

function formatoHora(hora) {
  return hora?.slice(0, 5);
}

function estadoBadge(estado) {
  if (estado === "CONFIRMADA") return "bg-green-100 text-green-700";
  if (estado === "CANCELADA") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
}

export default function ProximasCitas({ pacienteId }) {
  const { data: citas = [], isLoading, isError } = useCitasPaciente(pacienteId);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading)
    return <p className="py-4 text-center">Cargando próximas citas...</p>;
  if (isError)
    return (
      <p className="py-4 text-center text-red-600">Error al cargar citas</p>
    );
  if (!citas.length)
    return (
      <p className="py-4 text-center text-gray-500">
        No tienes próximas citas.
      </p>
    );

  const proximasCitas = ordenarCitas(citas).slice(0, 3);

  return (
    <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Próximas citas</h2>
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
          {proximasCitas.map((cita) => (
            <TableRow key={cita.citaId}>
              <TableCell>{formatoFecha(cita.fecha)}</TableCell>
              <TableCell>{formatoHora(cita.hora)}</TableCell>
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
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${estadoBadge(
                    cita.estadoCita
                  )}`}
                >
                  {cita.estadoCita}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setCitaSeleccionada(cita);
                    setDialogOpen(true);
                  }}
                >
                  <Eye className="w-5 h-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog para ver detalle */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Detalle de la Cita
            </DialogTitle>
            <DialogClose />
          </DialogHeader>
          {citaSeleccionada && (
            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <strong>Fecha:</strong> {formatoFecha(citaSeleccionada.fecha)}
              </div>
              <div>
                <strong>Hora:</strong> {formatoHora(citaSeleccionada.hora)}
              </div>
              <div>
                <strong>Médico:</strong> {citaSeleccionada.medicoNombreCompleto}
              </div>
              <div>
                <strong>Servicio:</strong> {citaSeleccionada.servicioNombre}
              </div>
              <div>
                <strong>Estado:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${estadoBadge(
                    citaSeleccionada.estadoCita
                  )}`}
                >
                  {citaSeleccionada.estadoCita}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
