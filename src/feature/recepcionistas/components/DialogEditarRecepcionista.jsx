import { useState, useEffect } from "react";
import { useTiposDocumento } from "../../pacientes/hooks/useTiposDocumento";
import { useActualizarRecepcionista } from "../hooks/useActualizarRecepcionista";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Props: open, onOpenChange, recepcionista (objeto a editar)
export default function DialogEditarRecepcionista({
  open,
  onOpenChange,
  recepcionista,
}) {
  const { data: tiposDocumento } = useTiposDocumento();

  // Hook de actualización
  const { mutate, isLoading } = useActualizarRecepcionista({
    onSuccess: () => {
      toast.success("Recepcionista actualizado");
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error("Error al actualizar recepcionista");
      console.error(err);
    },
  });

  // Estado local del formulario
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    numeroDocumento: "",
    tipoDocumentoId: "",
    telefono: "",
    direccion: "",
    imagenUrl: null,
    turnoTrabajo: "",
    fechaContratacion: "",
    usuarioId: "",
    correo: "",
    password: "",
  });

  // Carga los datos cuando cambia el recepcionista seleccionado
  useEffect(() => {
    if (recepcionista) {
      setForm({
        nombres: recepcionista.nombres || "",
        apellidos: recepcionista.apellidos || "",
        numeroDocumento: recepcionista.numeroDocumento || "",
        tipoDocumentoId: recepcionista.tipoDocumentoId
          ? String(recepcionista.tipoDocumentoId)
          : "",
        telefono: recepcionista.telefono || "",
        direccion: recepcionista.direccion || "",
        imagenUrl: recepcionista.imagenUrl ?? null,
        turnoTrabajo: recepcionista.turnoTrabajo || "",
        fechaContratacion: recepcionista.fechaContratacion
          ? recepcionista.fechaContratacion
          : "",
        usuarioId: recepcionista.usuarioId || "",
        correo: recepcionista.correo || "",
        password: "", // Por seguridad, siempre pedir la nueva contraseña en edición
      });
    }
  }, [recepcionista]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelect = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Payload completo, como el que usas en Postman:
    const payload = {
      nombres: form.nombres,
      apellidos: form.apellidos,
      numeroDocumento: form.numeroDocumento,
      tipoDocumentoId: Number(form.tipoDocumentoId),
      telefono: form.telefono,
      direccion: form.direccion,
      imagenUrl: form.imagenUrl,
      turnoTrabajo: form.turnoTrabajo || "DIURNO",
      fechaContratacion:
        form.fechaContratacion || new Date().toISOString().split("T")[0],
      usuarioId: Number(form.usuarioId),
      correo: form.correo,
      password: form.password, // Obligatorio para editar
    };

    mutate({ id: recepcionista.id, data: payload });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Recepcionista</DialogTitle>
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
              maxLength={12}
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
                <SelectItem value="DIURNO">Diurno</SelectItem>
                <SelectItem value="NOCTURNO">Nocturno</SelectItem>
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
              placeholder="Contraseña nueva (obligatoria)"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <DialogFooter>
            <Button type="submit" loading={isLoading}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
