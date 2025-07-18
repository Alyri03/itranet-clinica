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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTiposDocumento } from "../../hooks/useTiposDocumento";
import { useActualizarPaciente } from "../../hooks/useActualizarPaciente";

const sexoOptions = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
  { value: "OTRO", label: "Otro" },
];

const inputClass = "h-[36px] text-sm";
const selectTriggerClass =
  "w-full h-[36px] px-3 py-0 text-sm rounded-md border border-input bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors flex items-center";

export default function DialogEditarPaciente({ open, onClose, paciente }) {
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
  });

  const [error, setError] = useState("");

  const { data: tipoDocumentos = [], isLoading: loadingTipos } =
    useTiposDocumento();

  const { mutate, isLoading } = useActualizarPaciente({
    onSuccess: () => {
      onClose();
      setError("");
    },
    onError: (err) => {
      setError(err?.message || "Error al actualizar paciente");
    },
  });

  useEffect(() => {
    if (paciente) {
      setForm({
        nombres: paciente.nombres || "",
        apellidos: paciente.apellidos || "",
        fechaNacimiento: paciente.fechaNacimiento || "",
        sexo: paciente.sexo || "",
        nacionalidad: paciente.nacionalidad || "PERUANA",
        tipoDocumento: paciente.tipoDocumento?.id
          ? String(paciente.tipoDocumento.id)
          : "",
        numeroIdentificacion: paciente.numeroIdentificacion || "",
        telefono: paciente.telefono || "",
        direccion: paciente.direccion || "",
        email: paciente.email || "",
      });
    }
  }, [paciente, open]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelect = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!paciente) return;

    const tipoDoc = tipoDocumentos.find(
      (d) => String(d.id) === form.tipoDocumento
    );

    const payload = {
      id: paciente.id,
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      fechaNacimiento: form.fechaNacimiento,
      sexo: form.sexo,
      nacionalidad: form.nacionalidad.trim(),
      tipoDocumento: tipoDoc ? { id: tipoDoc.id } : null,
      numeroIdentificacion: form.numeroIdentificacion.trim(),
      telefono: form.telefono.trim(),
      direccion: form.direccion.trim(),
      email: form.email.trim(),
    };

    mutate({ id: paciente.id, datosPaciente: payload });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[700px] max-w-5xl px-10 py-8">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Editar Paciente
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              placeholder="Nombres *"
              className={inputClass}
            />
            <Input
              name="apellidos"
              value={form.apellidos}
              onChange={handleChange}
              placeholder="Apellidos *"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="date"
              name="fechaNacimiento"
              value={form.fechaNacimiento}
              onChange={handleChange}
              className={inputClass}
            />
            <Input
              name="nacionalidad"
              value={form.nacionalidad}
              onChange={handleChange}
              placeholder="Nacionalidad *"
              className={inputClass}
            />
            <Select
              value={form.sexo}
              onValueChange={(val) => handleSelect("sexo", val)}
            >
              <SelectTrigger className={selectTriggerClass}>
                {form.sexo
                  ? sexoOptions.find((s) => s.value === form.sexo)?.label
                  : "Sexo"}
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
              disabled={loadingTipos}
            >
              <SelectTrigger className={selectTriggerClass}>
                {loadingTipos
                  ? "Cargando..."
                  : tipoDocumentos.find((d) => d.id === +form.tipoDocumento)
                      ?.nombre || "Tipo de documento"}
              </SelectTrigger>
              <SelectContent>
                {tipoDocumentos.map((opt) => (
                  <SelectItem key={opt.id} value={String(opt.id)}>
                    {opt.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              name="numeroIdentificacion"
              value={form.numeroIdentificacion}
              onChange={handleChange}
              placeholder="Número de documento"
              className={inputClass}
            />
          </div>
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
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className={inputClass}
          />
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
