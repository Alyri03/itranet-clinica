import { useTiposDocumento } from "../../hooks/useTiposDocumento";
import { useCrearPaciente } from "../../hooks/useCrearPaciente";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { DatePicker } from "@/components/ui/DatePicker";
import {
  User,
  Phone,
  MapPin,
  Mail,
  Contact,
  FileText,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

const sexoOptions = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
  { value: "OTRO", label: "Otro" },
];

const modalidadOptions = [
  { value: "PARTICULAR", label: "Particular" },
  { value: "SEGURO", label: "Seguro" },
];

const inputClass = "h-[36px] text-sm";
const selectTriggerClass =
  "w-full h-[36px] px-3 py-0 text-sm rounded-md border border-input bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors flex items-center pl-9";

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

export default function DialogAgregarPaciente({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    sexo: "",
    nacionalidad: "PERUANA",
    tipoDocumento: "",
    numeroIdentificacion: "",
    telefono: "",
    direccion: "",
    email: "",
    modalidadDeAtencion: "PARTICULAR",
    contactoDeEmergenciaNombre: "",
    contactoDeEmergenciaTelefono: "",
  });
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { data: tipoDocumentos = [], isLoading: loadingTiposDocumento } = useTiposDocumento();

  const mutation = useCrearPaciente({
    onSuccess: () => {
      queryClient.invalidateQueries(["pacientes"]);
      resetForm();
      setTimeout(() => {
        toast.success("Datos iniciales del usuario enviados");
      }, 100);
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      setError(err?.message || "Error al registrar paciente");
    },
  });

  useEffect(() => {
    if (fechaNacimiento) {
      setForm((prev) => ({
        ...prev,
        fechaNacimiento: fechaNacimiento.toISOString().slice(0, 10),
      }));
    } else {
      setForm((prev) => ({ ...prev, fechaNacimiento: "" }));
    }
  }, [fechaNacimiento]);

  useEffect(() => {
    if (!open) {
      resetForm();
      setError("");
    }
  }, [open]);

  const resetForm = () => {
    setForm({
      nombres: "",
      apellidos: "",
      fechaNacimiento: "",
      sexo: "",
      nacionalidad: "PERUANA",
      tipoDocumento: "",
      numeroIdentificacion: "",
      telefono: "",
      direccion: "",
      email: "",
      modalidadDeAtencion: "PARTICULAR",
      contactoDeEmergenciaNombre: "",
      contactoDeEmergenciaTelefono: "",
    });
    setFechaNacimiento(null);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelect = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const required = [
      "nombres",
      "apellidos",
      "fechaNacimiento",
      "sexo",
      "tipoDocumento",
      "numeroIdentificacion",
      "telefono",
      "direccion",
      "email",
      "modalidadDeAtencion",
      "contactoDeEmergenciaNombre",
      "contactoDeEmergenciaTelefono",
    ];

    const empty = required.find((f) => !form[f]);
    if (empty) {
      setError("Complete todos los campos obligatorios");
      return;
    }

    const paciente = {
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      fechaNacimiento: form.fechaNacimiento,
      sexo: form.sexo,
      tipoDocumento: { id: Number(form.tipoDocumento) },
      numeroIdentificacion: form.numeroIdentificacion.trim(),
      nacionalidad: form.nacionalidad.trim(),
      telefono: form.telefono.trim(),
      direccion: form.direccion.trim(),
      email: form.email.trim(),
      modalidadDeAtencion: form.modalidadDeAtencion,
      contactoDeEmergenciaNombre: form.contactoDeEmergenciaNombre.trim(),
      contactoDeEmergenciaTelefono: form.contactoDeEmergenciaTelefono.trim(),
    };

    mutation.mutate(paciente);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[700px] max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="pt-8 px-10">
          <DialogTitle className="text-2xl font-bold text-gray-800 text-center mb-1">
            Agregar Paciente
          </DialogTitle>
          <p className="text-center text-gray-500 text-sm mb-4">
            Complete todos los campos obligatorios
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 px-10 pb-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithIcon
              icon={User}
              name="nombres"
              placeholder="Nombres *"
              value={form.nombres}
              onChange={handleChange}
            />
            <InputWithIcon
              icon={User}
              name="apellidos"
              placeholder="Apellidos *"
              value={form.apellidos}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DatePicker
              value={fechaNacimiento}
              onChange={setFechaNacimiento}
              placeholder="Fecha de nacimiento"
              minYear={1900}
              maxYear={new Date().getFullYear()}
            />

            <InputWithIcon
              icon={ShieldCheck}
              name="nacionalidad"
              placeholder="Nacionalidad"
              value={form.nacionalidad}
              onChange={handleChange}
            />

            <Select
              value={form.sexo}
              onValueChange={(val) => handleSelect("sexo", val)}
            >
              <SelectTrigger className={selectTriggerClass}>
                <User size={16} className="absolute left-3 top-2.5 text-gray-500" />
                {form.sexo
                  ? sexoOptions.find((s) => s.value === form.sexo)?.label
                  : "Seleccione el sexo"}
              </SelectTrigger>
              <SelectContent>
                {sexoOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={form.tipoDocumento}
              onValueChange={(val) => handleSelect("tipoDocumento", val)}
              disabled={loadingTiposDocumento}
            >
              <SelectTrigger className={selectTriggerClass}>
                <FileText size={16} className="absolute left-3 top-2.5 text-gray-500" />
                {loadingTiposDocumento
                  ? "Cargando..."
                  : tipoDocumentos.find((d) => d.id === +form.tipoDocumento)
                    ?.nombre || "Seleccione tipo de documento"}
              </SelectTrigger>
              <SelectContent>
                {tipoDocumentos.map((opt) => (
                  <SelectItem key={opt.id} value={String(opt.id)}>
                    {opt.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <InputWithIcon
              icon={FileText}
              name="numeroIdentificacion"
              placeholder="Número de documento"
              value={form.numeroIdentificacion}
              maxLength={8}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithIcon
              icon={Phone}
              name="telefono"
              placeholder="Teléfono"
              maxLength={9}
              value={form.telefono}
              onChange={handleChange}
            />
            <InputWithIcon
              icon={MapPin}
              name="direccion"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
            />
          </div>

          <InputWithIcon
            icon={Mail}
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            type="email"
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithIcon
              icon={Contact}
              name="contactoDeEmergenciaNombre"
              placeholder="Nombre de contacto de emergencia"
              value={form.contactoDeEmergenciaNombre}
              onChange={handleChange}
            />
            <InputWithIcon
              icon={Phone}
              name="contactoDeEmergenciaTelefono"
              placeholder="Teléfono de emergencia"
              value={form.contactoDeEmergenciaTelefono}
              maxLength={9}
              onChange={handleChange}
            />
          </div>

          <Select
            value={form.modalidadDeAtencion}
            onValueChange={(val) => handleSelect("modalidadDeAtencion", val)}
          >
            <SelectTrigger className={selectTriggerClass}>
              <BadgeCheck size={16} className="absolute left-3 top-2.5 text-gray-500" />
              {
                modalidadOptions.find(
                  (m) => m.value === form.modalidadDeAtencion
                )?.label
              }
            </SelectTrigger>
            <SelectContent>
              {modalidadOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {error && (
            <div className="text-red-600 text-sm mt-2 text-center">{error}</div>
          )}

          <DialogFooter className="flex justify-end gap-2 pt-6 pb-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-black text-white"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Registrando..." : "Registrar Paciente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
