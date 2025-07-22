import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelarCita } from "../api/citasApi";
import { toast } from "sonner";

export function useCancelarCita(onSuccess) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelarCita,
    onSuccess: (data, variables) => {
      toast.success("Cita cancelada correctamente ✅");
      queryClient.invalidateQueries({ queryKey: ["citas"] });
      if (data?.pacienteId) {
        queryClient.invalidateQueries({
          queryKey: ["citas-todas-paciente", data.pacienteId],
        });
      }
      if (onSuccess) onSuccess(data, variables);
    },
    onError: (err) => {
      toast.error("No se pudo cancelar la cita ❌");
      console.error("❌ Error global useCancelarCita →", err);
    },
  });
}
