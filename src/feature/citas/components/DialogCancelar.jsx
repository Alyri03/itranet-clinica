import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCancelarCita } from "../hooks/useCancelarCita";

export default function DialogCancelar({ open, onOpenChange, citaId }) {
  const { mutate: cancelarCita, isLoading } = useCancelarCita(() => onOpenChange(false));

  const handleCancelar = () => {
    cancelarCita(citaId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar cita</DialogTitle>
        </DialogHeader>
        <p>¿Estás seguro de que deseas cancelar esta cita?</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Volver
          </Button>
          <Button
            onClick={handleCancelar}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? "Cancelando..." : "Cancelar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
