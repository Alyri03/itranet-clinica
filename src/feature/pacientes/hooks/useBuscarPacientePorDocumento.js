import { useQuery } from "@tanstack/react-query";
import { buscarPacientePorDocumento } from "../api/pacientesApi";

export function useBuscarPacientePorDocumento(numIdentificacion, enabled = true) {
  const isEnabled = Boolean(numIdentificacion) && Boolean(enabled);

  return useQuery({
    queryKey: ["buscar-paciente", numIdentificacion],
    queryFn: () => buscarPacientePorDocumento(numIdentificacion),
    enabled: isEnabled, 
  });
}
