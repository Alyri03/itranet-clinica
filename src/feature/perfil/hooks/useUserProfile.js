import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/useAuthStore";
import {
  getProfilePacienteByUsuarioId,
  getProfileMedicoByUsuarioId,
} from "../api/perfilApi";

export function useUserProfile() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    enabled: !!user,
    queryKey: ["user-profile", user?.usuarioId, user?.rol],
    queryFn: async () => {
      if (!user) return null;

      if (user.rol === "PACIENTE") {
        const paciente = await getProfilePacienteByUsuarioId(user.usuarioId);
        return { ...paciente, perfilId: paciente.id, perfilTipo: "PACIENTE" };
      }

      if (user.rol === "MEDICO") {
        const medico = await getProfileMedicoByUsuarioId(user.usuarioId);
        return { ...medico, perfilId: medico.id, perfilTipo: "MEDICO" };
      }

      return null;
    },
  });
}
