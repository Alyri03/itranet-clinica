import { useMutation } from "@tanstack/react-query";
import { createRecepcionista } from "../api/recepcionistasApi";

export function useCrearRecepcionista({ onSuccess, onError } = {}) {
  return useMutation({
    mutationFn: createRecepcionista,
    onSuccess,
    onError,
  });
}
