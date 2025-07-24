import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearDisponibilidad } from "../api/disponibilidadApi";

export function useCrearDisponibilidad({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearDisponibilidad,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["disponibilidades"] });
      onSuccess?.(data, variables, context);
    },
    onError,
  });
}
