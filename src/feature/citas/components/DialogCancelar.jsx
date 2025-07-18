import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCancelarCita } from "../hooks/useCancelarCita";
import { useQueryClient } from "@tanstack/react-query";

export default function DialogCancelar({ open, onOpenChange, citaId }) {
  const queryClient = useQueryClient();
  const { mutate: cancelarCita, isLoading } = useCancelarCita();

  const handleCancelar = () => {
    console.log("🛑 Cancelando cita con ID:", citaId);
    cancelarCita(citaId, {
      onSuccess: () => {
        console.log("✅ Cita cancelada con éxito");
        onOpenChange(false);
        queryClient.invalidateQueries({ queryKey: ["Citas"] });
      },
      onError: (err) => {
        console.error("❌ Error al cancelar cita:", err);
        onOpenChange(false);
      },
    });
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
