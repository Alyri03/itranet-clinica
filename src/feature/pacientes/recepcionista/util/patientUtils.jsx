import clsx from "clsx";
import React from "react";

export const getSexoBadge = (sexo) => {
  const sx = (sexo || "").toUpperCase();
  if (sx === "FEMENINO")
    return (
      <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-semibold text-xs">
        F
      </span>
    );
  if (sx === "MASCULINO")
    return (
      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
        M
      </span>
    );
  return (
    <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 font-semibold text-xs">
      O
    </span>
  );
};
const coloresNacionalidad = {
  peru: "bg-green-100 text-green-700",
  peruano: "bg-green-100 text-green-700",
  peruana: "bg-green-100 text-green-700",

  colombia: "bg-yellow-100 text-yellow-700",
  colombiano: "bg-yellow-100 text-yellow-700",
  colombiana: "bg-yellow-100 text-yellow-700",

  argentina: "bg-blue-100 text-blue-700",
  argentino: "bg-blue-100 text-blue-700",

  chile: "bg-red-100 text-red-700",
  chileno: "bg-red-100 text-red-700",
  chilena: "bg-red-100 text-red-700",

  bolivia: "bg-lime-100 text-lime-700",
  boliviano: "bg-lime-100 text-lime-700",
  boliviana: "bg-lime-100 text-lime-700",

  ecuador: "bg-orange-100 text-orange-700",
  ecuatoriano: "bg-orange-100 text-orange-700",
  ecuatoriana: "bg-orange-100 text-orange-700",

  uruguay: "bg-cyan-100 text-cyan-700",
  uruguayo: "bg-cyan-100 text-cyan-700",
  uruguaya: "bg-cyan-100 text-cyan-700",

  paraguay: "bg-violet-100 text-violet-700",
  paraguayo: "bg-violet-100 text-violet-700",
  paraguaya: "bg-violet-100 text-violet-700",

  venezuela: "bg-amber-100 text-amber-700",
  venezolano: "bg-amber-100 text-amber-700",
  venezolana: "bg-amber-100 text-amber-700",

  brasil: "bg-emerald-100 text-emerald-700",
  brasileño: "bg-emerald-100 text-emerald-700",
  brasileña: "bg-emerald-100 text-emerald-700",
};

export const getNacionalidadBadge = (nac) => {
  if (!nac) return null;
  const n = nac.toLowerCase();
  const bg = coloresNacionalidad[n] || "bg-gray-100 text-gray-700";
  return (
    <span className={clsx("px-3 py-1 rounded-full font-semibold text-xs", bg)}>
      {nac.charAt(0).toUpperCase() + nac.slice(1).toLowerCase()}
    </span>
  );
};

export function formatFecha(fecha) {
  if (!fecha) return "-";
  const date = new Date(fecha);
  const opts = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("es-PE", opts);
}
