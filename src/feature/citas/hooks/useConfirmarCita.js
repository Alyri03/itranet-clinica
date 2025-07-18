import { useMutation } from "@tanstack/react-query";
import { confirmarCita } from "../api/citasApi";

export function useConfirmarCita(onSuccess) {
  return useMutation({
    mutationFn: async (id) => {
      console.log("📨 useConfirmarCita.mutationFn → ID recibido:", id);
      try {
        const response = await confirmarCita(id);
        console.log("✅ Respuesta desde confirmarCita:", response);
        return response;
      } catch (error) {
        console.error("❌ Error en mutationFn confirmarCita:");
        console.error("🔻 error:", error);
        console.error("🔻 error.response?.data:", error.response?.data);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("🟢 Mutación exitosa:", data);
      if (onSuccess) onSuccess(data);
    },
    onError: (err) => {
      console.error("❌ Error global useConfirmarCita →", err);
    },
  });
}
