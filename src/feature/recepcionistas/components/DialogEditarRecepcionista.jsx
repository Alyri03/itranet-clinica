import { useState, useEffect } from "react";
import { useTiposDocumento } from "../../pacientes/hooks/useTiposDocumento";
import { useActualizarRecepcionista } from "../hooks/useActualizarRecepcionista";
import { useCorreoRecepcionista } from "../hooks/useCorreoRecepcionista";
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

export default function DialogEditarRecepcionista({
  open,
  onOpenChange,
  recepcionista,
}) {
  const { data: tiposDocumento } = useTiposDocumento();

  // Hook para obtener correo actualizado (solo cuando el modal está abierto y hay id)
  const recepId = recepcionista?.id;
  const {
    data: correoRecepcionista,
    isLoading: loadingCorreo,
    isError: errorCorreo,
  } = useCorreoRecepcionista(open ? recepId : null, {
    onError: () => toast.error("No se pudo obtener el correo"),
  });

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

  // Estado local SOLO de los campos editables
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    numeroDocumento: "",
    tipoDocumentoId: "",
    telefono: "",
    direccion: "",
    correo: "",
  });

  // Carga datos cuando cambia el recepcionista O el correo obtenido
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
        correo: correoRecepcionista || "", // SIEMPRE desde el endpoint
      });
    }
  }, [recepcionista, correoRecepcionista]);

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

    const payload = {
      nombres: form.nombres,
      apellidos: form.apellidos,
      numeroDocumento: form.numeroDocumento,
      tipoDocumentoId: Number(form.tipoDocumentoId),
      telefono: form.telefono,
      direccion: form.direccion,
      correo: form.correo,
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
          <div>
            <Input
              name="correo"
              type="email"
              placeholder="Correo electrónico"
              value={
                loadingCorreo
                  ? "Cargando..."
                  : errorCorreo
                  ? "No disponible"
                  : form.correo
              }
              onChange={handleChange}
              required
              readOnly={loadingCorreo || !!errorCorreo} // Si hay error/cargando no editable
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
