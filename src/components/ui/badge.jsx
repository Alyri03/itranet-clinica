import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-white",
        outline: "text-foreground",
        "estado-pendiente": "bg-yellow-100 text-yellow-800",
        "estado-confirmada": "bg-blue-100 text-blue-800",
        "estado-cancelada": "bg-red-100 text-red-800",
        "estado-atendida": "bg-green-100 text-green-800",
        "estado-no-presentado": "bg-gray-100 text-gray-600",
        "estado-reprogramada": "bg-purple-100 text-purple-800",
        especialista: "bg-blue-100 text-blue-800 border-blue-200",
        general: "bg-gray-100 text-gray-700 border-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, estado, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, estado }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
