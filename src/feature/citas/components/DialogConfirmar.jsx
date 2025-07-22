import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useConfirmarCita } from "../hooks/useConfirmarCita";

export default function DialogConfirmar({ open, onOpenChange, cita }) {
  const confirmarCitaMutation = useConfirmarCita(() => onOpenChange(false));

  if (!cita) return null;

  const handleConfirmar = () => {
    confirmarCitaMutation.mutate(cita.id);
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
