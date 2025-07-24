import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePacientesDeUnMedico } from "../../../citas/hooks/usePacientesDeUnMedico";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getSexoBadge } from "../../recepcionista/util/patientUtils.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Spinner from "../../../../components/Spinner.jsx";
import { getInitials } from "../../../../utils/Avatar.js";
import { Input } from "@/components/ui/input"

export default function TablaPacientesDeMedico() {
  const medicoId = useAuthStore((s) => s.medicoId);
  const { data: pacientes = [], isLoading } = usePacientesDeUnMedico(medicoId);

  const [sorting, setSorting] = useState("")

  const filtrarPacientes = pacientes.filter((paciente) => {
    const nombreCompleto = paciente.nombres + " " + paciente.apellidos
    return (
      nombreCompleto.toLowerCase().includes(sorting.toLowerCase()) ||
      paciente.numeroIdentificacion.toLowerCase().includes(sorting.toLowerCase())
    )
  })

  // PAGINACIÓN
  const [paginaActual, setPaginaActual] = useState(1);
  const pacientesPorPagina = 8;
  const totalPaginas = Math.ceil(filtrarPacientes.length / pacientesPorPagina);
  const pacientesPaginados = filtrarPacientes.slice(
    (paginaActual - 1) * pacientesPorPagina,
    paginaActual * pacientesPorPagina
  );

  return (
    <div>
      <div className="border rounded-md p-4 space-y-4 bg-white shadow-sm">
        <Input
          placeholder="Buscar paciente..."
          onChange={(event) =>
            setSorting(event.target.value)
          }
          className="w-full"
        />
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Edad</TableHead>
              <TableHead>Sexo</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Antecedentes</TableHead>
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
                  No hay pacientes asignados
                </TableCell>
              </TableRow>
            ) : (
              pacientesPaginados.map((p, idx) => (
                <TableRow
                  key={p.numeroIdentificacion || idx}
                  className="hover:bg-gray-50 transition-all"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-500 text-white font-semibold">
                          {getInitials(p.nombres, p.apellidos)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-[15px] text-gray-900">
                          {p.nombres} {p.apellidos}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-700 font-medium">
                      {p.edad ?? "-"}
                    </span>
                  </TableCell>
                  <TableCell>{getSexoBadge(p.sexo)}</TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-600">{p.numeroIdentificacion}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-800">{p.telefono}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-600">
                      {p.antecedentes ?? (
                        <span className="text-gray-400 italic">
                          Sin antecedentes
                        </span>
                      )}
                    </span>
                  </TableCell>
                  {/* ACCIONES: columna vacía */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Paginación */}
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
            Página {paginaActual} de {totalPaginas || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
            }
            disabled={paginaActual === totalPaginas || totalPaginas === 0}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
