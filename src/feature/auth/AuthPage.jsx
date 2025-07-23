import { LoginForm } from "./components/LoginForm";
import { useLogin } from "./hooks/useLogin";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  getProfilePacienteByUsuarioId,
  getProfileMedicoByUsuarioId,
  getProfileRecepcionistaByUsuarioId,
  getProfileAdministradorByUsuarioId,
} from "../perfil/api/perfilApi";

import RegisterPage from "./components/RegisterPage";

export default function AuthPage() {
  const loginStore = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const { mutate, isLoading } = useLogin({
    onSuccess: async (data) => {
      console.log("[LOGIN SUCCESS] data recibida:", data);

      if (!data?.usuarioId || !data?.role) {
        console.warn("[LOGIN WARNING] Datos incompletos:", data);
        toast.error("Respuesta de login inválida. Consulta al administrador.");
        return;
      }

      const adaptedRole =
        {
          ADMIN: "ADMINISTRADOR",
          PACIENTE: "PACIENTE",
          MEDICO: "MEDICO",
          RECEPCIONISTA: "RECEPCIONISTA",
        }[data.role] || data.role;

      const adaptedUser = {
        usuarioId: data.usuarioId,
        rol: adaptedRole,
      };

      // IDs de perfiles según rol
      let pacienteId = null;
      let medicoId = null;
      let recepcionistaId = null;
      let adminId = null;
      let profile = null;

      try {
        switch (adaptedUser.rol) {
          case "PACIENTE":
            profile = await getProfilePacienteByUsuarioId(
              adaptedUser.usuarioId
            );
            pacienteId = profile?.id ?? null;
            console.log("Perfil PACIENTE:", profile);
            break;

          case "MEDICO":
            profile = await getProfileMedicoByUsuarioId(adaptedUser.usuarioId);
            medicoId = profile?.id ?? null;
            console.log("Perfil MÉDICO:", profile);
            break;

          case "RECEPCIONISTA":
            profile = await getProfileRecepcionistaByUsuarioId(
              adaptedUser.usuarioId
            );
            recepcionistaId = profile?.id ?? null;
            console.log("Perfil RECEPCIONISTA:", profile);
            break;

          case "ADMINISTRADOR":
            profile = await getProfileAdministradorByUsuarioId(
              adaptedUser.usuarioId
            );
            adminId = profile?.id ?? null;
            console.log("Perfil ADMINISTRADOR:", profile);
            break;
        }
      } catch (error) {
        console.error("Error al obtener perfil:", error);
        toast.error("Error al obtener perfil: " + error.message);
      }

      loginStore(adaptedUser, {
        pacienteId,
        medicoId,
        recepcionistaId,
        adminId,
      });

      console.log(
        "Estado de store después de login:",
        useAuthStore.getState()
      );

      toast.dismiss();
      toast.success("¡Bienvenido!");

      // Redirige según rol
      switch (adaptedUser.rol) {
        case "PACIENTE":
        case "MEDICO":
          navigate("/main");
          break;
        case "RECEPCIONISTA":
          navigate("/citas");
          break;
        case "ADMINISTRADOR":
          navigate("/dashboard");
          break;
        default:
          console.warn("Rol desconocido, redirigiendo a /main");
          navigate("/main");
      }
    },
    onError: (error) => {
      toast.dismiss();
      console.error("[LOGIN ERROR]", error);
      toast.error(
        error?.response?.data?.message ||
          "Credenciales incorrectas. Intenta de nuevo."
      );
    },
  });

  const handleLogin = ({ email, password }) => {
    console.log("🔐 Enviando login con:", email);
    mutate({ correo: email, password });
  };

  return <LoginForm onSubmit={handleLogin} loading={isLoading} />;
}
