import { LoginForm } from "./components/LoginForm";
import { useLogin } from "./hooks/useLogin";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const loginStore = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const { mutate, isLoading } = useLogin({
    onSuccess: (data) => {
      console.log("DATA DESDE BACKEND:", data);
      loginStore(data, "");
      toast.success("¡Bienvenido!");
      switch (data.role) {
        case "PACIENTE":
          navigate("/main");
          break;
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
          navigate("/main");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Credenciales incorrectas. Intenta de nuevo."
      );
    },
  });

  const handleLogin = ({ email, password }) => {
    mutate({ correo: email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white dark:bg-zinc-900">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        <LoginForm onSubmit={handleLogin} loading={isLoading} />
      </div>
    </div>
  );
}
