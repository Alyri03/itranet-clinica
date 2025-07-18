import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/useAuthStore";
import {
  getProfilePacienteByUsuarioId,
  getProfileMedicoByUsuarioId,
  getProfileRecepcionistaByUsuarioId,
  getProfileAdministradorByUsuarioId,
} from "../api/perfilApi";

export function useUserProfile() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    enabled: !!user,
    queryKey: ["user-profile", user?.usuarioId, user?.rol],
    queryFn: async () => {
      if (!user) return null;

      switch (user.rol) {
        case "PACIENTE": {
          const paciente = await getProfilePacienteByUsuarioId(user.usuarioId);
          return { ...paciente, perfilId: paciente.id, perfilTipo: "PACIENTE" };
        }

        case "MEDICO": {
          const medico = await getProfileMedicoByUsuarioId(user.usuarioId);
          return { ...medico, perfilId: medico.id, perfilTipo: "MEDICO" };
        }

        case "RECEPCIONISTA": {
          const recepcionista = await getProfileRecepcionistaByUsuarioId(
            user.usuarioId
          );
          return {
            ...recepcionista,
            perfilId: recepcionista.id,
            perfilTipo: "RECEPCIONISTA",
          };
        }

        case "ADMINISTRADOR": {
          const admin = await getProfileAdministradorByUsuarioId(
            user.usuarioId
          );
          return { ...admin, perfilId: admin.id, perfilTipo: "ADMINISTRADOR" };
        }

        default:
          return null;
      }
    },
  });
}
