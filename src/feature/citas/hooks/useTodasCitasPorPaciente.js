import { useQuery } from "@tanstack/react-query";
import { getTodasCitasPorPaciente } from "../api/citasApi";

export function useTodasCitasPorPaciente(pacienteId, options = {}) {
  return useQuery({
    queryKey: ["citas-todas-paciente", pacienteId],
    queryFn: () => getTodasCitasPorPaciente(pacienteId),
    enabled: !!pacienteId,
    ...options,
  });
}
