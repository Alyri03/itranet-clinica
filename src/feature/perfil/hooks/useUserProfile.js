// hooks/useUserProfile.js
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
    queryKey: ["user-profile", user?.usuarioId, user?.role],
    queryFn: async () => {
      if (!user) return null;
      if (user.role === "PACIENTE")
        return getProfilePacienteByUsuarioId(user.usuarioId);
      if (user.role === "MEDICO")
        return getProfileMedicoByUsuarioId(user.usuarioId);
      return null;
    },
  });
}
