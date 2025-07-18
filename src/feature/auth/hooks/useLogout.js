import { useMutation } from "@tanstack/react-query";
import { logoutApi } from "../api/authApi";

export function useLogout(options) {
  return useMutation({
    mutationFn: logoutApi,
    ...options,
  });
}
