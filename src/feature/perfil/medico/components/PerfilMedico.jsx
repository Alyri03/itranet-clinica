import { useUserProfile } from "../../hooks/useUserProfile";

export default function PerfilMedico() {
  const { data: perfil, isLoading } = useUserProfile();

  if (isLoading) return <p>Cargando perfil...</p>;
  if (!perfil) return <p>No se pudo cargar el perfil.</p>;

  return (
    <div className="p-6 space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">Perfil del Médico</h1>

      <div>
        <strong>Nombres:</strong> {perfil.nombres}
      </div>
      <div>
        <strong>Apellidos:</strong> {perfil.apellidos}
      </div>
      <div>
        <strong>Correo:</strong> {perfil.email}
      </div>
      <div>
        <strong>Número de colegiatura:</strong> {perfil.numeroColegiatura}
      </div>
      <div>
        <strong>Número RNE:</strong> {perfil.numeroRNE}
      </div>
      <div>
        <strong>Tipo de documento:</strong> {perfil.tipoDocumento}
      </div>
      <div>
        <strong>Número de documento:</strong> {perfil.numeroDocumento}
      </div>
      <div>
        <strong>Teléfono:</strong> {perfil.telefono}
      </div>
      <div>
        <strong>Dirección:</strong> {perfil.direccion}
      </div>
      <div>
        <strong>Fecha de contratación:</strong> {perfil.fechaContratacion}
      </div>
    </div>
  );
}
