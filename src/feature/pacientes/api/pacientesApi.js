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