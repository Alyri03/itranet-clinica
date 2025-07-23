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
import { useQueryClient } from "@tanstack/react-query";
import {
  UserIcon,
  HashIcon,
  IdCardIcon,
  PhoneIcon,
  MapPinIcon,
  MailIcon,
} from "lucide-react";

export default function DialogEditarRecepcionista({ open, onOpenChange, recepcionista }) {
  const { data: tiposDocumento } = useTiposDocumento();
  const queryClient = useQueryClient();

  const recepId = recepcionista?.id;
  const {
    data: correoRecepcionista,
    isLoading: loadingCorreo,
    isError: errorCorreo,
  } = useCorreoRecepcionista(open ? recepId : null, {
    onError: () => toast.error("No se pudo obtener el correo"),
  });

  const { mutate, isLoading } = useActualizarRecepcionista({
    onSuccess: () => {
      queryClient.invalidateQueries(["recepcionistas"]);
      toast.success("Recepcionista actualizado");
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error("Error al actualizar recepcionista");
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
    correo: "",
  });

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
        correo: correoRecepcionista || "",
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
            Editar Recepcionista
          </DialogTitle>
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
                maxLength={12}
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
          <div>
            {inputWrapper(MailIcon,
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
                readOnly={loadingCorreo || !!errorCorreo}
                className="border-0 focus-visible:ring-0"
              />
            )}
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

