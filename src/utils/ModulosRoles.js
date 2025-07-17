export const MODULOS_ROLES = {
  paciente: [
    "main",
    "citas",
    "perfil",
  ],
  medico: [
    "main",
    "agenda",
    "atencion",
    "pacientes",
    "perfil",
  ],
  recepcionista: [
    "citas",
    "pacientes",
    "medicos",
    "perfil",
  ],
  administrador: [
    "dashboard",
    "pacientes",
    "medicos",
    "recepcionistas",
    "perfil",
  ],
};
