import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmarCita } from "../api/citasApi";
import { toast } from "sonner";

export function useConfirmarCita(onSuccess) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      return confirmarCita(id);
    },
    onSuccess: (data) => {
      toast.success("Cita confirmada correctamente ✅");
      queryClient.invalidateQueries({ queryKey: ["citas"] });
      if (onSuccess) onSuccess(data);
    },
    onError: (err) => {
      toast.error("Error al confirmar la cita ❌");
      console.error("❌ Error global useConfirmarCita →", err);
    },
  });
}
