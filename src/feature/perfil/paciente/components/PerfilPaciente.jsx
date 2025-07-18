import { useUserProfile } from "../../hooks/useUserProfile";
export default function PerfilPaciente() {
  const { data: perfil, isLoading } = useUserProfile();

  if (isLoading) return <p>Cargando perfil...</p>;
  if (!perfil) return <p>No se pudo cargar el perfil.</p>;

  return (
    <div className="p-6 space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">Perfil del Paciente</h1>

      <div>
        <strong>Nombres:</strong> {perfil.nombres}
      </div>
      <div>
        <strong>Apellidos:</strong> {perfil.apellidos}
      </div>
      <div>
        <strong>Fecha de nacimiento:</strong> {perfil.fechaNacimiento}
      </div>
      <div>
        <strong>Sexo:</strong> {perfil.sexo}
      </div>
      <div>
        <strong>Correo electrónico:</strong> {perfil.usuario?.correo}
      </div>
      <div>
        <strong>Documento:</strong> {perfil.tipoDocumento?.nombre} -{" "}
        {perfil.numeroIdentificacion}
      </div>
      <div>
        <strong>Teléfono:</strong> {perfil.telefono}
      </div>
      <div>
        <strong>Dirección:</strong> {perfil.direccion}
      </div>
      <div>
        <strong>Tipo de sangre:</strong> {perfil.tipoSangre}
      </div>
    </div>
  );
}
