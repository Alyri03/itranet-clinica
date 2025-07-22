// src/pacientes/hooks/useResultadosPorPacienteId.js
import { useQuery } from "@tanstack/react-query";
import { getResultadosPorPacienteId } from "../api/pacientesApi";

export default function useResultadosPorPacienteId(pacienteId) {
  return useQuery({
    queryKey: ["resultados-paciente", pacienteId],
    queryFn: () => getResultadosPorPacienteId(pacienteId),
    enabled: !!pacienteId,
  });
}
