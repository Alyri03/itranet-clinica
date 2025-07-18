import { useMutation } from "@tanstack/react-query";
import { crearCita } from "../api/citasApi";
import { toast } from "sonner"; // o el sistema de notificaciones que uses

export function useCrearCita(onSuccessCallback) {
  return useMutation({
    mutationFn: crearCita,
    onSuccess: (data) => {
      toast.success("Cita registrada correctamente ✅");
      if (onSuccessCallback) onSuccessCallback(data);
    },
    onError: (error) => {
      console.error("Error al crear cita:", error);
      toast.error("No se pudo registrar la cita ❌");
    },
  });
}
