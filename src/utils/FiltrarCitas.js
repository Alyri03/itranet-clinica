const ESTADO_PRIORIDAD = {
  PENDIENTE: 1,
  CONFIRMADA: 2,
  CANCELADA: 3,
  ATENDIDA: 4,
  NO_PRESENTADO: 5,
  REPROGRAMADA: 6,
};

export function ordenarCitas(citas) {
  return [...citas].sort((a, b) => {
    const estadoA = ESTADO_PRIORIDAD[a.estadoCita?.toUpperCase()] || 99;
    const estadoB = ESTADO_PRIORIDAD[b.estadoCita?.toUpperCase()] || 99;
    if (estadoA !== estadoB) return estadoA - estadoB;

    if (a.fecha !== b.fecha) {
      return b.fecha.localeCompare(a.fecha);
    }

    if (a.hora !== b.hora) {
      return b.hora.localeCompare(a.hora);
    }

    return 0;
  });
}
