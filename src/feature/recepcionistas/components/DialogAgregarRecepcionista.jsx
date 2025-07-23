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
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const turnos = [
  { value: "DIURNO", label: "Diurno" },
  { value: "NOCTURNO", label: "Nocturno" },
];

export default function DialogAgregarRecepcionista({ open, onOpenChange }) {
  const { data: tiposDocumento } = useTiposDocumento();
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useCrearRecepcionista({
    onSuccess: () => {
      queryClient.invalidateQueries(["recepcionistas"])
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Recepcionista</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="flex gap-2">
            <Input
              name="nombres"
              placeholder="Nombres"
              value={form.nombres}
              onChange={handleChange}
              required
            />
            <Input
              name="apellidos"
              placeholder="Apellidos"
              value={form.apellidos}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-2">
            <Select
              name="tipoDocumentoId"
              value={form.tipoDocumentoId}
              onValueChange={(val) => handleSelect("tipoDocumentoId", val)}
              required
            >
              <SelectTrigger>
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
            <Input
              name="numeroDocumento"
              placeholder="Número de documento"
              value={form.numeroDocumento}
              onChange={handleChange}
              required
              maxLength={8}
            />
          </div>
          <div className="flex gap-2">
            <Input
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              required
              maxLength={9}
            />
            <Input
              name="direccion"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-2">
            <Select
              name="turnoTrabajo"
              value={form.turnoTrabajo}
              onValueChange={(val) => handleSelect("turnoTrabajo", val)}
              required
            >
              <SelectTrigger>
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
            <Input
              name="fechaContratacion"
              type="date"
              placeholder="Fecha de contratación"
              value={form.fechaContratacion}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-2">
            <Input
              name="correo"
              type="email"
              placeholder="Correo electrónico"
              value={form.correo}
              onChange={handleChange}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
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
