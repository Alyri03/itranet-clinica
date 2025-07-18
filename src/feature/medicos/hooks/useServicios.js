import { useQuery } from "@tanstack/react-query";
import { getServicios } from "../api/medicosApi";

export function useServicios() {
  return useQuery({
    queryKey: ["servicios"],
    queryFn: getServicios,
  });
}
