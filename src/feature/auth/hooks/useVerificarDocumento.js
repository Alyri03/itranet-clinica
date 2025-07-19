import { useMutation } from "@tanstack/react-query";
import { verifyDocumentApi } from "../api/authApi";

export function useVerificarDocumento({ onSuccess, onError } = {}) {
  return useMutation({
    mutationFn: verifyDocumentApi,
    onSuccess,
    onError,
  });
}
