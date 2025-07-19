import { useMutation } from "@tanstack/react-query";
import { completeRegistrationApi } from "../api/authApi";

export function useCompletarRegistro({ onSuccess, onError } = {}) {
  return useMutation({
    mutationFn: completeRegistrationApi,
    onSuccess,
    onError,
  });
}
