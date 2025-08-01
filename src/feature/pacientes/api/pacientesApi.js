import axiosInstance from "@/lib/axios";

export default async function getPacientes() {
  const response = await axiosInstance.get("/pacientes");
  return response.data;
}
export const buscarPacientePorDocumento = async (numIdentificacion) => {
  const { data } = await axiosInstance.get(
    `/pacientes/num-identificacion/${numIdentificacion}`
  );
  return data;
};

export async function crearPacienteDatosInciales(datosPaciente) {
  const response = await axiosInstance.post(
    "/pacientes/datosIniciales",
    datosPaciente
  );
  return response.data;
}

export const actualizarDatosPaciente = async (id, datosPaciente) => {
  try {
    const { data } = await axiosInstance.put(`/pacientes/${id}`, datosPaciente);
    return data;
  } catch (error) {
    throw error.response?.data?.message || "Error al actualizar paciente";
  }
};

export const eliminarPaciente = async (id) => {
  try {
    await axiosInstance.delete(`/pacientes/${id}`);
    return { success: true };
  } catch (error) {
    const msg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Error al eliminar paciente";
    throw new Error(msg);
  }
};

export const getTiposDocumento = async () => {
  const { data } = await axiosInstance.get("/tipos-documentos");
  return data;
};

export const getPacientePorId = async (id) => {
  const { data } = await axiosInstance.get(`/pacientes/id/${id}`);
  return data;
};

export const getAlergiasPorPacienteId = async (pacienteId) => {
  const { data } = await axiosInstance.get(
    `/paciente-alergia/paciente/${pacienteId}`
  );
  return data;
};

export const getResultadosPorPacienteId = async (pacienteId) => {
  const { data } = await axiosInstance.get(`/resultados/por-paciente/${pacienteId}`);
  return data;
};

export const getHistorialClinicoPorPacienteId = async (pacienteId) => {
  const { data } = await axiosInstance.get(`/historial-clinico/paciente/${pacienteId}`);
  return data;
};
