export function normalizarEstadoBadge(estado) {
  return String(estado)
    .toLowerCase()
    .replace(/_/g, "-"); 
}
