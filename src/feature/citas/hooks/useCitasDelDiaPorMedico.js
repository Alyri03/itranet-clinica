import { useQuery } from "@tanstack/react-query";
import { getCitasConfirmadasDelDiaPorMedico } from "../api/citasApi"; 

export const useCitasDelDiaPorMedico = (medicoId) => {
  return useQuery({
    queryKey: ["CitasDelDia", medicoId],
    queryFn: () => getCitasConfirmadasDelDiaPorMedico(medicoId),
    enabled: !!medicoId, // Solo ejecuta si hay un ID válido
  });
};
