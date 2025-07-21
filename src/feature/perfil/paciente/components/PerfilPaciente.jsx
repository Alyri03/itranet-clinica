import { useState } from "react";
import { useUserProfile } from "../../hooks/useUserProfile";
import {
  usePacienteAlergiasByPacienteId,
  useCrearPacienteAlergia,
  useEliminarPacienteAlergia,
} from "../../hooks/usePacienteAlergia";
import { useAlergias } from "../../hooks/useAlergias";
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
  FlaskConical,
  Mail,
  Calendar,
  Flag,
  MapPin,
  Syringe,
  Info,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

// Gravedades
const GRAVEDADES = [
  { value: "LEVE", label: "Leve" },
  { value: "MODERADA", label: "Moderada" },
  { value: "SEVERA", label: "Severa" },
];

const TIPOS_ALERGIA = [
  { value: "ALIMENTARIA", label: "Alimentaria" },
  { value: "MEDICA", label: "Médica" },
  { value: "AMBIENTAL", label: "Ambiental" },
  { value: "OTRO", label: "Otro" },
];

// Tooltip descriptions
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

// ----------- COMPONENTE DE ALERGIAS -----------
function AlergiasPacienteSection({ pacienteId }) {
  const { data: alergiasPaciente = [], isLoading } = usePacienteAlergiasByPacienteId(pacienteId);
  const { data: catalogoAlergias = [], isLoading: loadingCat, refetch } = useAlergias();
  const crear = useCrearPacienteAlergia({
    onSuccess: () => {
      toast.success("Alergia agregada correctamente");
      refetch(); // Para actualizar el catálogo si es personalizada
    },
    onError: (e) => toast.error("Error al agregar alergia"),
  });
  const eliminar = useEliminarPacienteAlergia({
    onSuccess: () => toast.success("Alergia eliminada"),
    onError: () => toast.error("Error al eliminar"),
  });

  // Modal para agregar
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    alergiaId: "",
    gravedad: "",
  });
  const [esPersonalizada, setEsPersonalizada] = useState(false);
  const [nuevaAlergia, setNuevaAlergia] = useState({
    nombre: "",
    tipoAlergia: "",
  });
  const [loadingNuevaAlergia, setLoadingNuevaAlergia] = useState(false);

  const abrirAgregar = () => {
    setModalOpen(true);
    setForm({ alergiaId: "", gravedad: "" });
    setEsPersonalizada(false);
    setNuevaAlergia({ nombre: "", tipoAlergia: "" });
  };

  // Al seleccionar una alergia del select
  const handleChangeAlergia = (v) => {
    if (v === "personalizada") {
      setEsPersonalizada(true);
      setForm(f => ({ ...f, alergiaId: "" }));
    } else {
      setEsPersonalizada(false);
      setForm(f => ({ ...f, alergiaId: v }));
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    let alergiaObj = null;

    if (esPersonalizada) {
      if (!nuevaAlergia.nombre || !nuevaAlergia.tipoAlergia || !form.gravedad) {
        toast.error("Completa todos los campos de la alergia personalizada");
        return;
      }
      setLoadingNuevaAlergia(true);
      // Crear alergia personalizada en catálogo
      try {
        const response = await fetch("/api/alergias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nuevaAlergia.nombre,
            tipoAlergia: nuevaAlergia.tipoAlergia,
          }),
        });
        if (!response.ok) throw new Error();
        alergiaObj = await response.json();
      } catch {
        toast.error("No se pudo crear la alergia personalizada");
        setLoadingNuevaAlergia(false);
        return;
      }
      setLoadingNuevaAlergia(false);
    } else {
      if (!form.alergiaId || !form.gravedad) {
        toast.error("Completa todos los campos");
        return;
      }
      alergiaObj = catalogoAlergias.find(a => String(a.id) === form.alergiaId);
      if (!alergiaObj) {
        toast.error("Alergia no encontrada en el catálogo.");
        return;
      }
      // Evitar duplicados
      const yaExiste = alergiasPaciente.some(a => a.alergia.id === alergiaObj.id);
      if (yaExiste) {
        toast.error("Esta alergia ya está registrada para el paciente.");
        return;
      }
    }

    // Enviar la relación paciente-alergia
    crear.mutate({
      pacienteId,
      alergia: {
        id: alergiaObj.id,
        nombre: alergiaObj.nombre,
        tipoAlergia: alergiaObj.tipoAlergia,
      },
      gravedad: form.gravedad,
    });
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold flex gap-2 items-center">
          <FlaskConical className="w-4 h-4" /> Alergias
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={abrirAgregar}
          disabled={alergiasPaciente.length >= 2}
          className={alergiasPaciente.length >= 2 ? "opacity-60 cursor-not-allowed" : ""}
        >
          <Plus size={16} className="mr-1" />
          Agregar
        </Button>
      </div>
      <ul className="space-y-2">
        {isLoading && <li>Cargando...</li>}
        {!isLoading && alergiasPaciente.length === 0 && (
          <li className="text-sm text-muted-foreground">Sin alergias registradas</li>
        )}
        {alergiasPaciente.map((a) => (
          <li
            key={a.id}
            className="flex items-center gap-2 bg-blue-50/70 px-3 py-2 rounded-lg"
          >
            <span className="font-medium">{a.alergia.nombre}</span>
            <span className="ml-2 px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs">
              {a.alergia.tipoAlergia}
            </span>
            <span className={`ml-2 px-2 py-0.5 rounded text-xs 
              ${a.gravedad === "SEVERA"
                ? "bg-red-200 text-red-800"
                : a.gravedad === "MODERADA"
                ? "bg-orange-200 text-orange-700"
                : "bg-green-200 text-green-800"
              }
            `}>
              {GRAVEDADES.find(g => g.value === a.gravedad)?.label || a.gravedad}
            </span>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => eliminar.mutate(a.id)}
              className="ml-auto"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </Button>
          </li>
        ))}
      </ul>
      {/* Dialog para agregar */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar alergia</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleGuardar} className="space-y-3">
            {/* Select o personalizada */}
            {!esPersonalizada && (
              <Select
                value={form.alergiaId}
                onValueChange={handleChangeAlergia}
                required
                disabled={loadingCat}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una alergia..." />
                </SelectTrigger>
                <SelectContent>
                  {catalogoAlergias.map(a => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.nombre} ({a.tipoAlergia})
                    </SelectItem>
                  ))}
                  <SelectItem value="personalizada">Otra (especificar)</SelectItem>
                </SelectContent>
              </Select>
            )}
            {/* Personalizada: inputs */}
            {esPersonalizada && (
              <>
                <Input
                  value={nuevaAlergia.nombre}
                  onChange={e => setNuevaAlergia(f => ({ ...f, nombre: e.target.value }))}
                  placeholder="Nombre de la alergia"
                  required
                  maxLength={48}
                />
                <Select
                  value={nuevaAlergia.tipoAlergia}
                  onValueChange={v => setNuevaAlergia(f => ({ ...f, tipoAlergia: v }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de alergia" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_ALERGIA.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            {/* Gravedad */}
            <Select
              value={form.gravedad}
              onValueChange={v => setForm(f => ({ ...f, gravedad: v }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Gravedad" />
              </SelectTrigger>
              <SelectContent>
                {GRAVEDADES.map(g => (
                  <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button type="submit" disabled={loadingNuevaAlergia}>
                {loadingNuevaAlergia ? "Guardando..." : "Agregar"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------- COMPONENTE PERFIL PACIENTE ----------
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

  const getIniciales = () => (
    (camposLocal.nombres?.[0] ?? "") + (camposLocal.apellidos?.[0] ?? "")
  ).toUpperCase();

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
            <TabsTrigger value="personales" className="flex items-center gap-2 whitespace-nowrap">
              <UserRound className="h-4 w-4 text-muted-foreground" /> Datos personales
            </TabsTrigger>
            <TabsTrigger value="medicos" className="flex items-center gap-2 whitespace-nowrap">
              <FlaskConical className="h-4 w-4 text-muted-foreground" /> Información médica
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
              <AlergiasPacienteSection pacienteId={perfil.id} />
            </article>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
