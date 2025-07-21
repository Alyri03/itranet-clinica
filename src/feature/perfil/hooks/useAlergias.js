import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAlergias,
  getAlergiasPorTipo,
  getAlergiaById,
  createAlergia,
  updateAlergia,
  deleteAlergia,
} from "../api/alergiasApi";

// Listar todas las alergias
export function useAlergias() {
  return useQuery({
    queryKey: ["alergias"],
    queryFn: getAlergias,
  });
}

// Listar alergias por tipo
export function useAlergiasPorTipo(tipoAlergia, options = {}) {
  return useQuery({
    queryKey: ["alergias", tipoAlergia],
    queryFn: () => getAlergiasPorTipo(tipoAlergia),
    enabled: !!tipoAlergia,
    ...options,
  });
}

// Obtener alergia por ID
export function useAlergiaById(id, options = {}) {
  return useQuery({
    queryKey: ["alergias", "id", id],
    queryFn: () => getAlergiaById(id),
    enabled: !!id,
    ...options,
  });
}

// Mutación: Crear alergia
export function useCrearAlergia(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAlergia,
    onSuccess: (...params) => {
      queryClient.invalidateQueries(["alergias"]);
      options.onSuccess && options.onSuccess(...params);
    },
    ...options,
  });
}

// Mutación: Actualizar alergia
export function useActualizarAlergia(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, alergia }) => updateAlergia(id, alergia),
    onSuccess: (...params) => {
      queryClient.invalidateQueries(["alergias"]);
      options.onSuccess && options.onSuccess(...params);
    },
    ...options,
  });
}

// Mutación: Eliminar alergia
export function useEliminarAlergia(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAlergia,
    onSuccess: (...params) => {
      queryClient.invalidateQueries(["alergias"]);
      options.onSuccess && options.onSuccess(...params);
    },
    ...options,
  });
}
