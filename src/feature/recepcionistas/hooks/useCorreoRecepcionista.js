// src/feature/recepcionistas/hooks/useCorreoRecepcionista.js
import { useQuery } from "@tanstack/react-query";
import { getMyInfoRecepcionista } from "../api/recepcionistasApi";

export function useCorreoRecepcionista(id, { onSuccess, onError } = {}) {
  return useQuery({
    queryKey: ["recepcionista-correo", id],
    enabled: !!id,
    queryFn: () => getMyInfoRecepcionista(id),
    select: (data) => data.email || data.correo || "",
    onSuccess,
    onError,
  });
}
