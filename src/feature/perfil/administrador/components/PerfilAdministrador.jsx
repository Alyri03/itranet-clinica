import { useUserProfile } from "../../hooks/useUserProfile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  UserRound, Calendar, MapPin, IdCard, Phone, Info,
} from "lucide-react";

// Descripciones para tooltips
const descripciones = {
  nombres: "Nombres completos del administrador.",
  apellidos: "Apellidos del administrador.",
  numeroDocumento: "Número de documento del administrador.",
  tipoDocumento: "Tipo de documento de identidad.",
  telefono: "Número de teléfono personal.",
  direccion: "Dirección actual.",
  fechaContratacion: "Fecha en que fue contratado.",
};

const obtenerColorEtiqueta = (campoId) => {
  const colores = {
    telefono: "bg-green-100 text-green-600",
    fechaContratacion: "bg-purple-100 text-purple-600",
    tipoDocumento: "bg-gray-100 text-gray-600",
    numeroDocumento: "bg-gray-100 text-gray-600",
  };
  return colores[campoId] || "bg-gray-100 text-gray-600";
};

const renderizarEtiquetaConTooltip = ({ id, icono, etiqueta }) => (
  <div className="flex items-center gap-2">
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${obtenerColorEtiqueta(id)}`}>
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

// Campos que vamos a mostrar en el perfil del administrador
const campos = [
  { id: "nombres", etiqueta: "Nombres", icono: <UserRound className="w-3.5 h-3.5" /> },
  { id: "apellidos", etiqueta: "Apellidos", icono: <UserRound className="w-3.5 h-3.5" /> },
  { id: "tipoDocumento", etiqueta: "Tipo de documento", icono: <IdCard className="w-3.5 h-3.5" /> },
  { id: "numeroDocumento", etiqueta: "Número de documento", icono: <IdCard className="w-3.5 h-3.5" /> },
  { id: "telefono", etiqueta: "Teléfono", icono: <Phone className="w-3.5 h-3.5" /> },
  { id: "direccion", etiqueta: "Dirección", icono: <MapPin className="w-3.5 h-3.5" /> },
  { id: "fechaContratacion", etiqueta: "Fecha de contratación", icono: <Calendar className="w-3.5 h-3.5" /> },
];

export default function PerfilAdministrador() {
  const { data: perfil, isLoading, error } = useUserProfile();

  if (isLoading) return <p className="text-center py-10">Cargando perfil...</p>;
  if (error || !perfil) return <p className="text-center text-red-500 py-10">No se pudo cargar el perfil.</p>;

  // Fijo: asume que el tipoDocumentoId=2 es DNI, si tienes una lista mejor, puedes mapearlo dinámicamente
  const tipoDocumentoLabel = "Documento Nacional de Identidad";

  const camposLocal = {
    nombres: perfil.nombres,
    apellidos: perfil.apellidos,
    tipoDocumento: tipoDocumentoLabel,
    numeroDocumento: perfil.numeroDocumento,
    telefono: perfil.telefono,
    direccion: perfil.direccion,
    fechaContratacion: perfil.fechaContratacion,
  };

  // Iniciales para avatar
  const getIniciales = () =>
    `${camposLocal.nombres?.[0] ?? ""}${camposLocal.apellidos?.[0] ?? ""}`.toUpperCase();

  return (
    <main className="p-6 space-y-6 max-w-2xl mx-auto">
      <header className="flex flex-col sm:flex-row items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="h-full w-full rounded-full bg-orange-400 text-white text-xl font-bold flex items-center justify-center">
            {getIniciales()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-semibold">
            {camposLocal.nombres} {camposLocal.apellidos}
          </h2>
          <p className="text-sm text-muted-foreground">Administrador registrado</p>
          <p className="text-sm text-muted-foreground">
            {camposLocal.tipoDocumento} {camposLocal.numeroDocumento}
          </p>
        </div>
      </header>
      <section>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="flex w-max gap-2 mb-4">
            <TabsTrigger value="info" className="flex items-center gap-2 whitespace-nowrap">
              <UserRound className="h-4 w-4 text-muted-foreground" /> Datos de perfil
            </TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <article className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              {campos.map((campo) => (
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
        </Tabs>
      </section>
    </main>
  );
}
