import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useEliminarRecepcionista } from "../hooks/useEliminarRecepcionista";

export default function DialogEliminarRecepcionista({
  open,
  onOpenChange,
  recepcionista,
  onSuccess, // Nuevo prop para refrescar tabla
}) {
  const { mutate, isLoading } = useEliminarRecepcionista({
    onSuccess: () => {
      toast.success("Recepcionista eliminado exitosamente");
      if (onSuccess) onSuccess();
      else onOpenChange(false);
    },
    onError: (err) => {
      toast.error("Error al eliminar recepcionista");
      console.error(err);
    },
  });

  if (!recepcionista) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 size={22} />
            Eliminar Recepcionista
          </DialogTitle>
        </DialogHeader>
        <div>
          <p>
            ¿Estás seguro que deseas eliminar al recepcionista{" "}
            <b>
              {recepcionista.nombres} {recepcionista.apellidos}
            </b>
            ?
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            Esta acción no se puede deshacer.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            loading={isLoading}
            onClick={() => mutate(recepcionista.id)}
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
