import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api/authApi";

export function useLogin({ onSuccess, onError } = {}) {
  return useMutation({
    mutationFn: loginApi,
    onSuccess,
    onError,
  });
}
