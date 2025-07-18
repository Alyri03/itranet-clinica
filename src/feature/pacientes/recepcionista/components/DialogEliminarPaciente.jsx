import { useEliminarPaciente } from "../../hooks/useEliminarPaciente";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function DialogEliminarPaciente({
  open,
  onClose,
  paciente,
  onDeleted,
}) {
  const [localLoading, setLocalLoading] = useState(false);

  const { mutate, isLoading } = useEliminarPaciente({
    onSuccess: () => {
      setLocalLoading(false);
      onClose();
      onDeleted && onDeleted(paciente);
    },
    onError: () => {
      setLocalLoading(false);
    },
  });

  const handleDelete = () => {
    setLocalLoading(true);
    mutate(paciente.id);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md py-8 px-4 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center gap-2">
          <AlertTriangle className="text-red-500 mb-2" size={44} />
          <h2 className="text-xl font-bold mb-2 text-gray-900">
            ¿Eliminar paciente?
          </h2>
          <p className="text-base text-gray-700 mb-4 text-center">
            ¿Estás seguro de eliminar a {paciente?.nombres || ""}?<br />
            <span className="text-gray-500">
              Esta acción no se puede deshacer.
            </span>
          </p>
        </div>
        <DialogFooter className="justify-center gap-6 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-full px-6 font-medium text-gray-700 border-gray-300 hover:bg-gray-100"
            disabled={isLoading || localLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="rounded-full px-6 font-semibold text-white bg-red-600 hover:bg-red-700 shadow"
            disabled={isLoading || localLoading}
          >
            {isLoading || localLoading ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
