import { useQuery } from "@tanstack/react-query";
import { getPacientesPorMedico } from "../api/citasApi";

export const usePacientesDeUnMedico = (medicoId) => {
  return useQuery({
    queryKey: ["PacientesDeUnMedico", medicoId],
    queryFn: () => getPacientesPorMedico(medicoId),
    enabled: !!medicoId,
    onSuccess: () => {
      console.log("Pacientes del médico cargados correctamente");
    },
    onError: (error) => {
      console.error("❌ Error al obtener pacientes del médico:", error);
    },
  });
};
