import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/DatePicker"; // <--- usa tu componente aquí
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { useRegistroCompleto } from "../hooks/useRegistroCompleto";
import { format } from "date-fns";

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

  // Estado para DatePicker y form
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

  // Si initialData cambia, sincroniza
  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        tipoDocumentoId: initialData?.tipoDocumentoId ?? prev.tipoDocumentoId,
        numeroDocumento: numeroDocumento || prev.numeroDocumento,
      }));
    }
  }, [initialData]);

  // Sincroniza la fecha cuando cambia el datepicker
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
      <div className="w-full max-w-xl space-y-6">
        <Link to="/login" className="text-sm text-gray-500 underline">
          Volver al login
        </Link>
        <h1 className="text-3xl font-bold text-center">Registro completo</h1>

        {/* Mostrar los campos bloqueados SOLO si hay initialData */}
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

            {/* DatePicker aquí */}
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

            <Input
              name="sexo"
              placeholder="Sexo"
              value={form.sexo}
              onChange={handleChange}
              required
            />
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
            <Input
              name="modalidadAtencion"
              placeholder="Modalidad de atención"
              value={form.modalidadAtencion}
              onChange={handleChange}
              required
            />
            <Input
              name="contactoEmergenciaNombre"
              placeholder="Nombre contacto de emergencia"
              value={form.contactoEmergenciaNombre}
              onChange={handleChange}
              required
            />
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
            <Input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
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
