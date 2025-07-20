import { useMutation } from "@tanstack/react-query";

import { enviarResultado } from "../api/atencionApi";

export const useEnviarResultado = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: enviarResultado,
    onSuccess,
    onError,
  });
};
