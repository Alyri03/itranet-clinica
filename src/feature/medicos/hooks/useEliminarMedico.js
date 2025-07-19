import { useMutation } from "@tanstack/react-query";
import { deleteMedico } from "../api/medicosApi";

export const useEliminarMedico = ({ onSuccess, onError, onSettled } = {}) => {
  return useMutation({
    mutationFn: (id) => deleteMedico(id),
    onSuccess,
    onError,
    onSettled,
  });
};
