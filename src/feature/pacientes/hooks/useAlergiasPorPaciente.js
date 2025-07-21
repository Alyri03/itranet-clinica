import { useQuery } from "@tanstack/react-query";
import { getAlergiasPorPacienteId } from "../api/pacientesApi";

export function useAlergiasPorPaciente(pacienteId) {
  return useQuery({
    queryKey: ["alergias-paciente", pacienteId],
    queryFn: () => getAlergiasPorPacienteId(pacienteId),
    enabled: !!pacienteId,
  });
}
