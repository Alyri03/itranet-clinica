import axiosInstance from "@/lib/axios";

// Crear (agregar) disponibilidad
export const crearDisponibilidad = async (payload) => {
  const { data } = await axiosInstance.post("/disponibilidad", payload);
  return data;
};

// Eliminar disponibilidad (por id)
export const eliminarDisponibilidad = async (disponibilidadId) => {
  const { data } = await axiosInstance.delete(`/disponibilidad/${disponibilidadId}`);
  return data;
};

// Listar todas las disponibilidades de un médico
export const getDisponibilidadesPorMedico = async (medicoId) => {
  const { data } = await axiosInstance.get(`/disponibilidad/medico/${medicoId}`);
  return data;
};
