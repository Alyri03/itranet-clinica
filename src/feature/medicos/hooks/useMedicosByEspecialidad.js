import { useQuery } from "@tanstack/react-query";
import { getMedicosByEspecialidad } from "../api/medicosApi";

export function useMedicosByEspecialidad(especialidadId) {
  return useQuery({
    queryKey: ["medicosPorEspecialidad", especialidadId],
    queryFn: () => getMedicosByEspecialidad(especialidadId),
    enabled: !!especialidadId, 
  });
}
