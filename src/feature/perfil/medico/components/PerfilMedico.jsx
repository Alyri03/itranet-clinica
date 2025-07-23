import { useUserProfile } from "../../hooks/useUserProfile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  UserRound,
  Mail,
  IdCard,
  Phone,
  MapPin,
  BookOpen,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";

export default function PerfilMedico() {
  const { data: perfil, isLoading } = useUserProfile();

  if (isLoading) return <p className="text-center py-10">Cargando perfil...</p>;
  if (!perfil)
    return (
      <p className="text-center py-10 text-red-500">
        No se pudo cargar el perfil.
      </p>
    );

  // Iniciales del médico
  const initials = (perfil.nombres?.[0] ?? "") + (perfil.apellidos?.[0] ?? "");

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="flex flex-col sm:flex-row items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="bg-purple-700 text-white text-2xl font-bold flex items-center justify-center">
            {initials.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <div className="font-bold text-lg">
            {perfil.nombres} {perfil.apellidos}
          </div>
          <div className="text-sm text-muted-foreground">Médico registrado</div>
          <div className="text-sm text-muted-foreground">
            {perfil.usuario?.correo || perfil.correo || "Sin correo"} |{" "}
            {perfil.numeroDocumento}
          </div>
        </div>
      </header>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          {/* Nombres */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UserRound className="w-4 h-4 text-muted-foreground" />
              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                Nombres
              </Badge>
            </div>
            <Input value={perfil.nombres || ""} readOnly />
          </div>

          {/* Apellidos */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UserRound className="w-4 h-4 text-muted-foreground" />
              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                Apellidos
              </Badge>
            </div>
            <Input value={perfil.apellidos || ""} readOnly />
          </div>

          {/* Correo */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-blue-600" />
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                Correo
              </Badge>
            </div>
            <Input
              value={perfil.usuario?.correo || perfil.correo || ""}
              readOnly
            />
          </div>

          {/* Número de colegiatura */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <Badge variant="outline" className="bg-green-100 text-green-700">
                N° Colegiatura
              </Badge>
            </div>
            <Input value={perfil.numeroColegiatura || ""} readOnly />
          </div>

          {/* Número RNE */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <Badge
                variant="outline"
                className="bg-indigo-100 text-indigo-700"
              >
                N° RNE
              </Badge>
            </div>
            <Input value={perfil.numeroRNE || "No aplica"} readOnly />
          </div>

          {/* Tipo de documento */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <IdCard className="w-4 h-4 text-gray-600" />
              <Badge variant="outline" className="bg-gray-200 text-gray-700">
                Tipo de documento
              </Badge>
            </div>
            <Input value="Documento Nacional de Identidad" readOnly />
          </div>

          {/* Número de documento */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <IdCard className="w-4 h-4 text-gray-600" />
              <Badge variant="outline" className="bg-gray-200 text-gray-700">
                DNI
              </Badge>
            </div>
            <Input value={perfil.numeroDocumento || ""} readOnly />
          </div>

          {/* Teléfono */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Phone className="w-4 h-4 text-green-500" />
              <Badge variant="outline" className="bg-green-100 text-green-700">
                Teléfono
              </Badge>
            </div>
            <Input value={perfil.telefono || ""} readOnly />
          </div>

          {/* Dirección */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-pink-500" />
              <Badge variant="outline" className="bg-pink-100 text-pink-700">
                Dirección
              </Badge>
            </div>
            <Input value={perfil.direccion || ""} readOnly />
          </div>

          {/* Fecha de contratación */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarCheck className="w-4 h-4 text-purple-500" />
              <Badge
                variant="outline"
                className="bg-purple-100 text-purple-700"
              >
                Fecha de contratación
              </Badge>
            </div>
            <Input value={perfil.fechaContratacion || ""} readOnly />
          </div>
        </div>
      </section>
    </main>
  );
}
