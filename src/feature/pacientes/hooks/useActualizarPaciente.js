import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarDatosPaciente } from "../api/pacientesApi";

export function useActualizarPaciente({ onSuccess, onError }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, datosPaciente }) =>
      actualizarDatosPaciente(id, datosPaciente),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["pacientes"]);
      if (onSuccess) onSuccess(data);
    },
    onError,
  });
}
