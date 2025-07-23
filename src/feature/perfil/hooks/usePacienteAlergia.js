import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPacienteAlergias,
  getPacienteAlergiasByPacienteId,
  getPacienteAlergiaById,
  createPacienteAlergia,
  updatePacienteAlergia,
  deletePacienteAlergia,
} from "../api/pacienteAlergiaApi";

export function useAllPacienteAlergias(options = {}) {
  return useQuery({
    queryKey: ["pacienteAlergias"],
    queryFn: getAllPacienteAlergias,
    ...options,
  });
}

export function usePacienteAlergiasByPacienteId(pacienteId, options = {}) {
  return useQuery({
    queryKey: ["pacienteAlergias", pacienteId],
    queryFn: () => getPacienteAlergiasByPacienteId(pacienteId),
    enabled: !!pacienteId,
    ...options,
  });
}

export function usePacienteAlergiaById(id, options = {}) {
  return useQuery({
    queryKey: ["pacienteAlergia", id],
    queryFn: () => getPacienteAlergiaById(id),
    enabled: !!id,
    ...options,
  });
}

export function useCrearPacienteAlergia(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPacienteAlergia,
    onSuccess: (data, variables, context) => {
      // variables debe incluir pacienteId (es el payload del mutation)
      const pacienteId = variables?.pacienteId;
      // Solo refresca la query específica de ese paciente
      if (pacienteId) {
        queryClient.invalidateQueries(["pacienteAlergias", pacienteId]);
      }
      // Refresca también el perfil del usuario
      queryClient.invalidateQueries(["user-profile"]);
      options.onSuccess && options.onSuccess(data, variables, context);
    },
    ...options,
  });
}

export function useEliminarPacienteAlergia(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePacienteAlergia,
    onSuccess: (data, variables, context) => {
      // Si deletePacienteAlergia espera un ID, pásale también pacienteId en variables (segundo param)
      const pacienteId = variables?.pacienteId;
      if (pacienteId) {
        queryClient.invalidateQueries(["pacienteAlergias", pacienteId]);
      } else {
        // fallback, por si acaso
        queryClient.invalidateQueries({ queryKey: ["pacienteAlergias"] });
      }
      queryClient.invalidateQueries(["user-profile"]);
      options.onSuccess && options.onSuccess(data, variables, context);
    },
    ...options,
  });
}

export function useActualizarPacienteAlergia(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, pacienteAlergia }) =>
      updatePacienteAlergia(id, pacienteAlergia),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["pacienteAlergias"],
        exact: false,
      });
      queryClient.invalidateQueries(["user-profile"]);
      options.onSuccess && options.onSuccess(data, variables, context);
    },
    ...options,
  });
}
