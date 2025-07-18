import { useQuery } from "@tanstack/react-query";
import { getCitas } from "../api/citasApi";

export function useGetCitas() {
  return useQuery({
    queryKey: ["citas"],
    queryFn: () => getCitas(), 
  });
}
