import { useQuery } from "@tanstack/react-query";
import getPacientes from "../api/pacientesApi";

export function usePacientes() {
  return useQuery({
    queryKey: ["pacientes"],
    queryFn: getPacientes,
  });
}
