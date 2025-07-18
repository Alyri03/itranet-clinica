import { useQuery } from "@tanstack/react-query";
import { getEspecialidadByMedico } from "../api/medicosApi";

export function useEspecialidadByMedico(medicoId, enabled = true) {
  return useQuery({
    queryKey: ["especialidad-medico", medicoId],
    queryFn: () => getEspecialidadByMedico(medicoId),
    enabled: !!medicoId && enabled,
  });
}
