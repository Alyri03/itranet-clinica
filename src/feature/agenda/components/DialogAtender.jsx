import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function DialogAtender({ open, onOpenChange, paciente, cita }) {
  const navigate = useNavigate();

  if (!cita || !paciente) return null;

  const handleConfirm = () => {
    onOpenChange(false);
    // Navegar a la página de atención:
    navigate(`/atencion/${cita.pacienteId}/${cita.citaId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Atención</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres atender a {paciente.nombres}{" "}
            {paciente.apellidos}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
