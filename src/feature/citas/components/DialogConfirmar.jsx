import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useConfirmarCita } from "../hooks/useConfirmarCita";
import { useQueryClient } from "@tanstack/react-query";

export default function DialogConfirmar({ open, onOpenChange, cita }) {
  const queryClient = useQueryClient();
  const confirmarCitaMutation = useConfirmarCita();

  if (!cita) return null;

  const handleConfirmar = () => {
    console.log("🟢 Confirmando desde Dialog:", cita);

    confirmarCitaMutation.mutate(cita.id, {
      onSuccess: () => {
        console.log("✅ Cita confirmada desde Dialog");
        queryClient.invalidateQueries({ queryKey: ["Citas"] });
        onOpenChange(false);
      },
      onError: (err) => {
        console.error("❌ Error al confirmar desde Dialog:", err);
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar cita</DialogTitle>
        </DialogHeader>

        <p>
          ¿Estás seguro de que deseas confirmar la cita de{" "}
          <strong>{cita.paciente}</strong> con <strong>{cita.medico}</strong>{" "}
          para el día <strong>{cita.fecha}</strong> a las{" "}
          <strong>{cita.hora?.slice(0, 5)}</strong>?
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={confirmarCitaMutation.isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {confirmarCitaMutation.isLoading
              ? "Confirmando..."
              : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
