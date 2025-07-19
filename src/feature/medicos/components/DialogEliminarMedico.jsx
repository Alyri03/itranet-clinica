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
import { useEliminarMedico } from "../hooks/useEliminarMedico";

export default function DialogEliminarMedico({
  medico,
  open,
  onClose,
  onSuccess,
}) {
  const [internalOpen, setInternalOpen] = useState(open);
  const [isWaiting, setIsWaiting] = useState(false); // para el timeout

  useEffect(() => {
    setInternalOpen(open);
  }, [open]);

  const eliminarMutation = useEliminarMedico({
    onSuccess: async () => {
      toast.success("Médico eliminado correctamente");
      setInternalOpen(false);
      onClose();
      onSuccess?.();
      // Espera 3s antes de permitir otra eliminación
      setIsWaiting(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsWaiting(false);
    },
    onError: async (err) => {
      console.error("Error al eliminar:", err);
      toast.error("Error al eliminar el médico");

      setInternalOpen(false);
      onClose();

      setIsWaiting(true);
      await new Promise((res) => setTimeout(res, 3000));
      setIsWaiting(false);
    },
  });

  const handleEliminar = () => {
    if (medico?.id && !isWaiting && !eliminarMutation.isLoading) {
      eliminarMutation.mutate(medico.id);
    }
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
          <Button
            variant="ghost"
            onClick={() => {
              setInternalOpen(false);
              onClose();
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleEliminar}
            disabled={eliminarMutation.isLoading || isWaiting}
          >
            {eliminarMutation.isLoading
              ? "Eliminando..."
              : isWaiting
              ? "Espera un momento..."
              : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
