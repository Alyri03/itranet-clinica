import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useCrearDisponibilidad } from "../hooks/useCrearDisponibilidad";
import { useBloquesByMedico } from "../../medicos/hooks/useBloquesByMedico";
import { useDisponibilidadesPorMedico } from "../hooks/useDisponibilidadesPorMedico";
import { toast } from "sonner";
import { format } from "date-fns";
import es from "date-fns/locale/es";

function getDiaSemanaFromFecha(fecha) {
  if (!fecha) return "";
  const dias = [
    "DOMINGO",
    "LUNES",
    "MARTES",
    "MIERCOLES",
    "JUEVES",
    "VIERNES",
    "SABADO",
  ];
  return dias[fecha.getDay()];
}

const INITIAL_FORM = {
  fecha: null,
  horaInicio: "",
  horaFin: "",
  ubicacion: "",
  notas: "",
  duracionMinutos: "60",
};

export default function DialogAgregarDisponibilidad({ open, onClose, medico }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  // Limpiar al cerrar/cancelar el dialog
  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM);
      setError("");
    }
  }, [open]);

  // Trae todas las disponibilidades del médico
  const { data: disponibilidades = [] } = useDisponibilidadesPorMedico(
    medico?.id,
    { enabled: !!medico }
  );
  // Para deshabilitar fechas ocupadas (de los bloques, por si acaso)
  const { data: bloques = [] } = useBloquesByMedico(medico?.id, {
    enabled: !!medico,
  });

  // Calcula días de semana ya usados por el médico
  const diasSemanaOcupados = useMemo(() => {
    return disponibilidades.map((d) => d.diaSemana);
  }, [disponibilidades]);

  // Calcula fechas ocupadas exactas (por si acaso tu lógica quiere ambos)
  const fechasOcupadas = useMemo(() => {
    const fechasSet = new Set();
    bloques.forEach((b) => {
      if (b.fecha) fechasSet.add(b.fecha);
    });
    return Array.from(fechasSet);
  }, [bloques]);

  // Cambiar fecha y validación
  const handleFechaChange = (date) => {
    setForm((prev) => ({ ...prev, fecha: date }));
    if (!date) {
      setError("");
      return;
    }
    const diaSemana = getDiaSemanaFromFecha(date);
    // Si ya hay una disponibilidad para ese día de semana
    if (diasSemanaOcupados.includes(diaSemana)) {
      setError("Ya existe una disponibilidad para ese día de la semana.");
      return;
    }
    // Si además quieres bloquear por fecha exacta (doble control)
    const fechaStr = format(date, "yyyy-MM-dd");
    if (fechasOcupadas.includes(fechaStr)) {
      setError("Ya existe una disponibilidad para esa fecha.");
      return;
    }
    setError("");
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (value) => {
    setForm((prev) => ({
      ...prev,
      duracionMinutos: value,
    }));
  };

  const { mutate: crearDisponibilidad, isPending } = useCrearDisponibilidad({
    onSuccess: () => {
      toast.success("Disponibilidad registrada");
      setForm(INITIAL_FORM);
      setError("");
      onClose();
    },
    onError: (e) => {
      toast.error(e?.response?.data?.message || "Error al registrar");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fecha || !form.horaInicio || !form.horaFin || !form.ubicacion) {
      setError("Completa todos los campos obligatorios");
      return;
    }
    if (form.horaInicio >= form.horaFin) {
      setError("La hora de inicio debe ser menor que la hora de fin");
      return;
    }
    const diaSemana = getDiaSemanaFromFecha(form.fecha);
    if (diasSemanaOcupados.includes(diaSemana)) {
      setError("Ya existe una disponibilidad para ese día de la semana.");
      return;
    }
    // Si además quieres bloquear por fecha exacta (opcional)
    const fechaStr = form.fecha ? format(form.fecha, "yyyy-MM-dd") : "";
    if (fechasOcupadas.includes(fechaStr)) {
      setError("Ya existe una disponibilidad para esa fecha.");
      return;
    }
    setError("");

    crearDisponibilidad({
      diaSemana,
      horaInicio: form.horaInicio,
      horaFin: form.horaFin,
      notas: form.notas,
      medicoId: medico.id,
      duracionMinutos: Number(form.duracionMinutos),
      ubicacion: form.ubicacion,
    });
  };

  if (!medico) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Disponibilidad</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Fecha */}
          <div>
            <label className="block mb-1 font-medium text-sm">Fecha</label>
            <CalendarSelect
              value={form.fecha}
              onChange={handleFechaChange}
              disabled={isPending}
              // Puedes usar disabledDays para bloquear por fechas exactas, pero el control principal es por día de semana
              disabledDays={fechasOcupadas.map((f) => new Date(f))}
            />
          </div>
          {/* Horario */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 font-medium text-sm">
                Hora Inicio
              </label>
              <div className="relative flex items-center">
                <Input
                  name="horaInicio"
                  type="time"
                  value={form.horaInicio}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                />
                <Clock className="absolute right-2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium text-sm">Hora Fin</label>
              <div className="relative flex items-center">
                <Input
                  name="horaFin"
                  type="time"
                  value={form.horaFin}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                />
                <Clock className="absolute right-2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          {/* Ubicación */}
          <div>
            <label className="block mb-1 font-medium text-sm">Ubicación</label>
            <Input
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              required
              disabled={isPending}
              placeholder="Ej: Consultorio 101"
            />
          </div>
          {/* Notas */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              Notas (opcional)
            </label>
            <Input
              name="notas"
              value={form.notas}
              onChange={handleChange}
              disabled={isPending}
              placeholder="Notas adicionales"
            />
          </div>
          {/* Duración de bloques */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              Duración de bloques
            </label>
            <Select
              value={form.duracionMinutos}
              onValueChange={handleSelectChange}
              disabled={isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="60">60 minutos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {/* Botones */}
          <div className="flex gap-2 mt-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={isPending || !!error}
            >
              Agregar
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setForm(INITIAL_FORM);
                  setError("");
                  onClose && onClose();
                }}
                disabled={isPending}
              >
                Cancelar
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// CalendarSelect
function CalendarSelect({ value, onChange, disabled, disabledDays = [] }) {
  const [open, setOpen] = useState(false);

  // Convierte disabledDays en fechas tipo Date
  const disabledDates = disabledDays.map((d) =>
    d instanceof Date ? d : new Date(d)
  );

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground"
        )}
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value ? format(value, "dd/MM/yyyy", { locale: es }) : "dd/mm/aaaa"}
      </Button>
      {open && (
        <div className="absolute z-50 mt-2">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              setOpen(false);
              if (date) onChange(date);
            }}
            disabled={disabled}
            disabledDays={disabledDates}
          />
        </div>
      )}
    </div>
  );
}
