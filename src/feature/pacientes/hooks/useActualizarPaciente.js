import { useMutation } from "@tanstack/react-query";
import { actualizarDatosPaciente } from "../api/pacientesApi";

export function useActualizarPaciente() {
  return useMutation({
    mutationFn: ({ id, datos }) => actualizarDatosPaciente(id, datos),
  });
}
