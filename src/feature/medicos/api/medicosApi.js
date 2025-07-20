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

export const getMedicoById = async (id) => {
  const { data } = await axiosInstance.get(`/medicos/${id}`);
  return data;
};

export const createMedico = async (medicoData) => {
  const { data } = await axiosInstance.post("/medicos", medicoData);
  return data;
};

export const updateMedico = async (id, medicoData) => {
  const { data } = await axiosInstance.put(`/medicos/${id}`, medicoData);
  return data;
};

export const deleteMedico = async (id) => {
  const { data } = await axiosInstance.delete(`/medicos/${id}`);
  return data;
};

export const getEspecialidades = async () => {
  const { data } = await axiosInstance.get("/especialidades");
  return data;
};
export const addRelacionMedicoEspecialidad = async (relacion) => {
  const { data } = await axiosInstance.post("/medico-especialidad", relacion);
  return data;
};
export const updateRelacionMedicoEspecialidad = async (
  medicoId,
  especialidadId,
  body
) => {
  const { data } = await axiosInstance.put(
    `/medico-especialidad/${medicoId}/${especialidadId}`,
    body
  );
  return data;
};
export const deleteRelacionMedicoEspecialidad = async (
  medicoId,
  especialidadId
) => {
  const { data } = await axiosInstance.delete(
    `/medico-especialidad/${medicoId}/${especialidadId}`
  );
  return data;
};

export const getCitasConfirmadasPorMedico = async (medicoId) => {
  const { data } = await axiosInstance.get(
    `/citas/citas-medico-confirmada/${medicoId}`
  );
  return data;
};
