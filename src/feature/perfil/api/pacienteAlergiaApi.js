import axiosInstance from "@/lib/axios";

// Listar todas las relaciones paciente-alergia
export async function getAllPacienteAlergias() {
  const { data } = await axiosInstance.get("/paciente-alergia");
  return data;
}

// Listar todas las alergias de un paciente por su ID
export async function getPacienteAlergiasByPacienteId(pacienteId) {
  const { data } = await axiosInstance.get(`/paciente-alergia/paciente/${pacienteId}`);
  return data;
}

// Obtener una relación paciente-alergia por su ID
export async function getPacienteAlergiaById(id) {
  const { data } = await axiosInstance.get(`/paciente-alergia/${id}`);
  return data;
}

// Crear una nueva relación paciente-alergia
export async function createPacienteAlergia(pacienteAlergia) {
  const { data } = await axiosInstance.post("/paciente-alergia", pacienteAlergia);
  return data;
}

// Actualizar una relación paciente-alergia existente
export async function updatePacienteAlergia(id, pacienteAlergia) {
  const { data } = await axiosInstance.put(`/paciente-alergia/${id}`, pacienteAlergia);
  return data;
}

// Eliminar una relación paciente-alergia por su ID
export async function deletePacienteAlergia(id) {
  return await axiosInstance.delete(`/paciente-alergia/${id}`);
}
