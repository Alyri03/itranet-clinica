import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, Trash2, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import {
  usePacienteAlergiasByPacienteId,
  useCrearPacienteAlergia,
  useEliminarPacienteAlergia,
} from "../../hooks/usePacienteAlergia";
import { useAlergias } from "../../hooks/useAlergias";

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

export default function AlergiasPacienteSection({ pacienteId }) {
  const { data: alergiasPaciente = [], isLoading } = usePacienteAlergiasByPacienteId(pacienteId);
  const { data: catalogoAlergias = [], isLoading: loadingCat, refetch } = useAlergias();
  const crear = useCrearPacienteAlergia({
    onSuccess: () => {
      toast.success("Alergia agregada correctamente");
      refetch();
    },
    onError: () => toast.error("Error al agregar alergia"),
  });
  const eliminar = useEliminarPacienteAlergia({
    onSuccess: () => toast.success("Alergia eliminada"),
    onError: () => toast.error("Error al eliminar"),
  });

  // Modal para agregar
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ alergiaId: "", gravedad: "" });
  const [esPersonalizada, setEsPersonalizada] = useState(false);
  const [nuevaAlergia, setNuevaAlergia] = useState({ nombre: "", tipoAlergia: "" });
  const [loadingNuevaAlergia, setLoadingNuevaAlergia] = useState(false);

  const abrirAgregar = () => {
    setModalOpen(true);
    setForm({ alergiaId: "", gravedad: "" });
    setEsPersonalizada(false);
    setNuevaAlergia({ nombre: "", tipoAlergia: "" });
  };

  const handleChangeAlergia = (v) => {
    if (v === "personalizada") {
      setEsPersonalizada(true);
      setForm((f) => ({ ...f, alergiaId: "" }));
    } else {
      setEsPersonalizada(false);
      setForm((f) => ({ ...f, alergiaId: v }));
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
      alergiaObj = catalogoAlergias.find((a) => String(a.id) === form.alergiaId);
      if (!alergiaObj) {
        toast.error("Alergia no encontrada en el catálogo.");
        return;
      }
      // Evitar duplicados
      const yaExiste = alergiasPaciente.some((a) => a.alergia.id === alergiaObj.id);
      if (yaExiste) {
        toast.error("Esta alergia ya está registrada para el paciente.");
        return;
      }
    }

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

  // Badges
  const badgeBase = "rounded px-2 py-0.5 text-xs font-medium border shadow-sm";
  const tipoBadge = {
    ALIMENTARIA: "bg-blue-50 border-blue-200 text-blue-700",
    MEDICA: "bg-indigo-50 border-indigo-200 text-indigo-700",
    AMBIENTAL: "bg-green-50 border-green-200 text-green-700",
    OTRO: "bg-gray-50 border-gray-200 text-gray-700",
  };
  const gravedadBadge = {
    LEVE: "bg-green-100 border-green-200 text-green-800",
    MODERADA: "bg-orange-100 border-orange-200 text-orange-800",
    SEVERA: "bg-red-100 border-red-200 text-red-800",
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold flex gap-2 items-center">
          <FlaskConical className="w-4 h-4" /> Alergias
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={abrirAgregar}
          disabled={alergiasPaciente.length >= 5}
        >
          <Plus size={16} className="mr-1" />
          Agregar
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {isLoading && <p className="text-sm text-muted-foreground">Cargando...</p>}
        {!isLoading && alergiasPaciente.length === 0 && (
          <p className="text-sm text-muted-foreground">Sin alergias registradas</p>
        )}
        {alergiasPaciente.map((a) => (
          <div
            key={a.id}
            className="flex flex-col md:flex-row items-start md:items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm"
          >
            <Input
              value={a.alergia.nombre}
              readOnly
              className="w-full md:max-w-xs font-medium text-[15px] bg-slate-50"
            />
            <span className={`${badgeBase} ${tipoBadge[a.alergia.tipoAlergia] || ""}`}>
              {TIPOS_ALERGIA.find((t) => t.value === a.alergia.tipoAlergia)?.label || a.alergia.tipoAlergia}
            </span>
            <span className={`${badgeBase} ${gravedadBadge[a.gravedad] || ""}`}>
              {GRAVEDADES.find((g) => g.value === a.gravedad)?.label || a.gravedad}
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
          </div>
        ))}
      </div>
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
                  {catalogoAlergias.map((a) => (
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
                  onChange={(e) => setNuevaAlergia((f) => ({ ...f, nombre: e.target.value }))}
                  placeholder="Nombre de la alergia"
                  required
                  maxLength={48}
                />
                <Select
                  value={nuevaAlergia.tipoAlergia}
                  onValueChange={(v) => setNuevaAlergia((f) => ({ ...f, tipoAlergia: v }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de alergia" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_ALERGIA.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            {/* Gravedad */}
            <Select
              value={form.gravedad}
              onValueChange={(v) => setForm((f) => ({ ...f, gravedad: v }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Gravedad" />
              </SelectTrigger>
              <SelectContent>
                {GRAVEDADES.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
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
