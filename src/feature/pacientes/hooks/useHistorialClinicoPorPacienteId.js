import { useQuery } from "@tanstack/react-query";
import { getHistorialClinicoPorPacienteId } from "../api/pacientesApi";

export default function useHistorialClinicoPorPacienteId(pacienteId) {
  return useQuery({
    queryKey: ["e", pacienteId],
    queryFn: () => getHistorialClinicoPorPacienteId(pacienteId),
    enabled: !!pacienteId,
  });
}
