import { useMutation } from "@tanstack/react-query";

import { finalizarCita } from "../api/citasApi";

export const useAtenderCita = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: finalizarCita,
    onSuccess,
    onError,
  });
};
