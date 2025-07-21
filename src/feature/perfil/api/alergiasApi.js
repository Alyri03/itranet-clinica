import axiosInstance from "@/lib/axios";

// Listar todas las alergias
export async function getAlergias() {
  const { data } = await axiosInstance.get("/alergias");
  return data;
}

// Listar alergias por tipo (ALIMENTARIA, MEDICA, AMBIENTAL, OTRO)
export async function getAlergiasPorTipo(tipoAlergia) {
  // Ejemplo: tipoAlergia = "MEDICA"
  const { data } = await axiosInstance.get(`/alergias/${tipoAlergia}`);
  return data;
}

// Obtener una alergia por su ID
export async function getAlergiaById(id) {
  const { data } = await axiosInstance.get(`/alergias/id/${id}`);
  return data;
}

// Crear una nueva alergia
export async function createAlergia(alergia) {
  const { data } = await axiosInstance.post("/alergias", alergia);
  return data;
}

// Actualizar una alergia existente
export async function updateAlergia(id, alergia) {
  const { data } = await axiosInstance.put(`/alergias/${id}`, alergia);
  return data;
}

// Eliminar una alergia por su ID
export async function deleteAlergia(id) {
  return await axiosInstance.delete(`/alergias/${id}`);
}
