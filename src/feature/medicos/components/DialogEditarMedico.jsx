import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  User,
  BadgePlus,
  FileText,
  IdCard,
  Phone,
  MapPin,
  FileSignature,
  Type,
  ClipboardList,
  Trash2,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

import { useActualizarMedico } from "../hooks/useActualizarMedico";
import { useTiposDocumento } from "../../pacientes/hooks/useTiposDocumento";
import { useEspecialidades } from "../hooks/useEspecialidades";
import { useEliminarEspecialidadDeMedico } from "../hooks/useEliminarEspecialidadDeMedico";
import { useAsignarEspecialidad } from "../hooks/useAsignarEspecialidad";
import { useEspecialidadByMedico } from "../hooks/useEspecialidadByMedico";
import { useQueryClient } from "@tanstack/react-query";

export default function DialogEditarMedico({
  open,
  onClose,
  medico,
  onSuccess,
}) {
  const queryClient = useQueryClient();
  const { data: tipos = [] } = useTiposDocumento();
  const { data: especialidades = [] } = useEspecialidades();
  const eliminarEspecialidad = useEliminarEspecialidadDeMedico();
  const asignarEspecialidad = useAsignarEspecialidad();
  const { data: especialidadesAsignadas = [], refetch } =
    useEspecialidadByMedico(medico?.id, { enabled: !!medico?.id && open });

  const [form, setForm] = useState({});
  const [nuevaEspecialidadId, setNuevaEspecialidadId] = useState("");
  // Estado local temporal para las especialidades
  const [especialidadesLocal, setEspecialidadesLocal] = useState([]);

  useEffect(() => {
    if (medico) {
      setForm({
        nombres: medico.nombres ?? "",
        apellidos: medico.apellidos ?? "",
        tipoDocumentoId: medico.tipoDocumentoId?.toString() ?? "",
        numeroDocumento: medico.numeroDocumento ?? "",
        numeroColegiatura: medico.numeroColegiatura ?? "",
        tipoMedico: medico.tipoMedico ?? "GENERAL",
        numeroRNE: medico.numeroRNE ?? "",
        telefono: medico.telefono ?? "",
        direccion: medico.direccion ?? "",
        descripcion: medico.descripcion ?? "",
        tipoContrato: medico.tipoContrato ?? "FIJO",
      });
    }
  }, [medico]);

  useEffect(() => {
    if (open && especialidadesAsignadas) {
      setEspecialidadesLocal(
        especialidadesAsignadas.map((esp) => String(esp.especialidadId))
      );
    }
  }, [open, medico?.id]);

  const actualizarMedico = useActualizarMedico({
    onSuccess: () => {
      queryClient.invalidateQueries(["medicos"]);

      toast.success("Médico actualizado correctamente");
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      toast.error("Error al actualizar médico");
      console.error(error);
    },
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // NO toques especialidadesLocal aquí
  };

  // Solo modifica el estado local
  const handleEliminarEspecialidad = (id) => {
    setEspecialidadesLocal((prev) => prev.filter((e) => e !== String(id)));
  };

  const handleAgregarEspecialidad = () => {
    if (
      nuevaEspecialidadId &&
      !especialidadesLocal.includes(nuevaEspecialidadId)
    ) {
      setEspecialidadesLocal((prev) => [...prev, nuevaEspecialidadId]);
      setNuevaEspecialidadId("");
    }
  };

  // Especialidades que aún no están seleccionadas
  const especialidadesDisponibles = especialidades
    ? especialidades.filter(
        (esp) => !especialidadesLocal.includes(String(esp.id))
      )
    : [];

  // Al guardar:
  const handleSubmit = async () => {
    if (!medico?.id) return;

    const camposActualizables = [
      "nombres",
      "apellidos",
      "tipoDocumentoId",
      "numeroDocumento",
      "numeroColegiatura",
      "tipoMedico",
      "numeroRNE",
      "telefono",
      "direccion",
      "descripcion",
      "tipoContrato",
    ];

    const payload = {};
    for (const campo of camposActualizables) {
      const valor = form[campo];
      if (valor !== "" && valor !== null && valor !== undefined) {
        payload[campo] = campo === "tipoDocumentoId" ? parseInt(valor) : valor;
      }
    }

    try {
      // 1. Actualizar datos básicos
      await actualizarMedico.mutateAsync({ id: medico.id, medico: payload });

      // 2. Actualizar especialidades SOLO si es especialista
      if (form.tipoMedico === "ESPECIALISTA") {
        const originales = especialidadesAsignadas.map((e) =>
          String(e.especialidadId)
        );
        const nuevas = especialidadesLocal;

        const paraAgregar = nuevas.filter((id) => !originales.includes(id));
        const paraEliminar = originales.filter((id) => !nuevas.includes(id));

        for (const id of paraEliminar) {
          await eliminarEspecialidad.mutateAsync({
            medicoId: medico.id,
            especialidadId: parseInt(id),
          });
        }
        for (const id of paraAgregar) {
          await asignarEspecialidad.mutateAsync({
            medicoId: medico.id,
            especialidadId: parseInt(id),
            desdeFecha: new Date().toISOString().slice(0, 10),
          });
        }
      } else if (form.tipoMedico === "GENERAL") {
        // Si se cambia a GENERAL y se guarda, elimina todas
        for (const esp of especialidadesAsignadas) {
          await eliminarEspecialidad.mutateAsync({
            medicoId: medico.id,
            especialidadId: esp.especialidadId,
          });
        }
      }
      await refetch();

      toast.success("Especialidades actualizadas correctamente");
      queryClient.invalidateQueries(["especialidad-medico", medico.id]);
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Error al actualizar médico o especialidades");
      console.error(error);
    }
  };

  if (!medico) return null;

return (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="min-w-[800px] max-w-5xl max-h-[90vh] overflow-y-auto py-10 px-10 rounded-2xl">
      <div className="flex justify-center mb-4">
        <DialogTitle className="text-2xl font-semibold text-center">
          Editar Médico
        </DialogTitle>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6 mt-2"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nombres */}
          <div>
            <Label className="mb-1 flex items-center gap-1">
              <User className="w-4 h-4" /> Nombres
            </Label>
            <Input
              value={form.nombres}
              onChange={(e) => handleChange("nombres", e.target.value)}
            />
          </div>
          {/* Apellidos */}
          <div>
            <Label className="mb-1 flex items-center gap-1">
              <User className="w-4 h-4" /> Apellidos
            </Label>
            <Input
              value={form.apellidos}
              onChange={(e) => handleChange("apellidos", e.target.value)}
            />
          </div>
          {/* Tipo Documento */}
          <div>
            <Label className="mb-1 flex items-center gap-1">
              <IdCard className="w-4 h-4" />
              Tipo Documento
            </Label>
            <Select
              value={form.tipoDocumentoId}
              onValueChange={(val) => handleChange("tipoDocumentoId", val)}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {tipos.map((tipo) => (
                  <SelectItem key={tipo.id} value={String(tipo.id)}>
                    {tipo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* N° Documento */}
          <div>
            <Label className="mb-1 flex items-center gap-1">
              <FileText className="w-4 h-4" />
              N° Documento
            </Label>
            <Input
              value={form.numeroDocumento}
              maxLength={8}
              onChange={(e) =>
                handleChange("numeroDocumento", e.target.value)
              }
            />
          </div>
          {/* N° Colegiatura */}
          <div>
            <Label className="mb-1 flex items-center gap-1">
              <ClipboardList className="w-4 h-4" />
              N° Colegiatura
            </Label>
            <Input
              value={form.numeroColegiatura}
              maxLength={11}
              onChange={(e) =>
                handleChange("numeroColegiatura", e.target.value)
              }
            />
          </div>
          {/* Tipo Médico */}
          <div>
            <Label className="mb-1 flex items-center gap-1">
              <Type className="w-4 h-4" />
              Tipo Médico
            </Label>
            <Select
              value={form.tipoMedico}
              onValueChange={(val) => handleChange("tipoMedico", val)}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GENERAL">General</SelectItem>
                <SelectItem value="ESPECIALISTA">Especialista</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* RNE solo especialista */}
          {form.tipoMedico === "ESPECIALISTA" && (
            <div className="md:col-span-2">
              <Label className="mb-1 flex items-center gap-1">
                <FileText className="w-4 h-4" />
                RNE (Registro Nacional de Especialistas)
              </Label>
              <Input
                value={form.numeroRNE || ""}
                maxLength={9}
                onChange={(e) => handleChange("numeroRNE", e.target.value)}
              />
            </div>
          )}

          {/* ESPECIALIDADES UI */}
          {form.tipoMedico === "ESPECIALISTA" && (
            <div className="md:col-span-2">
              <Label className="mb-1 flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                Especialidades{" "}
                <span className="text-red-500 text-base">*</span>
              </Label>
              {/* Selector y botón de agregar */}
              <div className="flex gap-2 mb-2">
                <Select
                  value={nuevaEspecialidadId}
                  onValueChange={setNuevaEspecialidadId}
                  disabled={especialidadesDisponibles.length === 0}
                >
                  <SelectTrigger className="flex-1 h-10">
                    <SelectValue placeholder="Seleccionar especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {especialidadesDisponibles.map((esp) => (
                      <SelectItem key={esp.id} value={String(esp.id)}>
                        {esp.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAgregarEspecialidad}
                  disabled={!nuevaEspecialidadId}
                  className="h-9"
                >
                  <BadgePlus className="w-4 h-4" />
                </Button>
              </div>
              {/* Especialidades agregadas */}
              <div className="space-y-2 mb-1">
                <div className="text-sm text-gray-600 mb-1 font-medium">
                  Especialidades agregadas:
                </div>
                {especialidadesLocal.map((espId) => {
                  const esp = especialidades.find(
                    (e) => String(e.id) === String(espId)
                  );
                  return (
                    <div key={espId} className="flex items-center gap-3 p-0">
                      <Input
                        readOnly
                        className="flex-1 font-semibold text-[15px] border border-gray-300 shadow-sm rounded-lg"
                        value={esp?.nombre || espId}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleEliminarEspecialidad(espId)}
                        className="h-10 px-4 text-xs font-semibold rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* FIN ESPECIALIDADES UI */}

          {/* Teléfono */}
          <div>
            <Label className="mb-1 flex items-center gap-1">
              <Phone className="w-4 h-4" />
              Teléfono
            </Label>
            <Input
              value={form.telefono}
              maxLength={9}
              onChange={(e) => handleChange("telefono", e.target.value)}
            />
          </div>

          {/* Dirección */}
          <div>
            <Label className="mb-1 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Dirección
            </Label>
            <Input
              value={form.direccion}
              onChange={(e) => handleChange("direccion", e.target.value)}
            />
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <Label className="mb-1 flex items-center gap-1">
              <FileSignature className="w-4 h-4" />
              Descripción
            </Label>
            <Input
              value={form.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
            />
          </div>

          {/* Tipo Contrato */}
          <div>
            <Label className="mb-1 flex items-center gap-1">
              <ClipboardList className="w-4 h-4" />
              Tipo Contrato
            </Label>
            <Select
              value={form.tipoContrato}
              onValueChange={(val) => handleChange("tipoContrato", val)}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIJO">FIJO</SelectItem>
                <SelectItem value="NOCTURNO">NOCTURNO</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white"
            disabled={actualizarMedico.isPending}
          >
            {actualizarMedico.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);

}
