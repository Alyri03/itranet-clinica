import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import loginImg from "@/assets/login.png"; // tu imagen importada

export function LoginForm({ onSubmit, loading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit({ email, password });
  };

  return (
    <section className="flex h-screen w-full bg-white">
      {/* Ilustración izquierda */}
      <div className="hidden md:flex w-1/2 h-full items-center justify-center bg-white">
        <div className="bg-[#e4e9f5] rounded-3xl w-[85%] h-[92%] flex items-end justify-center overflow-hidden">
          <img
            src={loginImg}
            alt="Login Illustration"
            className="w-[99%] object-contain mb-0"
          />
        </div>
      </div>

      {/* Formulario */}
      <div className="flex w-full md:w-1/2 h-full items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-6 px-6 md:px-10 lg:px-8 xl:px-6"
        >
          <h1 className="text-4xl font-bold text-center">Inicia sesión</h1>

          <div>
            <label htmlFor="email" className="font-semibold mb-2 block">
              Correo electrónico
            </label>
            <input
              id="email"
              required
              type="email"
              name="email"
              placeholder="ejemplo@correo.com"
              className="w-full border border-gray-300 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F71A1]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="font-semibold mb-2 block">
              Contraseña
            </label>
            <input
              id="password"
              required
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Tu contraseña"
              className="w-full border border-gray-300 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F71A1] pr-10" // <-- agrega pr-10 para que no tape el icono
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-0 bottom-0 my-auto h-6 flex items-center focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}
              style={{ height: "100%" }}
            >
              {showPassword ? (
                <EyeOff size={20} className="mt-7 text-gray-400" />
              ) : (
                <Eye size={20} className="mt-7 text-gray-400" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2F71A1] text-white py-2 rounded-full font-semibold hover:bg-[#1B4F73] transition"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <hr />

          <p className="text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link to="/registro" className="text-[#2F71A1] font-semibold">
              Regístrate aquí
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
