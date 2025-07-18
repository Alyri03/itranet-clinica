import { useMutation } from "@tanstack/react-query";
import { cancelarCita } from "../api/citasApi";

export function useCancelarCita(onSuccess) {
  return useMutation({
    mutationFn: cancelarCita,
    onSuccess,
  });
}
