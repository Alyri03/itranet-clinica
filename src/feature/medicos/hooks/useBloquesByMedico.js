import { useQuery } from "@tanstack/react-query";
import { getBloquesByMedico } from "../api/medicosApi";

export function useBloquesByMedico(medicoId) {
  return useQuery({
    queryKey: ["bloquesPorMedico", medicoId],
    queryFn: () => getBloquesByMedico(medicoId),
    enabled: !!medicoId, // Solo corre si hay ID
  });
}
