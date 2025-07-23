import { useState, useEffect } from "react";
import RegistroPorRecepcion from "./RegistroPorRecepcion";
import RegistroCompleto from "./RegistroCompleto";
import { useVerificarDocumento } from "../hooks/useVerificarDocumento";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useTiposDocumento } from "../../pacientes/hooks/useTiposDocumento";

import imgRegistro from "@/assets/imgRegistro.jpg";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [step, setStep] = useState("verify-document");
  const [form, setForm] = useState({
    documentType: "DNI",
    documentTypeId: 1,
    documentNumber: "",
  });
  const [initialData, setInitialData] = useState(null);

  const { data: tiposDocumento = [], isLoading } = useTiposDocumento();

  useEffect(() => {
    if ((step === "porRecepcion" || step === "completo") && !initialData) {
      setStep("verify-document");
    }
    // eslint-disable-next-line
  }, [step, initialData]);

  const verificarDocumento = useVerificarDocumento({
    onSuccess: (data) => {
      if (data.exists) {
        setInitialData({
          ...data,
          tipoDocumentoNombre: form.documentType,
          tipoDocumentoId: form.documentTypeId,
          numeroDocumento: form.documentNumber,
        });
        setStep("porRecepcion");
      } else {
        setInitialData({
          tipoDocumentoNombre: form.documentType,
          tipoDocumentoId: form.documentTypeId,
          numeroDocumento: form.documentNumber,
        });
        setStep("completo");
      }
    },
    onError: () => {
      setInitialData({
        tipoDocumentoNombre: form.documentType,
        tipoDocumentoId: form.documentTypeId,
        numeroDocumento: form.documentNumber,
      });
      setStep("completo");
    },
  });

  return (
    <section className="flex h-screen w-full bg-white">
      {/* Ilustración izquierda */}
      <div className="hidden md:flex w-1/2 h-full items-center justify-center bg-white">
        <div className="bg-[#e3efff] rounded-3xl w-[85%] h-[92%] flex items-end justify-center overflow-hidden">
          <img
            src={imgRegistro}
            alt="Registro Ilustración"
            className="w-[99%] object-contain mb-0"
          />
        </div>
      </div>

      {/* Formulario (todos los pasos) */}
      <div className="flex w-full md:w-1/2 h-full items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-xl p-8 mb-10">
          {/* Paso 1: Verificar documento */}
          {step === "verify-document" && (
            <>
              <Link to="/login" className="text-sm text-gray-500 flex items-center gap-1 pb-5">
                <ArrowLeft className="" />
                <p>Volver al login</p>
              </Link>
              <h1 className="text-3xl font-bold text-center mb-6">
                Verifica tu documento
              </h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  verificarDocumento.mutate({
                    tipoDocumento: {
                      id: form.documentTypeId,
                      nombre: form.documentType,
                    },
                    documento: form.documentNumber,
                  });
                }}
                className="space-y-4"
              >
                <div className="flex gap-4">
                  <Select
                    value={form.documentType}
                    onValueChange={(val) => {
                      const selected = tiposDocumento.find(
                        (d) => d.nombre === val
                      );
                      setForm((prev) => ({
                        ...prev,
                        documentType: val,
                        documentTypeId: selected?.id || 1,
                      }));
                    }}
                  >
                    <SelectTrigger className="w-1/3">
                      {form.documentType}
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem disabled>Cargando...</SelectItem>
                      ) : (
                        tiposDocumento.map((doc) => (
                          <SelectItem key={doc.id} value={doc.nombre}>
                            {doc.nombre}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    placeholder="N° Documento"
                    value={form.documentNumber}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        documentNumber: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <Button
                  className="w-full"
                  type="submit"
                  disabled={verificarDocumento.isPending}
                >
                  {verificarDocumento.isPending
                    ? "Verificando..."
                    : "Verificar documento"}
                </Button>
              </form>
            </>
          )}

          {/* Paso 2: Por recepción */}
          {step === "porRecepcion" && initialData && (
            <RegistroPorRecepcion initialData={initialData} />
          )}

          {/* Paso 3: Completo */}
          {step === "completo" && initialData && (
            <RegistroCompleto initialData={initialData} />
          )}
        </div>
      </div>
    </section>
  );
}
