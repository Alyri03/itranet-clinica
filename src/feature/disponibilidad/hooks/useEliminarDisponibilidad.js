import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarDisponibilidad } from "../api/disponibilidadApi";

export function useEliminarDisponibilidad({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eliminarDisponibilidad,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["disponibilidades"] });
      onSuccess?.(data, variables, context);
    },
    onError,
  });
}
