import { useMutation } from "@tanstack/react-query";
import { fullRegisterApi } from "../api/authApi";

export function useRegistroCompleto({ onSuccess, onError } = {}) {
  return useMutation({
    mutationFn: fullRegisterApi,
    onSuccess,
    onError,
  });
}
