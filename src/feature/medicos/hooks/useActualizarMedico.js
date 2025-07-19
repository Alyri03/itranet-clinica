import { useMutation } from "@tanstack/react-query";
import { updateMedico } from "../api/medicosApi";

export const useActualizarMedico = ({ onSuccess, onError, onSettled } = {}) => {
  return useMutation({
    mutationFn: ({ id, medico }) => updateMedico(id, medico),
    onSuccess,
    onError,
    onSettled,
  });
};
