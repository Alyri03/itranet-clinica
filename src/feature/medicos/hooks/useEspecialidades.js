import { useQuery } from "@tanstack/react-query";
import { getEspecialidades } from "../api/medicosApi";

export const useEspecialidades = ({ onSuccess, onError, onSettled } = {}) => {
  return useQuery({
    queryKey: ["Especialidades"],
    queryFn: getEspecialidades,
    onSuccess,
    onError,
    onSettled,
  });
};
