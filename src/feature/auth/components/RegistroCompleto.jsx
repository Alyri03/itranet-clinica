import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/DatePicker";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { useRegistroCompleto } from "../hooks/useRegistroCompleto";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const SEXOS = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
];

const MODALIDADES = [
  { value: "PARTICULAR", label: "Particular" },
  { value: "SEGURO", label: "Seguro" },
];

export default function RegistroCompleto({ initialData }) {
  const navigate = useNavigate();
  const { mutate, isPending } = useRegistroCompleto({
    onSuccess: () => {
      toast.success("Registro exitoso. Ya puedes iniciar sesión.");
      navigate("/login");
    },
    onError: (err) => {
      console.error("Error al registrar:", err);
      toast.error(
        err?.response?.data?.message || "Ocurrió un error al registrar"
      );
    },
  });

  const tipoDocumentoNombre =
    initialData?.tipoDocumentoNombre || initialData?.documentType || "DNI";
  const numeroDocumento =
    initialData?.numeroDocumento || initialData?.documentNumber || "";

  const [fechaNacimiento, setFechaNacimiento] = useState(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    nombres: "",
    apellidos: "",
    sexo: "MASCULINO",
    tipoDocumentoId: initialData?.tipoDocumentoId || 1,
    numeroDocumento: numeroDocumento,
    fechaNacimiento: "",
    telefono: "",
    direccion: "",
    modalidadAtencion: "PARTICULAR",
    contactoEmergenciaNombre: "",
    contactoEmergenciaTelefono: "",
    seguroId: null,
    numeroPoliza: null,
  });

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        tipoDocumentoId: initialData?.tipoDocumentoId ?? prev.tipoDocumentoId,
        numeroDocumento: numeroDocumento || prev.numeroDocumento,
      }));
    }
  }, [initialData]);

  useEffect(() => {
    if (fechaNacimiento) {
      setForm((prev) => ({
        ...prev,
        fechaNacimiento: format(fechaNacimiento, "yyyy-MM-dd"),
      }));
    }
  }, [fechaNacimiento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <section className="flex items-center justify-center min-h-screen px-4 bg-white">
      <div className="w-full max-w-xl space-y-6 flex flex-col">
        {/* Flecha y volver */}
        <div className="flex items-center gap-2 mb-1">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-700 hover:underline"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al login</span>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-center">Registro completo</h1>
        {(tipoDocumentoNombre || numeroDocumento) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de documento
              </label>
              <Input
                value={tipoDocumentoNombre}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
                tabIndex={-1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                N° Documento
              </label>
              <Input
                value={numeroDocumento}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
                tabIndex={-1}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombres y Apellidos */}
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
            {/* Fecha de nacimiento y Sexo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de nacimiento
              </label>
              <DatePicker
                value={fechaNacimiento}
                onChange={setFechaNacimiento}
                placeholder="Selecciona fecha"
                minYear={1900}
                maxYear={new Date().getFullYear()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexo
              </label>
              <Select
                value={form.sexo}
                onValueChange={(v) => setForm((prev) => ({ ...prev, sexo: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona sexo" />
                </SelectTrigger>
                <SelectContent>
                  {SEXOS.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Teléfono y Dirección */}
            <Input
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              required
            />
            <Input
              name="direccion"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
              required
            />
            {/* Modalidad de atención y Nombre contacto de emergencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modalidad de atención
              </label>
              <Select
                value={form.modalidadAtencion}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, modalidadAtencion: v }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona modalidad" />
                </SelectTrigger>
                <SelectContent>
                  {MODALIDADES.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              className="mt-6"
              name="contactoEmergenciaNombre"
              placeholder="Nombre contacto de emergencia"
              value={form.contactoEmergenciaNombre}
              onChange={handleChange}
              required
            />
            {/* Teléfono contacto emergencia y Correo electrónico */}
            <Input
              name="contactoEmergenciaTelefono"
              placeholder="Teléfono contacto emergencia"
              value={form.contactoEmergenciaTelefono}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
            />
            {/* Contraseña ocupa las dos columnas */}
            <Input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              className="md:col-span-2"
            />
          </div>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Registrando..." : "Registrarme"}
          </Button>
        </form>
      </div>
    </section>
  );
}
