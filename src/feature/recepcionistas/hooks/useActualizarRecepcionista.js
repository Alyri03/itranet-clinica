import { useMutation } from "@tanstack/react-query";
import { updateRecepcionista } from "../api/recepcionistasApi";

export function useActualizarRecepcionista({ onSuccess, onError } = {}) {
  return useMutation({
    mutationFn: ({ id, data }) => updateRecepcionista(id, data),
    onSuccess,
    onError,
  });
}
