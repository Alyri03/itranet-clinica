import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarPaciente } from "../api/pacientesApi";

export function useEliminarPaciente({ onSuccess, onError }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarPaciente,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["pacientes"]);
      if (onSuccess) onSuccess(data);
    },
    onError,
  });
}
