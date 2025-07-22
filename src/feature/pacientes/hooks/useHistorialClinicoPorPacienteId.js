// src/pacientes/hooks/useHistorialClinicoPorPacienteId.js
import { useQuery } from "@tanstack/react-query";
import { getHistorialClinicoPorPacienteId } from "../api/pacientesApi";

export default function useHistorialClinicoPorPacienteId(pacienteId) {
  return useQuery({
    queryKey: ["historial-clinico-paciente", pacienteId],
    queryFn: () => getHistorialClinicoPorPacienteId(pacienteId),
    enabled: !!pacienteId,
  });
}
