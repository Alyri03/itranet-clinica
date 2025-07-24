import { useQuery } from "@tanstack/react-query";
import { getDisponibilidadesPorMedico } from "../api/disponibilidadApi";

export function useDisponibilidadesPorMedico(medicoId, options = {}) {
  return useQuery({
    queryKey: ["disponibilidades", medicoId],
    queryFn: () => getDisponibilidadesPorMedico(medicoId),
    enabled: !!medicoId,
    ...options,
  });
}
