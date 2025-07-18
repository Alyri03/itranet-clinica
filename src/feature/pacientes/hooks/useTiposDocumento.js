import { useQuery } from "@tanstack/react-query";
import { getTiposDocumento } from "../api/pacientesApi";

export function useTiposDocumento(options = {}) {
  return useQuery({
    queryKey: ["tipos-documento"],
    queryFn: getTiposDocumento,
    ...options,
  });
}
