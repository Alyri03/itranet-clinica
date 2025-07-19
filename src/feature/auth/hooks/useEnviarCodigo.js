import { useMutation } from "@tanstack/react-query";
import { sendVerificationCodeApi } from "../api/authApi";

export function useEnviarCodigo({ onSuccess, onError } = {}) {
  return useMutation({
    mutationFn: sendVerificationCodeApi,
    onSuccess,
    onError,
  });
}
