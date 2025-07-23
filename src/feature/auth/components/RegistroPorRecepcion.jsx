import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useEnviarCodigo } from "../hooks/useEnviarCodigo";
import { useVerificarCodigo } from "../hooks/useVerificarCodigo";
import { useCompletarRegistro } from "../hooks/useCompletarRegistro";

export default function RegistroPorRecepcion({ initialData }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("correo");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [correoVerificado, setCorreoVerificado] = useState("");

  const tipoDocumentoNombre =
    initialData?.tipoDocumentoNombre || initialData?.documentType || "DNI";
  const numeroDocumento =
    initialData?.numeroDocumento || initialData?.documentNumber || "";

  // Enviar código
  const { mutate: enviarCodigo, isPending: enviando } = useEnviarCodigo({
    onSuccess: () => {
      toast.success("Código enviado a tu correo");
      setCorreoVerificado(email);
      setStep("otp");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Error al enviar el código");
    },
  });

  // Verificar código
  const { mutate: verificarCodigo, isPending: verificando } =
    useVerificarCodigo({
      onSuccess: () => {
        toast.success("Código verificado");
        setStep("password");
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Código incorrecto");
      },
    });

  // Completar registro
  const { mutate: completarRegistro, isPending: completando } =
    useCompletarRegistro({
      onSuccess: () => {
        toast.success("Registro completado. Ya puedes iniciar sesión.");
        navigate("/login");
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message || "Error al crear la contraseña"
        );
      },
    });

  // Handlers
  const handleEnviarCodigo = (e) => {
    e.preventDefault();
    enviarCodigo({
      email,
      documento: numeroDocumento,
    });
  };

  const handleVerificarCodigo = (e) => {
    e.preventDefault();
    verificarCodigo({
      email: correoVerificado,
      code: codigo,
    });
  };

  const handleCompletarRegistro = (e) => {
    e.preventDefault();
    completarRegistro({
      password,
      email: correoVerificado,
      documento: numeroDocumento,
    });
  };

  return (
    <section className="flex items-center justify-center min-h-screen px-4 bg-white">
      <div className="w-full max-w-md flex flex-col">
        {/* Flecha arriba a la izquierda */}
        <div className="mb-2">
          <Link to="/login" className="inline-flex items-center gap-2 text-gray-700 hover:underline">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al login</span>
          </Link>
        </div>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-center">Completa tu registro</h1>
          {/* Tipo de documento y documento (bloqueados, siempre arriba) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tipo de documento
              </label>
              <Input
                value={tipoDocumentoNombre}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                N° Documento
              </label>
              <Input
                value={numeroDocumento}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
          {/* Paso 1: Correo */}
          {step === "correo" && (
            <form className="space-y-3" onSubmit={handleEnviarCodigo}>
              <label className="block text-sm font-medium mb-1">
                Correo electrónico
              </label>
              <Input
                type="email"
                value={email}
                placeholder="Tu correo"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={enviando}>
                {enviando ? "Enviando código..." : "Enviar código"}
              </Button>
            </form>
          )}

          {/* Paso 2: OTP */}
          {step === "otp" && (
            <form className="space-y-3" onSubmit={handleVerificarCodigo}>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Correo electrónico
                </label>
                <Input
                  value={correoVerificado}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <label className="block text-sm font-medium mb-1">
                Código de verificación (6 dígitos)
              </label>
              <Input
                type="text"
                value={codigo}
                maxLength={6}
                minLength={6}
                pattern="\d{6}"
                inputMode="numeric"
                placeholder="Ingresa el código"
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
                required
              />
              <Button type="submit" className="w-full" disabled={verificando}>
                {verificando ? "Verificando..." : "Verificar código"}
              </Button>
            </form>
          )}

          {/* Paso 3: Contraseña */}
          {step === "password" && (
            <form className="space-y-3" onSubmit={handleCompletarRegistro}>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Correo electrónico
                </label>
                <Input
                  value={correoVerificado}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <label className="block text-sm font-medium mb-1">
                Crea tu contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Nueva contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <Button className="w-full" type="submit" disabled={completando}>
                {completando ? "Registrando..." : "Completar registro"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
