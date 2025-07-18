import { useMutation } from "@tanstack/react-query";
import { crearPacienteDatosInciales } from "../api/pacientesApi";

export function useCrearPaciente() {
  return useMutation({
    mutationFn: crearPacienteDatosInciales,
  });
}
