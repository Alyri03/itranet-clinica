import { useState } from "react";
import { usePacientes } from "../../hooks/usePacientes";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Phone,
  MapPin,
  Pencil,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { getSexoBadge, formatFecha } from "../util/patientUtils.jsx";
import { getNacionalidadBadge } from "../util/patientUtils.jsx";
import DialogAgregarPaciente from "../components/DialogAgregarPaciente";
import DialogEditarPaciente from "../components/DialogEditarPaciente";
import DialogEliminarPaciente from "../components/DialogEliminarPaciente";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Spinner from "../../../../components/Spinner.jsx";
import { getInitials } from "../../../../utils/Avatar.js";
export default function TablaGestionPaciente() {
  const { data: pacientes = [], isLoading } = usePacientes();

  const [paginaActual, setPaginaActual] = useState(1);
  const pacientesPorPagina = 8;

  const totalPaginas = Math.ceil(pacientes.length / pacientesPorPagina);
  const pacientesPaginados = pacientes.slice(
    (paginaActual - 1) * pacientesPorPagina,
    paginaActual * pacientesPorPagina
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const abrirEditarPaciente = (paciente) => {
    setPacienteSeleccionado(paciente);
    setModalEditarOpen(true);
  };

  const [openDialogEliminar, setOpenDialogEliminar] = useState(false);
  const handleEliminarClick = (paciente) => {
    setPacienteSeleccionado(paciente);
    setOpenDialogEliminar(true);
  };

  const handlePacienteEliminado = () => {
    setOpenDialogEliminar(false);
    setPacienteSeleccionado(null);
  };

  return (
    <div className="">
      <div className="flex justify-end">
        <Button
          onClick={() => setModalOpen(true)}
          className="mb-2 bg-primary text-white"
        >
          <PlusCircle className="w-4 h-4 mr-1" /> Nuevo Paciente
        </Button>
      </div>
      <div className="border rounded-md p-4 space-y-4">
        <Table className="min-w-[1050px]">
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Sexo</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Nacionalidad</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Spinner className="w-8 h-8" />
                    <span className="text-gray-500 text-sm">
                      Cargando pacientes...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : pacientesPaginados.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-gray-500"
                >
                  No hay pacientes registrados
                </TableCell>
              </TableRow>
            ) : (
              pacientesPaginados.map((p) => (
                <TableRow
                  key={p.id}
                  className="hover:bg-gray-50 transition-all"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        {p.imagenUrl ? (
                          <AvatarImage
                            src={p.imagenUrl}
                            alt={`${p.nombres} ${p.apellidos}`}
                          />
                        ) : null}
                        <AvatarFallback className="bg-blue-500 text-white font-semibold">
                          {getInitials(p.nombres, p.apellidos)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-[15px] text-gray-900">
                          {p.nombres} {p.apellidos}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={13} />{" "}
                          {formatFecha(p.fechaNacimiento)}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{getSexoBadge(p.sexo)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-800 font-medium">
                        {p.tipoDocumento?.nombre ?? "-"}
                      </span>
                      <span className="text-xs text-gray-600">
                        {p.numeroIdentificacion}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getNacionalidadBadge(p.nacionalidad)} </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-800 flex items-center gap-1">
                        <Phone size={13} /> {p.telefono}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin size={12} /> {p.direccion}
                    </span>
                  </TableCell>
                  <TableCell className="flex gap-2 justify-center items-center py-2">
                    <Button
                      size="icon"
                      variant="outline"
                      title="Editar"
                      onClick={() => abrirEditarPaciente(p)}
                    >
                      <Pencil size={18} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      title="Eliminar"
                      onClick={() => handleEliminarClick(p)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Paginación estilo citas */}
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
        <DialogAgregarPaciente
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false);
          }}
        />

        <DialogEditarPaciente
          open={modalEditarOpen}
          onClose={() => setModalEditarOpen(false)}
          paciente={pacienteSeleccionado}
        />
        <DialogEliminarPaciente
          open={openDialogEliminar}
          onClose={() => setOpenDialogEliminar(false)}
          paciente={pacienteSeleccionado}
          onDeleted={handlePacienteEliminado}
        />
      </div>
    </div>
  );
}
