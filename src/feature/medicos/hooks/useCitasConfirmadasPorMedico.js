import { useQuery } from "@tanstack/react-query";
import { getCitasConfirmadasPorMedico } from "../api/medicosApi"; 

export const useCitasConfirmadasPorMedico = (medicoId, { onSuccess, onError } = {}) => {
  return useQuery({
    queryKey: ["citas-confirmadas-medico", medicoId],
    queryFn: () => getCitasConfirmadasPorMedico(medicoId),
    enabled: !!medicoId,
    onSuccess,
    onError,
  });
};
