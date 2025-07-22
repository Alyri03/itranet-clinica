import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPacienteAlergias,
  getPacienteAlergiasByPacienteId,
  getPacienteAlergiaById,
  createPacienteAlergia,
  updatePacienteAlergia,
  deletePacienteAlergia,
} from "../api/pacienteAlergiaApi";

// Listar TODAS las relaciones paciente-alergia
export function useAllPacienteAlergias(options = {}) {
  return useQuery({
    queryKey: ["pacienteAlergias"],
    queryFn: getAllPacienteAlergias,
    ...options,
  });
}

// Listar alergias de un paciente por su ID
export function usePacienteAlergiasByPacienteId(pacienteId, options = {}) {
  return useQuery({
    queryKey: ["pacienteAlergias", pacienteId],
    queryFn: () => getPacienteAlergiasByPacienteId(pacienteId),
    enabled: !!pacienteId,
    ...options,
  });
}

// Obtener una relación paciente-alergia por ID
export function usePacienteAlergiaById(id, options = {}) {
  return useQuery({
    queryKey: ["pacienteAlergia", id],
    queryFn: () => getPacienteAlergiaById(id),
    enabled: !!id,
    ...options,
  });
}

// Mutación: Crear paciente-alergia
export function useCrearPacienteAlergia(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPacienteAlergia,
    onSuccess: (...params) => {
      queryClient.invalidateQueries(["pacienteAlergias"]);
      // 👇 Invalidar todas las queries por pacienteId activas
      queryClient.invalidateQueries({ queryKey: ["pacienteAlergias"] });
      if (params[0]?.pacienteId) {
        queryClient.invalidateQueries([
          "pacienteAlergias",
          params[0].pacienteId,
        ]);
      }
      options.onSuccess && options.onSuccess(...params);
    },
    ...options,
  });
}

// Mutación: Eliminar paciente-alergia
export function useEliminarPacienteAlergia(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePacienteAlergia,
    onSuccess: (...params) => {
      queryClient.invalidateQueries(["pacienteAlergias"]);
      // 👇 Si tienes el pacienteId aquí, invalidalo también
      if (params[0]?.pacienteId) {
        queryClient.invalidateQueries([
          "pacienteAlergias",
          params[0].pacienteId,
        ]);
      } else {
        // O simplemente invalida todos los de pacienteAlergias (más general)
        queryClient.invalidateQueries({ queryKey: ["pacienteAlergias"] });
      }
      options.onSuccess && options.onSuccess(...params);
    },
    ...options,
  });
}

// Mutación: Actualizar paciente-alergia
export function useActualizarPacienteAlergia(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, pacienteAlergia }) =>
      updatePacienteAlergia(id, pacienteAlergia),
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: ["pacienteAlergias"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["user-profile"],
        exact: false,
      });
      options.onSuccess && options.onSuccess(...params);
    },
    ...options,
  });
}
