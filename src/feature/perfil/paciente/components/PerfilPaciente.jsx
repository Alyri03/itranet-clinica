import { useUserProfile } from "../../hooks/useUserProfile";
import AlergiasPacienteSection from "./AlergiasPacienteSection";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserRound, FlaskConical, Mail, Calendar, Flag, MapPin, Syringe, Phone } from "lucide-react";
import CampoConTooltip from "./CampoConTooltip";

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

const campos = {
  personales: [
    { id: "nombres", etiqueta: "Nombres", icono: <UserRound className="w-3.5 h-3.5" /> },
    { id: "apellidos", etiqueta: "Apellidos", icono: <UserRound className="w-3.5 h-3.5" /> },
    { id: "correo", etiqueta: "Correo", icono: <Mail className="w-3.5 h-3.5" /> },
    { id: "fechaNacimiento", etiqueta: "Fecha de nacimiento", icono: <Calendar className="w-3.5 h-3.5" /> },
    { id: "sexo", etiqueta: "Sexo", icono: <UserRound className="w-3.5 h-3.5" /> },
    { id: "nacionalidad", etiqueta: "Nacionalidad", icono: <Flag className="w-3.5 h-3.5" /> },
    { id: "documento", etiqueta: "Documento", icono: <UserRound className="w-3.5 h-3.5" /> },
    { id: "telefono", etiqueta: "Teléfono", icono: <Phone className="w-3.5 h-3.5" /> },
    { id: "direccion", etiqueta: "Dirección", icono: <MapPin className="w-3.5 h-3.5" /> },
  ],
  medicos: [
    { id: "grupoSanguineo", etiqueta: "Tipo de sangre", icono: <Syringe className="w-3.5 h-3.5" /> },
  ],
};

const formatearGrupoSanguineo = (valor) => {
  if (!valor) return "";
  return valor
    .replace("POSITIVO", "+")
    .replace("NEGATIVO", "-")
    .replace("_", " ");
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

  const camposLocal = {
    nombres: perfil.nombres,
    apellidos: perfil.apellidos,
    correo: perfil.usuario?.correo || "",
    fechaNacimiento: perfil.fechaNacimiento,
    sexo: perfil.sexo,
    nacionalidad: perfil.nacionalidad,
    documento: `${perfil.tipoDocumento?.nombre ?? "DNI"} - ${perfil.numeroIdentificacion}`,
    telefono: perfil.telefono,
    direccion: perfil.direccion,
    grupoSanguineo: perfil.tipoSangre,
  };

  const getIniciales = () =>
    (
      (camposLocal.nombres?.[0] ?? "") + (camposLocal.apellidos?.[0] ?? "")
    ).toUpperCase();

  return (
    <main className="p-6 space-y-6 max-w-5xl mx-auto">
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
              <UserRound className="h-4 w-4 text-muted-foreground" /> Datos personales
            </TabsTrigger>
            <TabsTrigger
              value="medicos"
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <FlaskConical className="h-4 w-4 text-muted-foreground" /> Información médica
            </TabsTrigger>
          </TabsList>
          <TabsContent value="personales">
            <article className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              {campos.personales.map((campo) => (
                <CampoConTooltip
                  key={campo.id}
                  id={campo.id}
                  icono={campo.icono}
                  etiqueta={campo.etiqueta}
                  descripcion={descripciones[campo.id]}
                  valor={camposLocal[campo.id]}
                />
              ))}
            </article>
          </TabsContent>
          <TabsContent value="medicos">
            <article className="max-w-xl space-y-6">
              <CampoConTooltip
                id="grupoSanguineo"
                icono={<Syringe className="w-3.5 h-3.5" />}
                etiqueta="Tipo de sangre"
                descripcion={descripciones["grupoSanguineo"]}
                valor={formatearGrupoSanguineo(camposLocal.grupoSanguineo)}
              />
              <AlergiasPacienteSection pacienteId={perfil.id} />
            </article>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
