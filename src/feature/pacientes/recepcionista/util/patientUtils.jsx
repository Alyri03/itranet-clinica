import clsx from "clsx";
import React from "react";

export const getSexoBadge = (sexo) => {
  const sx = (sexo || "").toUpperCase();
  if (sx === "FEMENINO")
    return <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-semibold text-xs">F</span>;
  if (sx === "MASCULINO")
    return <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">M</span>;
  return <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 font-semibold text-xs">O</span>;
};

export const getNacionalidadBadge = (nac) => {
  if (!nac) return null;
  const bg = nac.toLowerCase().includes("peru")
    ? "bg-green-100 text-green-700"
    : nac.toLowerCase().includes("colomb")
    ? "bg-yellow-100 text-yellow-700"
    : "bg-gray-100 text-gray-700";
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

export function getPaginationRange(current, total) {
  const delta = 1;
  const range = [];
  for (
    let i = Math.max(1, current - delta);
    i <= Math.min(total, current + delta);
    i++
  ) {
    range.push(i);
  }
  if (range[0] > 2) range.unshift("...");
  if (range[0] !== 1) range.unshift(1);
  if (range[range.length - 1] < total - 1) range.push("...");
  if (range[range.length - 1] !== total) range.push(total);
  return [...new Set(range)];
}
