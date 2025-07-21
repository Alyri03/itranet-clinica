import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRecepcionistas } from "../hooks/useRecepcionistas";
import { useTiposDocumento } from "../../pacientes/hooks/useTiposDocumento";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import DialogAgregarRecepcionista from "./DialogAgregarRecepcionista";
import DialogEditarRecepcionista from "./DialogEditarRecepcionista";
import DialogEliminarRecepcionista from "./DialogEliminarRecepcionista";

export default function TablaGestionRecepcionista() {
  const [openAgregar, setOpenAgregar] = useState(false);
  const [editando, setEditando] = useState(null);
  const [eliminando, setEliminando] = useState(null);

  const { data: recepcionistas, isLoading } = useRecepcionistas();
  const { data: tiposDocumento } = useTiposDocumento();

  const queryClient = useQueryClient();

  // Función para buscar el nombre del tipo de documento por id
  const getTipoDocumento = (id) => {
    if (!tiposDocumento) return "-";
    const tipo = tiposDocumento.find((t) => t.id === id);
    return tipo ? tipo.nombre : "-";
  };

  // Función que se pasa al dialog de eliminar, para refrescar tabla al eliminar
  const handleEliminarSuccess = () => {
    setEliminando(null);
    // Refresca la tabla
    queryClient.invalidateQueries(["recepcionistas"]);
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Button className="gap-2" onClick={() => setOpenAgregar(true)}>
          <UserPlus size={18} />
          Agregar Recepcionista
        </Button>
      </div>

      {/* Diálogo para agregar */}
      <DialogAgregarRecepcionista
        open={openAgregar}
        onOpenChange={setOpenAgregar}
      />

      {/* Diálogo para editar */}
      <DialogEditarRecepcionista
        open={!!editando}
        onOpenChange={() => setEditando(null)}
        recepcionista={editando}
      />

      {/* Diálogo para eliminar */}
      <DialogEliminarRecepcionista
        open={!!eliminando}
        onOpenChange={() => setEliminando(null)}
        recepcionista={eliminando}
        onSuccess={handleEliminarSuccess}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre completo</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Turno</TableHead>
            <TableHead>Fecha contratación</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recepcionistas?.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                {r.nombres} {r.apellidos}
              </TableCell>
              <TableCell>
                <div className="font-semibold">
                  {getTipoDocumento(r.tipoDocumentoId)}
                </div>
                <div className="text-muted-foreground text-xs">
                  {r.numeroDocumento}
                </div>
              </TableCell>
              <TableCell>{r.telefono}</TableCell>
              <TableCell>{r.direccion}</TableCell>
              <TableCell>
                <span className="capitalize">
                  {r.turnoTrabajo?.toLowerCase()}
                </span>
              </TableCell>
              <TableCell>
                {new Date(r.fechaContratacion).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditando(r)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setEliminando(r)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
