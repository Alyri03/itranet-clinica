import { useQuery } from "@tanstack/react-query";
import { getMedicos } from "../api/medicosApi";
export function useMedico() {
  return useQuery({
    queryKey: ["bloquesPorMedico"],
    queryFn: () => getMedicos(),
  });
}
