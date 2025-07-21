// src/feature/recepcionistas/api/recepcionistasApi.js
import axiosInstance from "@/lib/axios";

// Listar todos los recepcionistas
export const getAllRecepcionistas = async () => {
  const response = await axiosInstance.get("/recepcionistas");
  return response.data;
};

// Obtener recepcionista por ID
export const getRecepcionistaById = async (id) => {
  const response = await axiosInstance.get(`/recepcionistas/${id}`);
  return response.data;
};

// Crear nuevo recepcionista
export const createRecepcionista = async (data) => {
  const response = await axiosInstance.post("/recepcionistas", data);
  return response.data;
};

// Actualizar recepcionista por ID
export const updateRecepcionista = async (id, data) => {
  const response = await axiosInstance.put(`/recepcionistas/${id}`, data);
  return response.data;
};

// Eliminar recepcionista por ID
export const deleteRecepcionista = async (id) => {
  const response = await axiosInstance.delete(`/recepcionistas/${id}`);
  return response.data;
};

// Obtener info personalizada (my-info)
export const getMyInfoRecepcionista = async (id) => {
  const response = await axiosInstance.get(`/recepcionistas/my-info/${id}`);
  return response.data;
};
