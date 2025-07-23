// useCrearCita.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearCita } from "../api/citasApi";
import { toast } from "sonner";

export function useCrearCita(onSuccessCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearCita,
    onSuccess: (data, variables) => {
      toast.success("Cita registrada correctamente");
      queryClient.invalidateQueries({ queryKey: ["citas"] });

      if (variables?.medicoId) {
        queryClient.invalidateQueries({
          queryKey: ["bloquesPorMedico", variables.medicoId],
        });
        queryClient.invalidateQueries({
          queryKey: ["citas-confirmadas-medico", variables.medicoId],
        });
      }
      if (variables?.pacienteId) {
        queryClient.invalidateQueries({
          queryKey: ["citas-todas-paciente", variables.pacienteId],
        });
      }
      if (onSuccessCallback) onSuccessCallback(data);
    },

    onError: (error) => {
      console.error("Error al crear cita:", error);
      toast.error("No se pudo registrar la cita");
    },
  });
}
