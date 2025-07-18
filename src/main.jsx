import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./AppRouter";
import QueryProvider from "./providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <AppRouter />
      <Toaster richColors />
    </QueryProvider>
  </StrictMode>
);
