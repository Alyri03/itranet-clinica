import { useMutation } from "@tanstack/react-query";
import { eliminarPaciente } from "../api/pacientesApi";

export function useEliminarPaciente() {
  return useMutation({
    mutationFn: eliminarPaciente,
  });
}
