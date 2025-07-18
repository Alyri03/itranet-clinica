import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutos
            gcTime: 5 * 60 * 1000,    // 5 minutos
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
