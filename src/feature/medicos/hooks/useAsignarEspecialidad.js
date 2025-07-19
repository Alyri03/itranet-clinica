import { useMutation } from "@tanstack/react-query";
import { addRelacionMedicoEspecialidad } from "../api/medicosApi";

export const useAsignarEspecialidad = ({ onSuccess, onError, onSettled } = {}) => {
  return useMutation({
    mutationFn: (relacion) => addRelacionMedicoEspecialidad(relacion),
    onSuccess,
    onError,
    onSettled,
  });
};
