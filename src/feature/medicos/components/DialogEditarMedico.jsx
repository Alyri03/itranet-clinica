import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Trash2 } from "lucide-react";

import { useActualizarMedico } from "../hooks/useActualizarMedico";
import { useTiposDocumento } from "../../pacientes/hooks/useTiposDocumento";
import { useEspecialidades } from "../hooks/useEspecialidades";
import { useEliminarEspecialidadDeMedico } from "../hooks/useEliminarEspecialidadDeMedico";
import { useAsignarEspecialidad } from "../hooks/useAsignarEspecialidad";
import { useEspecialidadByMedico } from "../hooks/useEspecialidadByMedico";

export default function DialogEditarMedico({
  open,
  onClose,
  medico,
  onSuccess,
}) {
  const { data: tipos = [] } = useTiposDocumento();
  const { data: especialidades = [] } = useEspecialidades();
  const eliminarEspecialidad = useEliminarEspecialidadDeMedico();
  const asignarEspecialidad = useAsignarEspecialidad();
  const { data: especialidadesAsignadas = [], refetch } =
    useEspecialidadByMedico(medico?.id);

  const [form, setForm] = useState({});
  const [nuevaEspecialidadId, setNuevaEspecialidadId] = useState("");

  useEffect(() => {
    if (medico) {
      setForm({
        nombres: medico.nombres ?? "",
        apellidos: medico.apellidos ?? "",
        numeroColegiatura: medico.numeroColegiatura ?? "",
        numeroRNE: medico.numeroRNE ?? "",
        tipoDocumentoId: medico.tipoDocumentoId?.toString() ?? "",
        numeroDocumento: medico.numeroDocumento ?? "",
        telefono: medico.telefono ?? "",
        direccion: medico.direccion ?? "",
        descripcion: medico.descripcion ?? "",
        tipoContrato: medico.tipoContrato ?? "FIJO",
        tipoMedico: medico.tipoMedico ?? "GENERAL",
      });
    }
  }, [medico]);

  const actualizarMedico = useActualizarMedico({
    onSuccess: () => {
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
  };

  const handleEliminarEspecialidad = async (id) => {
    try {
      await eliminarEspecialidad.mutateAsync({
        medicoId: medico.id,
        especialidadId: id,
      });
      toast.success("Especialidad eliminada");
      await refetch();
    } catch (error) {
      toast.error("Error al eliminar especialidad");
    }
  };

  const handleAgregarEspecialidad = async () => {
    if (!nuevaEspecialidadId) return;

    const yaExiste = especialidadesAsignadas.find(
      (esp) => esp.especialidadId === parseInt(nuevaEspecialidadId)
    );
    if (yaExiste) {
      toast.warning("La especialidad ya está asignada");
      return;
    }

    try {
      await asignarEspecialidad.mutateAsync({
        medicoId: medico.id,
        especialidadId: parseInt(nuevaEspecialidadId),
        desdeFecha: new Date().toISOString().slice(0, 10),
      });

      toast.success("Especialidad asignada");
      setNuevaEspecialidadId("");
      await refetch();
    } catch (error) {
      toast.error("Error al asignar especialidad");
    }
  };

  const handleSubmit = async () => {
    if (!medico?.id) return;

    const camposActualizables = [
      "nombres",
      "apellidos",
      "numeroColegiatura",
      "numeroRNE",
      "tipoDocumentoId",
      "numeroDocumento",
      "telefono",
      "direccion",
      "descripcion",
      "tipoContrato",
      "tipoMedico",
    ];

    const payload = {};
    for (const campo of camposActualizables) {
      const valor = form[campo];
      if (valor !== "" && valor !== null && valor !== undefined) {
        payload[campo] = campo === "tipoDocumentoId" ? parseInt(valor) : valor;
      }
    }

    try {
      await actualizarMedico.mutateAsync({ id: medico.id, medico: payload });
    } catch (error) {
      toast.error("Error al actualizar médico");
      console.error(error);
    }
  };

  if (!medico) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar Médico</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          {/* Nombres y Apellidos */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Nombres</Label>
              <Input
                value={form.nombres}
                onChange={(e) => handleChange("nombres", e.target.value)}
              />
            </div>
            <div>
              <Label>Apellidos</Label>
              <Input
                value={form.apellidos}
                onChange={(e) => handleChange("apellidos", e.target.value)}
              />
            </div>
          </div>

          {/* Documento */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Tipo Documento</Label>
              <Select
                value={form.tipoDocumentoId}
                onValueChange={(val) => handleChange("tipoDocumentoId", val)}
              >
                <SelectTrigger>
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
            <div>
              <Label>N° Documento</Label>
              <Input
                value={form.numeroDocumento}
                onChange={(e) =>
                  handleChange("numeroDocumento", e.target.value)
                }
              />
            </div>
          </div>

          {/* Colegiatura y RNE */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>N° Colegiatura</Label>
              <Input
                value={form.numeroColegiatura}
                onChange={(e) =>
                  handleChange("numeroColegiatura", e.target.value)
                }
              />
            </div>
            {form.tipoMedico === "ESPECIALISTA" && (
              <div>
                <Label>N° RNE</Label>
                <Input
                  value={form.numeroRNE || ""}
                  onChange={(e) => handleChange("numeroRNE", e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Especialidades asignadas */}
          {form.tipoMedico === "ESPECIALISTA" && (
            <div className="space-y-2">
              <Label>Especialidades Asignadas</Label>
              {especialidadesAsignadas.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No tiene especialidades asignadas
                </p>
              ) : (
                especialidadesAsignadas.map((esp) => (
                  <div
                    key={esp.especialidadId}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                  >
                    <span>{esp.nombreEspecialidad}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleEliminarEspecialidad(esp.especialidadId)
                      }
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))
              )}

              {/* Agregar nueva */}
              <div className="grid grid-cols-3 gap-2 items-end mt-2">
                <div className="col-span-2">
                  <Label>Nueva Especialidad</Label>
                  <Select
                    value={nuevaEspecialidadId}
                    onValueChange={(val) => setNuevaEspecialidadId(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {especialidades.map((esp) => (
                        <SelectItem key={esp.id} value={String(esp.id)}>
                          {esp.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAgregarEspecialidad}>Agregar</Button>
              </div>
            </div>
          )}

          {/* Contacto */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Teléfono</Label>
              <Input
                value={form.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
              />
            </div>
            <div>
              <Label>Dirección</Label>
              <Input
                value={form.direccion}
                onChange={(e) => handleChange("direccion", e.target.value)}
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <Label>Descripción</Label>
            <Input
              value={form.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
            />
          </div>

          {/* Contrato y tipo médico */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Tipo Contrato</Label>
              <Select
                value={form.tipoContrato}
                onValueChange={(val) => handleChange("tipoContrato", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIJO">FIJO</SelectItem>
                  <SelectItem value="TEMPORAL">TEMPORAL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo Médico</Label>
              <Select
                value={form.tipoMedico}
                onValueChange={(val) => handleChange("tipoMedico", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">GENERAL</SelectItem>
                  <SelectItem value="ESPECIALISTA">ESPECIALISTA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={actualizarMedico.isPending}
            >
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
