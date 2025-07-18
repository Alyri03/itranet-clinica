import { useQuery } from "@tanstack/react-query";
import { getCitasFuturasPorPaciente } from "../api/citasApi";

export function useCitasPaciente(pacienteId) {
  return useQuery({
    queryKey: ["citasFuturas", pacienteId],
    queryFn: () => getCitasFuturasPorPaciente(pacienteId),
    enabled: !!pacienteId,
  });
}
