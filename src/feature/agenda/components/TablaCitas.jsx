import React, { useState } from "react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import DialogAtender from "./DialogAtender";

function formatDate(fecha) {
  const d = new Date(fecha);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(hora) {
  const [h, m] = hora.split(":");
  return `${h}:${m}`;
}

export default function TablaCitasHoyDia() {
  const medicoId = useAuthStore((s) => s.medicoId);
  const { data: citas = [], isLoading, isError } = useCitasDelDiaPorMedico(medicoId);
  const { data: pacientes = [] } = usePacientes();
  const { data: servicios = [] } = useServicios();

  // Estados para manejar el diálogo
  const [openDialog, setOpenDialog] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const handleAtenderClick = (cita) => {
    const paciente = pacientes.find((p) => p.id === cita.pacienteId);
    setCitaSeleccionada(cita);
    setPacienteSeleccionado(paciente);
    setOpenDialog(true);
  };

  if (isLoading)
    return <p className="text-muted-foreground">Cargando citas de hoy...</p>;
  if (isError)
    return <p className="text-red-600">Error al cargar las citas de hoy.</p>;
  if (citas.length === 0)
    return (
      <p className="text-center text-muted-foreground">
        No hay citas para hoy.
      </p>
    );

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
                <TableCell>{formatDate(cita.fecha)}</TableCell>
                <TableCell>{formatTime(cita.hora)}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-500 text-white font-semibold">
                      {paciente
                        ? `${paciente.nombres[0]}${paciente.apellidos[0]}`
                        : "NA"}
                    </AvatarFallback>
                  </Avatar>
                  <span>
                    {paciente
                      ? `${paciente.nombres} ${paciente.apellidos}`
                      : "No disponible"}
                  </span>
                </TableCell>
                <TableCell>{servicio?.nombre || "No disponible"}</TableCell>
                <TableCell>
                  <Badge variant={`estado-${cita.estadoCita.toLowerCase()}`}>
                    {cita.estadoCita}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAtenderClick(cita)}
                  >
                    <CircleCheckBig className="w-4 h-4 mr-1" />
                    Atender
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <DialogAtender
        open={openDialog}
        onOpenChange={setOpenDialog}
        paciente={pacienteSeleccionado}
        cita={citaSeleccionada}
      />
    </div>
  );
}
