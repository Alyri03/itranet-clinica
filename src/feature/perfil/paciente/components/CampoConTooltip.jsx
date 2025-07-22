import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";

// Lógica de colores, igual que antes
const obtenerColorEtiqueta = (campoId) => {
  const colores = {
    correo: "bg-blue-100 text-blue-600",
    sexo: "bg-pink-100 text-pink-600",
    nacionalidad: "bg-yellow-100 text-yellow-600",
    grupoSanguineo: "bg-red-100 text-red-600",
    telefono: "bg-green-100 text-green-600",
  };
  return colores[campoId] || "bg-gray-100 text-gray-600";
};

export default function CampoConTooltip({ id, icono, etiqueta, descripcion, valor }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${obtenerColorEtiqueta(id)}`}
        >
          {icono}
          <span>{etiqueta}</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">
              {descripcion}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Input
        id={id}
        type="text"
        value={valor || ""}
        readOnly
        className="text-sm"
      />
    </div>
  );
}
