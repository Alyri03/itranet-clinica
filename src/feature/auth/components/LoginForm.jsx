import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function LoginForm({ onSubmit, loading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xs mx-auto">
      <div>
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <EyeOff size={18} className="text-muted-foreground" />
            ) : (
              <Eye size={18} className="text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}
