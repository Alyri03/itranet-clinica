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
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import DialogAgregarRecepcionista from "./DialogAgregarRecepcionista";
import DialogEditarRecepcionista from "./DialogEditarRecepcionista";
import DialogEliminarRecepcionista from "./DialogEliminarRecepcionista";
import { getInitials } from "../../../utils/Avatar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TablaGestionRecepcionista() {
  const [openAgregar, setOpenAgregar] = useState(false);
  const [editando, setEditando] = useState(null);
  const [eliminando, setEliminando] = useState(null);

  const { data: recepcionistas, isLoading } = useRecepcionistas();
  const { data: tiposDocumento } = useTiposDocumento();
  const queryClient = useQueryClient();

  const getTipoDocumento = (id) => {
    if (!tiposDocumento) return "-";
    const tipo = tiposDocumento.find((t) => t.id === id);
    return tipo ? tipo.nombre : "-";
  };

  const handleEliminarSuccess = () => {
    setEliminando(null);
    queryClient.invalidateQueries(["recepcionistas"]);
  };

  // Badge de turno bonito
  const getTurnoBadge = (turno) => {
    if (!turno) return <Badge variant="outline">—</Badge>;
    const t = turno.toLowerCase();
    if (t === "diurno") return (
      <Badge className="bg-green-100 text-green-700 border-green-200">
        Diurno
      </Badge>
    );
    if (t === "nocturno") return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
        Nocturno
      </Badge>
    );
    return <Badge variant="secondary">{turno}</Badge>;
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

      <DialogAgregarRecepcionista open={openAgregar} onOpenChange={setOpenAgregar} />
      <DialogEditarRecepcionista
        open={!!editando}
        onOpenChange={() => setEditando(null)}
        recepcionista={editando}
      />
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
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-orange-400 text-white font-bold">
                      {getInitials(r.nombres, r.apellidos)}
                    </AvatarFallback>
                  </Avatar>
                  <span>
                    {r.nombres} {r.apellidos}
                  </span>
                </div>
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
                {getTurnoBadge(r.turnoTrabajo)}
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
