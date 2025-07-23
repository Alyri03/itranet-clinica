import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/DatePicker";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { useRegistroCompleto } from "../hooks/useRegistroCompleto";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

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
      <div className="w-full max-w-xl space-y-6 mb-5">
        <Link to="/login" className="text-sm text-gray-500 flex items-center gap-1">
          <ArrowLeft className="" />
          <p>Volver al login</p>
        </Link>
        <h1 className="text-3xl font-bold text-center">Registro completo</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos bloqueados */}
          {(tipoDocumentoNombre || numeroDocumento) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-md font-medium text-gray-700 mb-1">
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
                <label className="block text-md font-medium text-gray-700 mb-1">
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

          {/* Campos editables */}
          <div className="grid grid-cols-1 gap-4 ">
            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">
                Cuenta
              </label>
              <div className="grid grid-cols-2 gap-4">
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
                  minlength={8}
                />
                <Input
                  name="modalidadAtencion"
                  placeholder="Modalidad de atención"
                  value={form.modalidadAtencion}
                  onChange={handleChange}
                  required
                  maxlength={20}
                  minlength={3}
                />
              </div>
            </div>
        
            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">
                Datos personales
              </label>
              <div className="grid grid-cols-2 gap-4">
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


                <Input
                  name="telefono"
                  placeholder="Teléfono"
                  value={form.telefono}
                  onChange={handleChange}
                  required
                  maxlength={9}
                  minlength={9}
                />
                <Input
                  name="direccion"
                  placeholder="Dirección"
                  value={form.direccion}
                  onChange={handleChange}
                  required
                  maxlength={100}
                  minlength={5}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de nacimiento
                  </label>
                  <DatePicker
                    value={fechaNacimiento}
                    onChange={setFechaNacimiento}
                    placeholder="Selecciona fecha"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Género
                  </label>
                  <Input
                    name="sexo"
                    placeholder="Sexo"
                    value={form.sexo}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">
                Contacto de emergencia
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="contactoEmergenciaNombre"
                  placeholder="Nombre contacto de emergencia"
                  value={form.contactoEmergenciaNombre}
                  onChange={handleChange}
                  required
                  maxlength={50}
                  minlength={3}
                />
                <Input
                  name="contactoEmergenciaTelefono"
                  placeholder="Teléfono contacto emergencia"
                  value={form.contactoEmergenciaTelefono}
                  onChange={handleChange}
                  required
                  maxlength={9}
                  minlength={9}
                />
              </div>

            </div>
          </div>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Registrando..." : "Registrarme"}
          </Button>
        </form>
      </div>
    </section>
  );
}
