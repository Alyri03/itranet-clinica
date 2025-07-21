// src/feature/recepcionistas/hooks/useEliminarRecepcionista.js
import { useMutation } from "@tanstack/react-query";
import { deleteRecepcionista } from "../api/recepcionistasApi";

export function useEliminarRecepcionista({ onSuccess, onError } = {}) {
  return useMutation({
    mutationFn: deleteRecepcionista,
    onSuccess,
    onError,
  });
}
