import { useState } from "react";
import { useTiposDocumento } from "../../pacientes/hooks/useTiposDocumento";
import { useCrearRecepcionista } from "../hooks/useCrearRecepcionista";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  MailIcon,
  LockIcon,
  IdCardIcon,
  ClockIcon,
} from "lucide-react";

const turnos = [
  { value: "DIURNO", label: "Diurno" },
  { value: "NOCTURNO", label: "Nocturno" },
];

export default function DialogAgregarRecepcionista({ open, onOpenChange }) {
  const { data: tiposDocumento } = useTiposDocumento();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useCrearRecepcionista({
    onSuccess: () => {
      queryClient.invalidateQueries(["recepcionistas"]);
      toast.success("Recepcionista registrado exitosamente");
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error("Error al registrar recepcionista");
      console.error(err);
    },
  });

  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    numeroDocumento: "",
    tipoDocumentoId: "",
    telefono: "",
    direccion: "",
    turnoTrabajo: "",
    fechaContratacion: "",
    correo: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelect = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({
      ...form,
      tipoDocumentoId: Number(form.tipoDocumentoId),
      fechaContratacion: form.fechaContratacion || new Date().toISOString().split("T")[0],
      turnoTrabajo: form.turnoTrabajo || "DIURNO",
    });
  };

  const inputWrapper = (Icon, input) => (
    <div className="flex items-center gap-2 border rounded-lg px-3 py-1 w-full">
      <Icon className="w-5 h-5 text-gray-500" />
      {input}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Agregar Recepcionista
          </DialogTitle>
          <p className="text-center text-gray-500 text-sm">
          Complete todos los campos
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="flex gap-2">
            {inputWrapper(UserIcon,
              <Input
                name="nombres"
                placeholder="Nombres"
                value={form.nombres}
                onChange={handleChange}
                required
                className="border-0 focus-visible:ring-0"
              />
            )}
            {inputWrapper(UserIcon,
              <Input
                name="apellidos"
                placeholder="Apellidos"
                value={form.apellidos}
                onChange={handleChange}
                required
                className="border-0 focus-visible:ring-0"
              />
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 border rounded-lg px-3 py-1 w-full">
              <IdCardIcon className="w-5 h-5 text-gray-500" />
              <Select
                name="tipoDocumentoId"
                value={form.tipoDocumentoId}
                onValueChange={(val) => handleSelect("tipoDocumentoId", val)}
                required
              >
                <SelectTrigger className="border-0 focus:ring-0 w-full">
                  <SelectValue placeholder="Tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  {tiposDocumento?.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {inputWrapper(IdCardIcon,
              <Input
                name="numeroDocumento"
                placeholder="Número de documento"
                value={form.numeroDocumento}
                onChange={handleChange}
                required
                maxLength={8}
                className="border-0 focus-visible:ring-0"
              />
            )}
          </div>
          <div className="flex gap-2">
            {inputWrapper(PhoneIcon,
              <Input
                name="telefono"
                placeholder="Teléfono"
                value={form.telefono}
                onChange={handleChange}
                required
                maxLength={9}
                className="border-0 focus-visible:ring-0"
              />
            )}
            {inputWrapper(MapPinIcon,
              <Input
                name="direccion"
                placeholder="Dirección"
                value={form.direccion}
                onChange={handleChange}
                required
                className="border-0 focus-visible:ring-0"
              />
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 border rounded-lg px-3 py-1 w-full">
              <ClockIcon className="w-5 h-5 text-gray-500" />
              <Select
                name="turnoTrabajo"
                value={form.turnoTrabajo}
                onValueChange={(val) => handleSelect("turnoTrabajo", val)}
                required
              >
                <SelectTrigger className="border-0 focus:ring-0 w-full">
                  <SelectValue placeholder="Turno de trabajo" />
                </SelectTrigger>
                <SelectContent>
                  {turnos.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {inputWrapper(CalendarIcon,
              <Input
                name="fechaContratacion"
                type="date"
                placeholder="Fecha de contratación"
                value={form.fechaContratacion}
                onChange={handleChange}
                required
                className="border-0 focus-visible:ring-0"
              />
            )}
          </div>
          <div className="flex gap-2">
            {inputWrapper(MailIcon,
              <Input
                name="correo"
                type="email"
                placeholder="Correo electrónico"
                value={form.correo}
                onChange={handleChange}
                required
                className="border-0 focus-visible:ring-0"
              />
            )}
            {inputWrapper(LockIcon,
              <Input
                name="password"
                type="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="border-0 focus-visible:ring-0"
              />
            )}
          </div>
          <DialogFooter>
            <Button type="submit" loading={isLoading}>
              Registrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
