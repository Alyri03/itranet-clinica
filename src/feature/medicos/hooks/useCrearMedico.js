import { useMutation } from "@tanstack/react-query";
import { createMedico } from "../api/medicosApi";

export const useCrearMedico = ({ onSuccess, onError, onSettled } = {}) => {
  return useMutation({
    mutationFn: createMedico,
    onSuccess,
    onError,
    onSettled,
  });
};
