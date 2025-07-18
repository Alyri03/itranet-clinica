import axiosInstance from "@/lib/axios";

// Busca el paciente cuyo usuario.id === userId
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

  // Segundo fetch: usuario/correo
  try {
    const { data: usuario } = await axiosInstance.get(`/usuarios/${usuarioId}`);
    return {
      ...medico,
      usuario: usuario,
    };
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return { ...medico, usuario: null };
  }
}
