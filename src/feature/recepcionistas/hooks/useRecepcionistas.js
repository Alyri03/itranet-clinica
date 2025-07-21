// src/feature/recepcionistas/hooks/useRecepcionistas.js
import { useQuery } from "@tanstack/react-query";
import { getAllRecepcionistas } from "../api/recepcionistasApi";

export function useRecepcionistas({ onSuccess, onError } = {}) {
  return useQuery({
    queryKey: ["recepcionistas"],
    queryFn: getAllRecepcionistas,
    onSuccess,
    onError,
  });
}
