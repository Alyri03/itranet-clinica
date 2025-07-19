import { useMutation } from "@tanstack/react-query";
import { verifyCodeApi } from "../api/authApi";

export function useVerificarCodigo({ onSuccess, onError } = {}) {
  return useMutation({
    mutationFn: verifyCodeApi,
    onSuccess,
    onError,
  });
}
