import axiosInstance from "@/lib/axios";

export async function getCitasFuturasPorPaciente(pacienteId) {
  const response = await axiosInstance.get(
    `citas/paciente/${pacienteId}/citas-futuras`
  );
  return response.data;
}
export async function crearCita(nuevaCita) {
  const response = await axiosInstance.post("/citas", nuevaCita);
  return response.data;
}

export async function getCitas() {
  const response = await axiosInstance.get("citas");
  return response.data;
}

export const cancelarCita = async (citaId) => {
  const { data } = await axiosInstance.put(`/citas/cancelar/${citaId}`);
  return data;
};

export const confirmarCita = async (citaId) => {
  console.log("📡 PATCH confirmar cita ID:", citaId);
  try {
    const { data } = await axiosInstance.put(`/citas/confirmar/${citaId}`);
    console.log("✅ Respuesta del backend:", data);
    return data;
  } catch (err) {
    console.error("❌ Error en confirmarCita API:", err.response?.data || err);
    throw err;
  }
};
