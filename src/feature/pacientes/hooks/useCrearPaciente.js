import { useMutation } from "@tanstack/react-query";
import { crearPacienteDatosInciales } from "../api/pacientesApi";

export function useCrearPaciente({ onSuccess, onError }) {
  return useMutation({
    mutationFn: crearPacienteDatosInciales,
    onSuccess,
    onError,
  });
}
