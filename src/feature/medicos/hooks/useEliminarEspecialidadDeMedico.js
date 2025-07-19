import { useMutation } from "@tanstack/react-query";
import { deleteRelacionMedicoEspecialidad } from "../api/medicosApi";

export const useEliminarEspecialidadDeMedico = ({ onSuccess, onError, onSettled } = {}) => {
  return useMutation({
    mutationFn: ({ medicoId, especialidadId }) =>
      deleteRelacionMedicoEspecialidad(medicoId, especialidadId),
    onSuccess,
    onError,
    onSettled,
  });
};
