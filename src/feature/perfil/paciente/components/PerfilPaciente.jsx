import { useUserProfile } from "../../hooks/useUserProfile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  UserRound,
  PencilLine,
  Save,
  FlaskConical,
  Mail,
  Calendar,
  Flag,
  MapPin,
  Syringe,
  Info,
  Phone,
} from "lucide-react";

// Textos tooltip
const descripciones = {
  nombres: "Nombre completo del paciente.",
  apellidos: "Apellido completo del paciente.",
  correo: "Correo electrónico de contacto.",
  fechaNacimiento: "Fecha de nacimiento del paciente.",
  sexo: "Sexo registrado del paciente.",
  nacionalidad: "País de origen.",
  direccion: "Dirección de residencia.",
  grupoSanguineo: "Tipo de sangre.",
  documento: "Tipo y número de documento.",
  telefono: "Teléfono de contacto.",
};

const obtenerColorEtiqueta = (campoId) => {
  const colores = {
    correo: "bg-blue-100 text-blue-600",
    sexo: "bg-pink-100 text-pink-600",
    nacionalidad: "bg-yellow-100 text-yellow-600",
    grupoSanguineo: "bg-red-100 text-red-600",
    telefono: "bg-green-100 text-green-600",
  };
  return colores[campoId] || "bg-gray-100 text-gray-600";
};

const renderizarEtiquetaConTooltip = ({ id, icono, etiqueta }) => (
  <div className="flex items-center gap-2">
    <div
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${obtenerColorEtiqueta(
        id
      )}`}
    >
      {icono}
      <span>{etiqueta}</span>
    </div>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs">
          {descripciones[id]}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

const formatearGrupoSanguineo = (valor) => {
  if (!valor) return "";
  return valor
    .replace("POSITIVO", "+")
    .replace("NEGATIVO", "-")
    .replace("_", " ");
};

const campos = {
  personales: [
    {
      id: "nombres",
      etiqueta: "Nombres",
      icono: <UserRound className="w-3.5 h-3.5" />,
      editable: false,
    },
    {
      id: "apellidos",
      etiqueta: "Apellidos",
      icono: <UserRound className="w-3.5 h-3.5" />,
      editable: false,
    },
    {
      id: "correo",
      etiqueta: "Correo",
      icono: <Mail className="w-3.5 h-3.5" />,
      editable: false,
    },
    {
      id: "fechaNacimiento",
      etiqueta: "Fecha de nacimiento",
      icono: <Calendar className="w-3.5 h-3.5" />,
      editable: false,
    },
    {
      id: "sexo",
      etiqueta: "Sexo",
      icono: <UserRound className="w-3.5 h-3.5" />,
      editable: false,
    },
    {
      id: "nacionalidad",
      etiqueta: "Nacionalidad",
      icono: <Flag className="w-3.5 h-3.5" />,
      editable: false,
    },
    {
      id: "documento",
      etiqueta: "Documento",
      icono: <UserRound className="w-3.5 h-3.5" />,
      editable: false,
    },
    {
      id: "telefono",
      etiqueta: "Teléfono",
      icono: <Phone className="w-3.5 h-3.5" />,
      editable: false,
    },
    {
      id: "direccion",
      etiqueta: "Dirección",
      icono: <MapPin className="w-3.5 h-3.5" />,
      editable: false,
    },
  ],
  medicos: [
    {
      id: "grupoSanguineo",
      etiqueta: "Tipo de sangre",
      icono: <Syringe className="w-3.5 h-3.5" />,
      editable: false,
    },
  ],
};

export default function PerfilPaciente() {
  const { data: perfil, isLoading, error } = useUserProfile();

  if (isLoading) return <p className="text-center py-10">Cargando perfil...</p>;
  if (error || !perfil)
    return (
      <p className="text-center text-red-500 py-10">
        No se pudo cargar el perfil.
      </p>
    );

  // Obtenemos datos de la respuesta (como en tu ejemplo real)
  const camposLocal = {
    nombres: perfil.nombres,
    apellidos: perfil.apellidos,
    correo: perfil.usuario?.correo || "",
    fechaNacimiento: perfil.fechaNacimiento,
    sexo: perfil.sexo,
    nacionalidad: perfil.nacionalidad,
    documento: `${perfil.tipoDocumento?.nombre ?? "DNI"} - ${
      perfil.numeroIdentificacion
    }`,
    telefono: perfil.telefono,
    direccion: perfil.direccion,
    grupoSanguineo: perfil.tipoSangre, // ajusta si el campo se llama distinto
  };

  // Iniciales para el avatar
  const getIniciales = () => {
    return (
      (camposLocal.nombres?.[0] ?? "") + (camposLocal.apellidos?.[0] ?? "")
    ).toUpperCase();
  };

  return (
    <main className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Perfil del Paciente</h1>
      <header className="flex flex-col sm:flex-row items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="h-full w-full rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center">
            {getIniciales()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-semibold">
            {camposLocal.nombres} {camposLocal.apellidos}
          </h2>
          <p className="text-sm text-muted-foreground">Paciente registrado</p>
          <p className="text-sm text-muted-foreground">
            {camposLocal.correo} | {camposLocal.documento}
          </p>
        </div>
      </header>
      <section>
        <Tabs defaultValue="personales" className="w-full">
          <TabsList className="flex w-max gap-2 mb-4">
            <TabsTrigger
              value="personales"
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <UserRound className="h-4 w-4 text-muted-foreground" /> Datos
              personales
            </TabsTrigger>
            <TabsTrigger
              value="medicos"
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <FlaskConical className="h-4 w-4 text-muted-foreground" />{" "}
              Información médica
            </TabsTrigger>
          </TabsList>
          <TabsContent value="personales">
            <article className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              {campos.personales.map((campo) => (
                <div key={campo.id} className="space-y-2">
                  {renderizarEtiquetaConTooltip(campo)}
                  <Input
                    id={campo.id}
                    type="text"
                    value={camposLocal[campo.id] || ""}
                    readOnly
                    className="text-sm"
                  />
                </div>
              ))}
            </article>
          </TabsContent>
          <TabsContent value="medicos">
            <article className="grid md:grid-cols-2 gap-6">
              {/* Grupo sanguíneo */}
              <div className="space-y-2">
                {renderizarEtiquetaConTooltip({
                  id: "grupoSanguineo",
                  icono: <Syringe className="w-3.5 h-3.5" />,
                  etiqueta: "Tipo de sangre",
                })}
                <Input
                  value={formatearGrupoSanguineo(camposLocal.grupoSanguineo)}
                  readOnly
                  className="text-sm bg-white shadow-sm rounded-md"
                />
              </div>

              {/* Alergias (puedes quitar el comentario y adaptar si tienes el dato) */}
              {/* <div className="space-y-2">
      {renderizarEtiquetaConTooltip({
        id: "alergias",
        icono: <FlaskConical className="w-3.5 h-3.5" />,
        etiqueta: "Alergias",
      })}
      <Input
        value={
          (camposLocal.alergias && camposLocal.alergias.length > 0)
            ? camposLocal.alergias.join(", ")
            : "Sin alergias registradas"
        }
        readOnly
        className="text-sm bg-white shadow-sm rounded-md"
      />
    </div> */}
            </article>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
