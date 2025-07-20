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
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { useMedico } from "../hooks/useMedico";
import DialogCrearMedico from "../components/DialogCrearMedico";
import DialogEliminarMedico from "../components/DialogEliminarMedico";
import DialogEditarMedico from "../components/DialogEditarMedico";
import { useEspecialidadByMedico } from "../hooks/useEspecialidadByMedico";
import { useState } from "react";
import { getInitials } from "../../../utils/Avatar";
import { useTiposDocumento } from "../../pacientes/hooks/useTiposDocumento";
import Spinner from "../../../components/Spinner";

// Subcomponente para especialidad
function CeldaEspecialidad({ medico }) {
  const { data: especialidades = [], isLoading } = useEspecialidadByMedico(
    medico.id,
    medico.tipoMedico === "ESPECIALISTA"
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

// Subcomponente para documento
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

export default function TablaGestionMedicos() {
  const { data: medicos = [], isLoading, refetch } = useMedico();
  const { data: tiposDocumento = [] } = useTiposDocumento();

  const [paginaActual, setPaginaActual] = useState(1);
  const medicosPorPagina = 8;
  const totalPaginas = Math.ceil(medicos.length / medicosPorPagina);
  const medicosPaginados = medicos.slice(
    (paginaActual - 1) * medicosPorPagina,
    paginaActual * medicosPorPagina
  );

  const [openCrear, setOpenCrear] = useState(false);
  const [medicoAEliminar, setMedicoAEliminar] = useState(null);
  const [medicoAEditar, setMedicoAEditar] = useState(null);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <Spinner className="w-8 h-8 mb-3" />
        <span className="text-gray-500">Cargando médicos...</span>
      </div>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Listado de Médicos</h2>
        <Button onClick={() => setOpenCrear(true)}>
          <UserPlus size={18} className="mr-2" />
          Nuevo Médico
        </Button>
      </div>

      <DialogCrearMedico open={openCrear} onClose={() => setOpenCrear(false)} />
      <DialogEliminarMedico
        medico={medicoAEliminar}
        open={!!medicoAEliminar}
        onClose={() => setMedicoAEliminar(null)}
        onSuccess={refetch}
      />
      <DialogEditarMedico
        open={!!medicoAEditar}
        onClose={() => setMedicoAEditar(null)}
        medico={medicoAEditar}
        onSuccess={refetch}
      />
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
              <TableHead className="w-28 text-center">Acciones</TableHead>
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
                  {/* MÉDICO CON AVATAR Y NOMBRES EN DOS LÍNEAS */}
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
                  {/* DOCUMENTO */}
                  <TableCell>
                    <CeldaDocumento
                      medico={medico}
                      tiposDocumento={tiposDocumento}
                    />
                  </TableCell>
                  {/* TIPO */}
                  <TableCell>
                    {medico.tipoMedico === "ESPECIALISTA" ? (
                      <Badge variant="especialista">ESPECIALISTA</Badge>
                    ) : (
                      <Badge variant="general">GENERAL</Badge>
                    )}
                  </TableCell>
                  {/* ESPECIALIDAD */}
                  <TableCell>
                    <CeldaEspecialidad medico={medico} />
                  </TableCell>
                  {/* COLEGIATURA */}
                  <TableCell className="text-xs">
                    {medico.numeroColegiatura}
                  </TableCell>
                  {/* RNE */}
                  <TableCell className="text-xs">
                    {medico.tipoMedico === "ESPECIALISTA" &&
                    medico.numeroRNE ? (
                      medico.numeroRNE
                    ) : (
                      <span className="text-gray-400 italic">No aplica</span>
                    )}
                  </TableCell>
                  {/* TELÉFONO */}
                  <TableCell className="text-xs">{medico.telefono}</TableCell>
                  {/* ACCIONES */}
                  <TableCell className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setMedicoAEditar(medico)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setMedicoAEliminar(medico)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* PAGINACIÓN */}
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
    </div>
  );
}
