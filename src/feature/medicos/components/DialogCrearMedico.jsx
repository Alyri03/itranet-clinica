import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useTiposDocumento } from "../../pacientes/hooks/useTiposDocumento";
import { useEspecialidades } from "../hooks/useEspecialidades";
import { useCrearMedico } from "../hooks/useCrearMedico";
import { useAsignarEspecialidad } from "../hooks/useAsignarEspecialidad";
import Spinner from "../../../components/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import {
  User,
  IdCard,
  GraduationCap,
  Stethoscope,
  Phone,
  Home,
  Mail,
  Lock,
} from "lucide-react";

export default function DialogCrearMedico({ open, onClose }) {
  const { data: tipos = [] } = useTiposDocumento();
  const { data: especialidades = [] } = useEspecialidades();
  const queryClient = useQueryClient()


  const [selectedEspecialidades, setSelectedEspecialidades] = useState([]);
  const [currentEspecialidad, setCurrentEspecialidad] = useState("");
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    tipoDocumentoId: "",
    numeroDocumento: "",
    numeroColegiatura: "",
    numeroRNE: "",
    telefono: "",
    direccion: "",
    descripcion: "",
    imagen: "",
    fechaContratacion: new Date().toISOString().slice(0, 10),
    tipoContrato: "FIJO",
    tipoMedico: "",
    correo: "",
    password: "",
  });

  const asignarEspecialidad = useAsignarEspecialidad();
  const crearMedico = useCrearMedico({
    onSuccess: async (data) => {
      if (
        form.tipoMedico === "ESPECIALISTA" &&
        selectedEspecialidades.length > 0
      ) {
        try {
          for (const especialidadId of selectedEspecialidades) {
            await asignarEspecialidad.mutateAsync({
              medicoId: data.id,
              especialidadId: parseInt(especialidadId),
              desdeFecha: new Date().toISOString().slice(0, 10),
            });
          }
        } catch (error) {
          toast.error("Error al asignar especialidad");
          return;
        }
      }
      queryClient.invalidateQueries(["medicos"])
      toast.success("Médico creado correctamente");
      handleCancel();
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.mensaje || "Error al crear médico");
    },
  });

  const handleInputChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "tipoMedico" && value === "GENERAL") {
      setForm((prev) => ({ ...prev, numeroRNE: "" }));
      setSelectedEspecialidades([]);
    }
  };

  const handleAgregarEspecialidad = () => {
    if (
      currentEspecialidad &&
      !selectedEspecialidades.includes(currentEspecialidad)
    ) {
      setSelectedEspecialidades([
        ...selectedEspecialidades,
        currentEspecialidad,
      ]);
      setCurrentEspecialidad("");
    }
  };
  const handleEliminarEspecialidad = (id) => {
    setSelectedEspecialidades(selectedEspecialidades.filter((e) => e !== id));
  };

  const especialidadesDisponibles = especialidades
    ? especialidades.filter(
      (e) => !selectedEspecialidades.includes(String(e.id))
    )
    : [];

  const handleSubmit = (e) => {
    e && e.preventDefault();
    const {
      nombres,
      apellidos,
      tipoDocumentoId,
      numeroDocumento,
      numeroColegiatura,
      numeroRNE,
      telefono,
      direccion,
      correo,
      password,
      tipoMedico,
    } = form;

    if (
      !nombres ||
      !apellidos ||
      !numeroDocumento ||
      !numeroColegiatura ||
      !telefono ||
      !direccion ||
      !correo ||
      !password ||
      !tipoMedico ||
      !tipoDocumentoId
    ) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }

    if (numeroDocumento.length !== 8) {
      toast.error("El número de documento debe tener 8 dígitos");
      return;
    }
    if (numeroColegiatura.length !== 11) {
      toast.error("El número de colegiatura debe tener 11 dígitos");
      return;
    }

    if (tipoMedico === "ESPECIALISTA") {
      if (!numeroRNE || numeroRNE.length !== 9) {
        toast.error("El RNE debe tener 9 dígitos");
        return;
      }
      if (selectedEspecialidades.length === 0) {
        toast.error("Selecciona al menos una especialidad");
        return;
      }
    }

    const payload = {
      ...form,
      numeroRNE: tipoMedico === "GENERAL" ? null : form.numeroRNE || null,
      tipoDocumentoId: tipoDocumentoId ? parseInt(tipoDocumentoId) : null,
      descripcion: form.descripcion?.trim() || "Médico registrado",
      imagen: form.imagen,
      fechaContratacion: form.fechaContratacion + "T08:00:00",
      tipoContrato: form.tipoContrato,
    };

    crearMedico.mutate(payload);
  };

  const handleCancel = () => {
    setForm({
      nombres: "",
      apellidos: "",
      tipoDocumentoId: "",
      numeroDocumento: "",
      numeroColegiatura: "",
      numeroRNE: "",
      telefono: "",
      direccion: "",
      descripcion: "",
      imagen: "",
      fechaContratacion: new Date().toISOString().slice(0, 10),
      tipoContrato: "FIJO",
      tipoMedico: "",
      correo: "",
      password: "",
    });
    setSelectedEspecialidades([]);
    setCurrentEspecialidad("");
  };

  
  return (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="min-w-[700px] max-w-5xl max-h-[90vh] overflow-y-auto py-10 px-12 rounded-2xl">
      <div className="mb-6 text-center">
        <DialogTitle className="text-2xl font-semibold mb-2">
          Registrar Nuevo Médico
        </DialogTitle>
        <p className="text-center text-gray-500 text-sm">
          Complete todos los campos obligatorios
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nombres */}
          <div>
            <Label className="mb-1 flex items-center gap-2">
              <User className="w-4 h-4" />
              Nombres <span className="text-blue-500 text-base">*</span>
            </Label>
            <Input
              autoFocus
              placeholder="Ej: Ana María"
              value={form.nombres}
              onChange={(e) => handleInputChange("nombres", e.target.value)}
              required
            />
          </div>
          {/* Apellidos */}
          <div>
            <Label className="mb-1 flex items-center gap-2">
              <User className="w-4 h-4" />
              Apellidos <span className="text-blue-500 text-base">*</span>
            </Label>
            <Input
              placeholder="Ej: Pérez Torres"
              value={form.apellidos}
              onChange={(e) => handleInputChange("apellidos", e.target.value)}
              required
            />
          </div>
          {/* Tipo Documento */}
          <div>
            <Label className="mb-1 flex items-center gap-2">
              <IdCard className="w-4 h-4" />
              Tipo Documento <span className="text-blue-500 text-base">*</span>
            </Label>
            <Select
              value={form.tipoDocumentoId}
              onValueChange={(val) =>
                handleInputChange("tipoDocumentoId", val)
              }
              required
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {tipos.map((tipo) => (
                  <SelectItem key={tipo.id} value={String(tipo.id)}>
                    {tipo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* N° Documento */}
          <div>
            <Label className="mb-1 flex items-center gap-2">
              <IdCard className="w-4 h-4" />
              N° Documento <span className="text-blue-500 text-base">*</span>
            </Label>
            <Input
              placeholder="8 dígitos"
              value={form.numeroDocumento}
              maxLength={8}
              onChange={(e) =>
                handleInputChange("numeroDocumento", e.target.value)
              }
              required
            />
          </div>
          {/* N° Colegiatura */}
          <div>
            <Label className="mb-1 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              N° Colegiatura <span className="text-blue-500 text-base">*</span>
            </Label>
            <Input
              placeholder="11 dígitos"
              value={form.numeroColegiatura}
              maxLength={11}
              onChange={(e) =>
                handleInputChange("numeroColegiatura", e.target.value)
              }
              required
            />
          </div>
          {/* Tipo Médico */}
          <div>
            <Label className="mb-1 flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Tipo Médico <span className="text-blue-500 text-base">*</span>
            </Label>
            <Select
              value={form.tipoMedico}
              onValueChange={(val) => handleInputChange("tipoMedico", val)}
              required
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GENERAL">General</SelectItem>
                <SelectItem value="ESPECIALISTA">Especialista</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* RNE solo especialista */}
          {form.tipoMedico === "ESPECIALISTA" && (
            <div className="md:col-span-2">
              <Label className="mb-1 flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                RNE (Registro Nacional de Especialistas)
                <span className="text-blue-500 text-base">*</span>
              </Label>
              <Input
                placeholder="9 dígitos"
                value={form.numeroRNE}
                maxLength={9}
                onChange={(e) =>
                  handleInputChange("numeroRNE", e.target.value)
                }
                required
              />
            </div>
          )}

          {/* Especialidades multi-select */}
          {form.tipoMedico === "ESPECIALISTA" && (
            <div className="md:col-span-2">
              <Label className="mb-1 flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                Especialidades <span className="text-blue-500 text-base">*</span>
              </Label>
              <div className="flex gap-2 mb-2">
                <Select
                  value={currentEspecialidad}
                  onValueChange={setCurrentEspecialidad}
                  disabled={especialidadesDisponibles.length === 0}
                >
                  <SelectTrigger className="flex-1 h-10">
                    <SelectValue placeholder="Seleccionar especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {especialidadesDisponibles.map((esp) => (
                      <SelectItem key={esp.id} value={String(esp.id)}>
                        {esp.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAgregarEspecialidad}
                  disabled={
                    !currentEspecialidad ||
                    especialidadesDisponibles.length === 0
                  }
                  className="h-9"
                >
                  +
                </Button>
              </div>
              {selectedEspecialidades.length > 0 && (
                <div className="space-y-2 mb-1">
                  <div className="text-sm text-gray-600 mb-1 font-medium">
                    Especialidades agregadas:
                  </div>
                  {selectedEspecialidades.map((espId) => {
                    const esp = especialidades.find(
                      (e) => String(e.id) === String(espId)
                    );
                    return (
                      <div key={espId} className="flex items-center gap-3 p-0">
                        <Input
                          readOnly
                          className="flex-1 font-semibold text-[15px] border border-gray-300 shadow-sm rounded-lg"
                          value={esp?.nombre || espId}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleEliminarEspecialidad(espId)}
                          className="h-10 px-4 text-xs font-semibold rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Selecciona al menos una especialidad
              </p>
            </div>
          )}

          {/* Teléfono */}
          <div>
            <Label className="mb-1 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Teléfono <span className="text-blue-500 text-base">*</span>
            </Label>
            <Input
              placeholder="Ej: 912345678"
              value={form.telefono}
              maxLength={9}
              onChange={(e) => handleInputChange("telefono", e.target.value)}
              required
            />
          </div>
          {/* Dirección */}
          <div>
            <Label className="mb-1 flex items-center gap-2">
              <Home className="w-4 h-4" />
              Dirección <span className="text-blue-500 text-base">*</span>
            </Label>
            <Input
              placeholder="Ej: Av. Principal 123"
              value={form.direccion}
              onChange={(e) => handleInputChange("direccion", e.target.value)}
              required
            />
          </div>
          {/* Correo */}
          <div>
            <Label className="mb-1 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Correo <span className="text-blue-500 text-base">*</span>
            </Label>
            <Input
              type="email"
              placeholder="ejemplo@email.com"
              value={form.correo}
              onChange={(e) => handleInputChange("correo", e.target.value)}
              required
            />
          </div>
          {/* Contraseña */}
          <div>
            <Label className="mb-1 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Contraseña <span className="text-blue-500 text-base">*</span>
            </Label>
            <Input
              type="password"
              placeholder="Mín. 6 caracteres"
              value={form.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              minLength={6}
              required
            />
          </div>
        </div>
        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              handleCancel();
              onClose();
            }}
            disabled={crearMedico.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white"
            disabled={crearMedico.isPending}
          >
            {crearMedico.isPending ? (
              <span className="flex items-center gap-2">
                <Spinner className="w-4 h-4" /> Guardando...
              </span>
            ) : (
              "Guardar"
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);

}
