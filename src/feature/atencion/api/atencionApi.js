import axiosInstance from "@/lib/axios";
export async function enviarResultado(data) {
  try {
    const response = await axiosInstance.post("/resultados", data);
    return response.data;
  } catch (error) {
    console.error("Error al enviar resultado:", error.response?.data || error);
    throw error;
  }
}
