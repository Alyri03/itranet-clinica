import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { deleteMedico } from "../api/medicosApi";

export default function DialogEliminarMedico({
  medico,
  open,
  onClose,
  onSuccess,
}) {
  const [internalOpen, setInternalOpen] = useState(open);

  useEffect(() => {
    setInternalOpen(open);
  }, [open]);

  const eliminarMutation = useMutation({
    mutationFn: async (medico) => {
      if (!medico) throw new Error("Médico no definido");
      return await deleteMedico(medico.id);
    },
    onSuccess: () => {
      toast.success("Médico eliminado correctamente");
      onClose();
      onSuccess?.();
    },
    onError: (err) => {
      console.error("Error al eliminar:", err);
      toast.error("Error al eliminar el médico");
    },
  });

  const handleEliminar = () => {
    eliminarMutation.mutate(medico);
  };

  if (!medico) return null;

  return (
    <Dialog open={internalOpen} onOpenChange={setInternalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás seguro?</DialogTitle>
        </DialogHeader>
        <p>
          ¿Deseas eliminar al médico{" "}
          <strong>
            {medico.nombres} {medico.apellidos}
          </strong>
          ?
        </p>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleEliminar}
            disabled={eliminarMutation.isLoading}
          >
            {eliminarMutation.isLoading ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
