import { useState } from "react";
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
import { useTiposDocumento } from "../../pacientes/hooks/useTiposDocumento";
import { useEspecialidades } from "../hooks/useEspecialidades";
import { useCrearMedico } from "../hooks/useCrearMedico";
import { useAsignarEspecialidad } from "../hooks/useAsignarEspecialidad";

export default function DialogCrearMedico({ open, onClose }) {
  const { data: tipos = [] } = useTiposDocumento();
  const { data: especialidades = [] } = useEspecialidades();

  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    tipoDocumentoId: "",
    numeroDocumento: "",
    numeroColegiatura: "",
    numeroRNE: "",
    telefono: "",
    direccion: "",
    descripcion: "",
    imagen: "",
    fechaContratacion: new Date().toISOString().slice(0, 10),
    tipoContrato: "FIJO",
    tipoMedico: "GENERAL",
    correo: "",
    password: "",
    especialidadSeleccionada: "",
  });

  const asignarEspecialidad = useAsignarEspecialidad();
  const crearMedico = useCrearMedico({
    onSuccess: async (data) => {
      if (form.tipoMedico === "ESPECIALISTA" && form.especialidadSeleccionada) {
        try {
          await asignarEspecialidad.mutateAsync({
            medicoId: data.id,
            especialidadId: parseInt(form.especialidadSeleccionada),
            desdeFecha: new Date().toISOString().slice(0, 10),
          });
        } catch (error) {
          console.error("Error al asignar especialidad", error);
          toast.error("Error al asignar especialidad");
          return;
        }
      }

      toast.success("Médico creado correctamente");
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.mensaje || "Error al crear médico");
    },
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const {
      nombres,
      apellidos,
      tipoDocumentoId,
      numeroDocumento,
      numeroColegiatura,
      numeroRNE,
      telefono,
      direccion,
      descripcion,
      imagen,
      fechaContratacion,
      tipoContrato,
      tipoMedico,
      correo,
      password,
    } = form;

    const payload = {
      nombres,
      apellidos,
      numeroColegiatura,
      numeroRNE: tipoMedico === "GENERAL" ? null : numeroRNE || null,
      tipoDocumentoId: tipoDocumentoId ? parseInt(tipoDocumentoId) : null,
      numeroDocumento,
      telefono,
      direccion,
      descripcion: descripcion?.trim() || "Médico registrado",
      imagen,
      fechaContratacion: fechaContratacion + "T08:00:00",
      tipoContrato,
      tipoMedico,
      correo,
      password,
    };

    crearMedico.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Médico</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          {/* Nombre y Apellido */}
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

          {/* Colegiatura */}
          <div>
            <Label>N° Colegiatura</Label>
            <Input
              value={form.numeroColegiatura}
              onChange={(e) =>
                handleChange("numeroColegiatura", e.target.value)
              }
            />
          </div>

          {/* Tipo Médico */}
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

          {/* Si es especialista */}
          {form.tipoMedico === "ESPECIALISTA" && (
            <>
              <div>
                <Label>RNE</Label>
                <Input
                  value={form.numeroRNE}
                  onChange={(e) => handleChange("numeroRNE", e.target.value)}
                />
              </div>
              <div>
                <Label>Especialidad</Label>
                <Select
                  value={form.especialidadSeleccionada}
                  onValueChange={(val) =>
                    handleChange("especialidadSeleccionada", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una" />
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
            </>
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

          <div>
            <Label>Correo</Label>
            <Input
              value={form.correo}
              onChange={(e) => handleChange("correo", e.target.value)}
            />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={crearMedico.isPending}>
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
