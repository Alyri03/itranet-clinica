import { useQuery } from "@tanstack/react-query";
import { getCitasHoy } from "../api/dashboardApi";

export function useCitasHoy(options = {}) {
  return useQuery({
    queryKey: ["citasHoy"],
    queryFn: getCitasHoy,
    ...options,
  });
}
