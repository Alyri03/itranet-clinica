import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Eye } from "lucide-react";
import Spinner from "../../../components/Spinner";
import { useMedico } from "../../medicos/hooks/useMedico";
import { useTiposDocumento } from "../../pacientes/hooks/useTiposDocumento";
import { useEspecialidadByMedico } from "../../medicos/hooks/useEspecialidadByMedico";
import { getInitials } from "../../../utils/Avatar";
import DialogAgregarDisponibilidad from "./DialogAgregarDisponibilidad";
import DialogEliminarDisponibilidad from "./DialogEliminarDisponibilidad";

function CeldaEspecialidad({ medico }) {
  const { data: especialidades = [], isLoading } = useEspecialidadByMedico(
    medico.id,
    { enabled: medico.tipoMedico === "ESPECIALISTA" }
  );

  if (medico.tipoMedico !== "ESPECIALISTA")
    return <span className="text-gray-400 italic">No aplica</span>;
  if (isLoading)
    return (
      <span className="flex items-center gap-1 text-gray-400 italic">
        <Spinner className="w-3 h-3" /> Cargando...
      </span>
    );
  if (especialidades.length === 0)
    return <span className="text-gray-400 italic">Sin especialidad</span>;
  return (
    <span className="text-gray-500 font-medium">
      {especialidades.map((e) => e.nombreEspecialidad).join(", ")}
    </span>
  );
}

function CeldaDocumento({ medico, tiposDocumento }) {
  const tipo = tiposDocumento?.find((t) => t.id === medico.tipoDocumentoId);
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-xs font-semibold text-gray-700">
        {tipo ? tipo.nombre : "-"}
      </span>
      <span className="text-xs text-gray-500">{medico.numeroDocumento}</span>
    </div>
  );
}

export default function TablaGestionDisponibilidad() {
  const { data: medicos = [], isLoading } = useMedico();
  const { data: tiposDocumento = [] } = useTiposDocumento();

  const [paginaActual, setPaginaActual] = useState(1);
  const medicosPorPagina = 8;
  const totalPaginas = Math.ceil(medicos.length / medicosPorPagina);
  const medicosPaginados = medicos.slice(
    (paginaActual - 1) * medicosPorPagina,
    paginaActual * medicosPorPagina
  );

  // Dialogs state
  const [medicoAgregar, setMedicoAgregar] = useState(null);
  const [medicoEliminar, setMedicoEliminar] = useState(null);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <Spinner className="w-8 h-8 mb-3" />
        <span className="text-gray-500">Cargando médicos...</span>
      </div>
    );

  return (
    <div>
      <div className="border rounded-md p-4 space-y-4">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-60">Médico</TableHead>
              <TableHead className="w-36">Documento</TableHead>
              <TableHead className="w-28">Tipo</TableHead>
              <TableHead className="w-48">Especialidad</TableHead>
              <TableHead className="w-28">Colegiatura</TableHead>
              <TableHead className="w-24">RNE</TableHead>
              <TableHead className="w-32">Teléfono</TableHead>
              <TableHead className="w-40 text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicosPaginados.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-gray-500"
                >
                  No hay médicos registrados
                </TableCell>
              </TableRow>
            ) : (
              medicosPaginados.map((medico) => (
                <TableRow key={medico.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-purple-700 text-white font-semibold">
                          {getInitials(medico.nombres, medico.apellidos)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col leading-tight">
                        <span className="font-semibold text-[15px] text-gray-900">
                          {medico.nombres}
                        </span>
                        <span className="text-xs text-gray-500">
                          {medico.apellidos}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <CeldaDocumento
                      medico={medico}
                      tiposDocumento={tiposDocumento}
                    />
                  </TableCell>
                  <TableCell>
                    {medico.tipoMedico === "ESPECIALISTA" ? (
                      <Badge variant="especialista">ESPECIALISTA</Badge>
                    ) : (
                      <Badge variant="general">GENERAL</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <CeldaEspecialidad medico={medico} />
                  </TableCell>
                  <TableCell className="text-xs">
                    {medico.numeroColegiatura}
                  </TableCell>
                  <TableCell className="text-xs">
                    {medico.tipoMedico === "ESPECIALISTA" &&
                    medico.numeroRNE ? (
                      medico.numeroRNE
                    ) : (
                      <span className="text-gray-400 italic">No aplica</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">{medico.telefono}</TableCell>
                  <TableCell className="flex gap-2 justify-center">
                    <Button
                      variant="secondary"
                      size="icon"
                      title="Agregar Disponibilidad"
                      onClick={() => setMedicoAgregar(medico)}
                    >
                      <Plus size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      title="Disponibilidades"
                      onClick={() => setMedicoEliminar(medico)}
                    >
                      Disponibilidades
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* PAGINACIÓN */}
        <div className="flex justify-between items-center pt-2">
          <button
            className="px-3 py-1 border rounded bg-white text-gray-700"
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
          >
            Anterior
          </button>
          <span className="text-sm text-muted-foreground">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            className="px-3 py-1 border rounded bg-white text-gray-700"
            onClick={() =>
              setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
            }
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Dialog Agregar Disponibilidad */}
      <DialogAgregarDisponibilidad
        open={!!medicoAgregar}
        onClose={() => setMedicoAgregar(null)}
        medico={medicoAgregar}
      />
      {/* Dialog Eliminar Disponibilidad */}
      <DialogEliminarDisponibilidad
        open={!!medicoEliminar}
        onClose={() => setMedicoEliminar(null)}
        medico={medicoEliminar}
      />
    </div>
  );
}
