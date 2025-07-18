import axiosInstance from "@/lib/axios";

export async function getProfilePacienteByUsuarioId(userId) {
  const { data } = await axiosInstance.get("/pacientes");
  const paciente = data.find((p) => p.usuario?.id === userId);
  if (!paciente) throw new Error("Paciente no encontrado para este usuario");
  return paciente;
}

export async function getProfileMedicoByUsuarioId(usuarioId) {
  const { data } = await axiosInstance.get("/medicos");
  const medico = data.find((m) => m.usuarioId === usuarioId);
  if (!medico) throw new Error("Médico no encontrado para este usuario");

  try {
    const { data: usuario } = await axiosInstance.get(`/usuarios/${usuarioId}`);
    return { ...medico, usuario };
  } catch {
    return { ...medico, usuario: null };
  }
}

export async function getProfileRecepcionistaByUsuarioId(usuarioId) {
  const { data } = await axiosInstance.get("/recepcionistas");
  const recepcionista = data.find((r) => r.usuarioId === usuarioId);
  if (!recepcionista)
    throw new Error("Recepcionista no encontrado para este usuario");

  try {
    const { data: usuario } = await axiosInstance.get(`/usuarios/${usuarioId}`);
    return { ...recepcionista, usuario };
  } catch {
    return { ...recepcionista, usuario: null };
  }
}

export async function getProfileAdministradorByUsuarioId(usuarioId) {
  const { data } = await axiosInstance.get("/administradores");
  const admin = data.find((a) => a.usuarioId === usuarioId);
  if (!admin) throw new Error("Administrador no encontrado para este usuario");

  try {
    const { data: usuario } = await axiosInstance.get(`/usuarios/${usuarioId}`);
    return { ...admin, usuario };
  } catch {
    return { ...admin, usuario: null };
  }
}
