import axiosInstance from "@/lib/axios";

export const getMedicosByEspecialidad = async (especialidadId) => {
  const { data } = await axiosInstance.get(
    `/medico-especialidad/especialidad/${especialidadId}`
  );
  return data;
};

export const getEspecialidadByMedico = async (medicoId) => {
  const { data } = await axiosInstance.get(
    `/medico-especialidad/medico/${medicoId}`
  );
  return data;
};

export const getBloquesByMedico = async (medicoId) => {
  const { data } = await axiosInstance.get(
    `/horario-bloques/medico/${medicoId}`
  );
  return data;
};

export const getServicios = async () => {
  const { data } = await axiosInstance.get("/servicios");
  return data;
};

export const getMedicos = async () => {
  const { data } = await axiosInstance.get("medicos");
  return data;
};
