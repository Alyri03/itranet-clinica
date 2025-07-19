import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useTiposDocumento } from "../../pacientes/hooks/useTiposDocumento";
import { Eye, EyeOff } from "lucide-react";
import { useVerificarDocumento } from "../hooks/useVerificarDocumento";
import { useEnviarCodigo } from "../hooks/useEnviarCodigo";
import { useVerificarCodigo } from "../hooks/useVerificarCodigo";
import { useCompletarRegistro } from "../hooks/useCompletarRegistro";
import { toast } from "sonner";

export default function RegistroPorRecepcion() {
  const navigate = useNavigate();
  const { data: tiposDocumento = [], isLoading } = useTiposDocumento();
  const [step, setStep] = useState("verify-document");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    documentType: "DNI",
    documentTypeId: 1,
    documentNumber: "",
    email: "",
    password: "",
  });

  const verificarDocumento = useVerificarDocumento({
    onSuccess: (data) => {
      if (data.exists) {
        setStep("email-input");
        toast.success("Documento verificado exitosamente");
      } else {
        setError("Documento no encontrado. Usa el formulario completo.");
        toast.error("Documento no encontrado");
      }
    },
    onError: () => {
      setError("Error al verificar documento.");
      toast.error("Error al verificar documento");
    },
  });

  const enviarCodigo = useEnviarCodigo({
    onSuccess: () => {
      setStep("code-input");
      toast.success("Código enviado al correo");
    },
    onError: () => {
      setError("Error al enviar el código.");
      toast.error("Error al enviar el código");
    },
  });

  const verificarCodigo = useVerificarCodigo({
    onSuccess: () => {
      setStep("password");
      toast.success("Código verificado correctamente");
    },
    onError: () => {
      setError("Código incorrecto o expirado.");
      toast.error("Código inválido o expirado");
    },
  });

  const completarRegistro = useCompletarRegistro({
    onSuccess: () => {
      toast.success("Registro completado exitosamente");
      navigate("/login");
    },
    onError: () => {
      setError("Error al completar el registro.");
      toast.error("Error al completar el registro");
    },
  });

  const handleCodeChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen px-4 bg-white">
      <div className="w-full max-w-md space-y-6">
        <Link to="/login" className="text-sm text-gray-500 underline">
          Volver al login
        </Link>
        <h1 className="text-3xl font-bold text-center">
          Registro de paciente (datos iniciales)
        </h1>
        {error && <p className="text-red-600 text-center text-sm">{error}</p>}

        {step === "verify-document" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verificarDocumento.mutate({
                tipoDocumento: {
                  id: formData.documentTypeId,
                  nombre: formData.documentType,
                },
                documento: formData.documentNumber,
              });
            }}
            className="space-y-4"
          >
            <div className="flex gap-4">
              <Select
                value={formData.documentType}
                onValueChange={(val) => {
                  const selected = tiposDocumento.find((d) => d.nombre === val);
                  setFormData((prev) => ({
                    ...prev,
                    documentType: val,
                    documentTypeId: selected?.id || 1,
                  }));
                }}
              >
                <SelectTrigger className="w-1/3">
                  {formData.documentType}
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem disabled>Cargando...</SelectItem>
                  ) : (
                    tiposDocumento.map((doc) => (
                      <SelectItem key={doc.id} value={doc.nombre}>
                        {doc.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="N. Documento"
                value={formData.documentNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    documentNumber: e.target.value,
                  }))
                }
                required
              />
            </div>
            <Button
              className="w-full"
              type="submit"
              disabled={verificarDocumento.isPending}
            >
              {verificarDocumento.isPending
                ? "Verificando..."
                : "Verificar documento"}
            </Button>
          </form>
        )}

        {step === "email-input" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviarCodigo.mutate({
                documento: formData.documentNumber,
                email: formData.email,
              });
            }}
            className="space-y-4"
          >
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
            <Button
              type="submit"
              className="w-full"
              disabled={enviarCodigo.isPending}
            >
              {enviarCodigo.isPending ? "Enviando..." : "Enviar código"}
            </Button>
          </form>
        )}

        {step === "code-input" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verificarCodigo.mutate({
                email: formData.email,
                code: otp.join(""),
              });
            }}
            className="space-y-4"
          >
            <div className="flex justify-center gap-2">
              {otp.map((digit, i) => (
                <Input
                  key={i}
                  id={`otp-${i}`}
                  maxLength={1}
                  className="w-10 text-center"
                  value={digit}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                />
              ))}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={verificarCodigo.isPending}
            >
              {verificarCodigo.isPending
                ? "Verificando..."
                : "Verificar código"}
            </Button>
          </form>
        )}

        {step === "password" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              completarRegistro.mutate({
                documento: formData.documentNumber,
                email: formData.email,
                password: formData.password,
              });
            }}
            className="space-y-4"
          >
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={completarRegistro.isPending}
            >
              {completarRegistro.isPending
                ? "Registrando..."
                : "Finalizar registro"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
