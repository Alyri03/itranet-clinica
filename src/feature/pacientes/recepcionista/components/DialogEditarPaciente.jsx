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
import { useQueryClient } from "@tanstack/react-query";
import {
  Phone,
  MapPin,
  FileText,
  User,
  Contact,
} from "lucide-react";

const inputClass = "h-[38px] text-sm w-full"; // Sin padding izquierdo aquí

// Input con ícono a la izquierda
function InputWithIcon({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-2.5 text-gray-500">
        <Icon size={16} />
      </div>
      <Input {...props} className={`${inputClass} pl-9`} />
    </div>
  );
}

export default function DialogEditarPaciente({ open, onClose, paciente }) {
  const [form, setForm] = useState({
    telefono: "",
    direccion: "",
    antecedentes: "",
    contactoDeEmergenciaNombre: "",
    contactoDeEmergenciaTelefono: "",
  });

  const queryClient = useQueryClient();
  const [error, setError] = useState("");

  const { mutate, isLoading } = useActualizarPaciente({
    onSuccess: () => {
      queryClient.invalidateQueries(["pacientes"]);
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
          <DialogTitle className="text-2xl text-center font-bold text-gray-800">
            Editar Información de Contacto
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithIcon
              name="telefono"
              value={form.telefono}
              maxLength={9}
              onChange={handleChange}
              placeholder="Teléfono"
              icon={Phone}
            />
            <InputWithIcon
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Dirección"
              icon={MapPin}
            />
          </div>
          <InputWithIcon
            name="antecedentes"
            value={form.antecedentes}
            onChange={handleChange}
            placeholder="Antecedentes"
            icon={FileText}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithIcon
              name="contactoDeEmergenciaNombre"
              value={form.contactoDeEmergenciaNombre}
              onChange={handleChange}
              placeholder="Nombre de Contacto de Emergencia"
              icon={User}
            />
            <InputWithIcon
              name="contactoDeEmergenciaTelefono"
              maxLength={9}
              value={form.contactoDeEmergenciaTelefono}
              onChange={handleChange}
              placeholder="Teléfono de Contacto de Emergencia"
              icon={Contact}
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
