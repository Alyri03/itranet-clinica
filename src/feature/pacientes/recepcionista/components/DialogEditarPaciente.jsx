import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActualizarPaciente } from "../../hooks/useActualizarPaciente";
import { toast } from "sonner";

const inputClass = "h-[36px] text-sm";

export default function DialogEditarPaciente({ open, onClose, paciente }) {
  const [form, setForm] = useState({
    telefono: "",
    direccion: "",
    antecedentes: "",
    contactoDeEmergenciaNombre: "",
    contactoDeEmergenciaTelefono: "",
  });

  const [error, setError] = useState("");

  const { mutate, isLoading } = useActualizarPaciente({
    onSuccess: (data) => {
      toast.success("Paciente actualizado correctamente");
      onClose();
      setError("");
    },
    onError: (err) => {
      const msg = err?.message || "Error al actualizar paciente";
      toast.error(msg);
      setError(msg);
    },
  });

  useEffect(() => {
    if (paciente) {
      setForm({
        telefono: paciente.telefono || "",
        direccion: paciente.direccion || "",
        antecedentes: paciente.antecedentes || "",
        contactoDeEmergenciaNombre: paciente.contactoDeEmergenciaNombre || "",
        contactoDeEmergenciaTelefono: paciente.contactoDeEmergenciaTelefono || "",
      });
    }
  }, [paciente, open]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!paciente) return;

    const payload = {
      id: paciente.id,
      datosPaciente: {
        telefono: form.telefono.trim(),
        direccion: form.direccion.trim(),
        antecedentes: form.antecedentes.trim(),
        contactoDeEmergenciaNombre: form.contactoDeEmergenciaNombre.trim(),
        contactoDeEmergenciaTelefono: form.contactoDeEmergenciaTelefono.trim(),
      },
    };

    mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[600px] max-w-3xl px-10 py-8">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Editar Información de Contacto
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
              className={inputClass}
            />
            <Input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Dirección"
              className={inputClass}
            />
          </div>
          <Input
            name="antecedentes"
            value={form.antecedentes}
            onChange={handleChange}
            placeholder="Antecedentes"
            className={inputClass}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="contactoDeEmergenciaNombre"
              value={form.contactoDeEmergenciaNombre}
              onChange={handleChange}
              placeholder="Nombre de Contacto de Emergencia"
              className={inputClass}
            />
            <Input
              name="contactoDeEmergenciaTelefono"
              value={form.contactoDeEmergenciaTelefono}
              onChange={handleChange}
              placeholder="Teléfono de Contacto de Emergencia"
              className={inputClass}
            />
          </div>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-black text-white"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
