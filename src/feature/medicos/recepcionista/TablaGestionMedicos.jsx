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
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { useMedico } from "../hooks/useMedico";
import DialogCrearMedico from "../components/DialogCrearMedico";
import DialogEliminarMedico from "../components/DialogEliminarMedico";
import DialogEditarMedico from "../components/DialogEditarMedico";
import { useState } from "react";

export default function TablaGestionMedicos() {
  const { data: medicos = [], isLoading, refetch } = useMedico();

  const [openCrear, setOpenCrear] = useState(false);
  const [medicoAEliminar, setMedicoAEliminar] = useState(null);
  const [medicoAEditar, setMedicoAEditar] = useState(null);

  if (isLoading) return <p className="text-gray-500">Cargando médicos...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Listado de Médicos</h2>
        <Button onClick={() => setOpenCrear(true)}>
          <UserPlus size={18} className="mr-2" />
          Nuevo Médico
        </Button>
      </div>

      {/* Dialogs */}
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre Completo</TableHead>
            <TableHead>N° Colegiatura</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Especialidad</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medicos.map((medico) => (
            <TableRow key={medico.id}>
              <TableCell>{medico.nombres} {medico.apellidos}</TableCell>
              <TableCell>{medico.numeroColegiatura}</TableCell>
              <TableCell>
                <Badge variant="outline">{medico.tipoMedico}</Badge>
              </TableCell>
              <TableCell>
                {medico.tipoMedico === "GENERAL" ? (
                  <span className="text-gray-400 italic">No aplica</span>
                ) : (
                  <span className="text-blue-600 font-medium">Especialista</span>
                )}
              </TableCell>
              <TableCell>{medico.telefono}</TableCell>
              <TableCell>
                <Badge className="bg-green-600 hover:bg-green-700">Activo</Badge>
              </TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
