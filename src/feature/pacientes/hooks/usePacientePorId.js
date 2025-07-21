import { useQuery } from '@tanstack/react-query';
import { getPacientePorId } from '../api/pacientesApi'; 

export function usePacientePorId(pacienteId) {
  return useQuery({
    queryKey: ['paciente', pacienteId],
    queryFn: () => getPacientePorId(pacienteId),
    enabled: !!pacienteId,
  });
}
