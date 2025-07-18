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