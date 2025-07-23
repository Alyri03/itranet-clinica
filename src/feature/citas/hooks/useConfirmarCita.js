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
      toast.success("Cita confirmada correctamente");
      queryClient.invalidateQueries({ queryKey: ["citas"] });
      if (data?.pacienteId) {
        queryClient.invalidateQueries({
          queryKey: ["citas-todas-paciente", data.pacienteId],
        });
      }
      if (data?.medicoId) {
        queryClient.invalidateQueries({
          queryKey: ["citas-confirmadas-medico", data.medicoId],
        });
        queryClient.invalidateQueries({
          queryKey: ["PacientesDeUnMedico", data.medicoId],
        });
      }
      if (onSuccess) onSuccess(data);
    },
    onError: (err) => {
      toast.error("Error al confirmar la cita");
      console.error("Error global useConfirmarCita →", err);
    },
  });
}
