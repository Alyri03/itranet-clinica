import { useQuery } from "@tanstack/react-query";
import { getMedicoById } from "../api/medicosApi";

export function useMedicoById(id, options = {}) {
  return useQuery({
    queryKey: ["medico", id],
    queryFn: () => getMedicoById(id),
    enabled: !!id,
    ...options,
  });
}
