import { useQuery } from "@tanstack/react-query";
import { getCitaById } from "../api/citasApi";

export function useCitaByID(citaId, options = {}) {
  return useQuery({
    queryKey: ["cita", citaId],
    queryFn: () => getCitaById(citaId),
    enabled: !!citaId,
    onSuccess: options.onSuccess,
    onError: options.onError,
  });
}
