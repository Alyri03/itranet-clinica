import { useQuery } from "@tanstack/react-query";
import { getRecepcionistaById } from "../api/recepcionistasApi";

export function useRecepcionista(id, { onSuccess, onError } = {}) {
  return useQuery({
    queryKey: ["recepcionista", id],
    queryFn: () => getRecepcionistaById(id),
    enabled: !!id,
    onSuccess,
    onError,
  });
}
