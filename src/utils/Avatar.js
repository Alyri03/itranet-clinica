export function getInitials(nombres = "", apellidos = "") {
  const firstNameInitial = nombres?.[0]?.toUpperCase() ?? "";
  const lastNameInitial = apellidos?.[0]?.toUpperCase() ?? "";
  return `${firstNameInitial}${lastNameInitial}`;
}