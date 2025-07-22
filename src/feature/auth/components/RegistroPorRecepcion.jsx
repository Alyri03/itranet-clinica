import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useEnviarCodigo } from "../hooks/useEnviarCodigo";
import { useVerificarCodigo } from "../hooks/useVerificarCodigo";
import { useCompletarRegistro } from "../hooks/useCompletarRegistro";
import { toast } from "sonner";

export default function RegistroPorRecepcion({ initialData }) {
  const navigate = useNavigate();

  // Multi fallback para los nombres posibles de campos
  const documentNumber =
    initialData?.numeroDocumento ||
    initialData?.documentNumber ||
    initialData?.documento ||
    initialData?.numero_documento ||
    "";

  const documentType =
    initialData?.tipoDocumentoNombre ||
    initialData?.documentType ||
    initialData?.tipo_documento_nombre ||
    "DNI";

  const [formData, setFormData] = useState({
    documentType,
    documentNumber,
    email: "",
    password: "",
  });

  const [step, setStep] = useState("email-input");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);

  const enviarCodigo = useEnviarCodigo({
    onSuccess: () => {
      setStep("code-input");
      toast.success("Código enviado al correo");
    },
    onError: () => {
      toast.error("Error al enviar el código");
    },
  });

  const verificarCodigo = useVerificarCodigo({
    onSuccess: () => {
      setStep("password");
      toast.success("Código verificado correctamente");
    },
    onError: () => {
      toast.error("Código inválido o expirado");
    },
  });

  const completarRegistro = useCompletarRegistro({
    onSuccess: () => {
      toast.success("Registro completado exitosamente");
      navigate("/login");
    },
    onError: () => {
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
        <h1 className="text-3xl font-bold text-center mb-3">
          Registro de paciente (datos iniciales)
        </h1>

        {/* Paso 1: Email, mostrando documento y tipo bloqueados */}
        {step === "email-input" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviarCodigo.mutate({
                documento: documentNumber,
                email: formData.email,
              });
            }}
            className="space-y-4"
          >
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de documento
                </label>
                <Input
                  value={documentType}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  N° Documento
                </label>
                <Input
                  value={documentNumber}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={enviarCodigo.isPending}
            >
              {enviarCodigo.isPending ? "Enviando..." : "Enviar código"}
            </Button>
          </form>
        )}

        {/* Paso 2: Código */}
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

        {/* Paso 3: Contraseña + Resumen */}
        {step === "password" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              completarRegistro.mutate({
                documento: documentNumber,
                email: formData.email,
                password: formData.password,
              });
            }}
            className="space-y-4"
          >
            {/* Mostrar el resumen de datos arriba */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de documento
                </label>
                <Input
                  value={documentType}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  N° Documento
                </label>
                <Input
                  value={documentNumber}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <Input
                value={formData.email}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            {/* Contraseña */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
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
