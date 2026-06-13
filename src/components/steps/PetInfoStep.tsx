import { useState, useRef } from "react";
import { ShowerHead, Scissors, Upload, Trash2 } from "lucide-react";
import type { FormData } from "../BookingWizard";

interface PetInfoStepProps {
  formData: FormData;
  update: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  onNext: () => void;
  onBack: () => void;
  onAddAnother?: () => void;
  onContinue?: () => void;
}

const SERVICE_OPTIONS = [
  { value: "bath" as const, label: "Baño", icon: ShowerHead },
  { value: "bath_cut" as const, label: "Baño + Corte", icon: Scissors },
];

const EXTRA_OPTIONS = [
  { value: "deworming", label: "Desparasitación" },
  { value: "antiflea", label: "Antipulgas" },
  { value: "vaccine", label: "Vacuna" },
];

const CORTE_OPTIONS = [
  { value: "rapado", label: "Corte Rapado" },
  { value: "rebaje", label: "Rebaje Comercial (1 cm de largo parejo)" },
  { value: "tijera", label: "Corte con Tijera / Estilo de la raza" },
];

export function PetInfoStep({ formData, update, onNext }: PetInfoStepProps) {
  const [error, setError] = useState<string | null>(null);
  const [corteError, setCorteError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showCorte = formData.service === "bath_cut";

  const handleContinue = () => {
    if (!formData.petName || formData.petName.trim().length < 3) {
      setError("El nombre de la mascota debe tener al menos 3 caracteres.");
      return;
    }
    if (!formData.service) {
      setError("Selecciona un servicio principal.");
      return;
    }
    if (showCorte && !formData.corteType) {
      setCorteError("Selecciona un tipo de corte.");
      return;
    }
    setError(null);
    setCorteError(null);
    onNext();
  };

  const toggleExtra = (value: string) => {
    const current = formData.extraServices || [];
    if (current.includes(value)) {
      update("extraServices", current.filter((s) => s !== value));
    } else {
      update("extraServices", [...current, value]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      update("corteImage", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    update("corteImage", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Nombre de la mascota
        </label>
        <input
          type="text"
          value={formData.petName || ""}
          onChange={(e) => {
            if (error) setError(null);
            update("petName", e.target.value);
          }}
          placeholder="Ej: Firulais"
          className={`w-full rounded-xl border px-4 py-3 text-gray-800 outline-none transition-colors focus:ring-2 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 font-medium">
            {error}
          </p>
        )}
      </div>

      <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">
        ¿Qué servicio necesita?
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {SERVICE_OPTIONS.map(({ value, label, icon: Icon }) => {
          const selected = formData.service === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => {
                setError(null);
                setCorteError(null);
                update("service", value);
                if (value !== "bath_cut") {
                  update("corteType", null);
                  update("corteSpecs", "");
                  update("corteImage", "");
                }
              }}
              className={`flex cursor-pointer flex-col items-center gap-5 rounded-2xl border-2 p-10 transition-all duration-200 ${
                selected
                  ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                  : "border-gray-200 bg-white shadow-sm hover:border-blue-300 hover:shadow-md hover:shadow-gray-200"
              }`}
            >
              <Icon
                className={`h-20 w-20 transition-colors ${
                  selected ? "text-blue-600" : "text-gray-600"
                }`}
              />
              <span
                className={`text-xl font-semibold ${
                  selected ? "text-blue-700" : "text-gray-700"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showCorte ? "mt-10 max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-2xl border border-sky-200 bg-sky-50/70 backdrop-blur-sm p-6 shadow-sm">
          <h3 className="mb-6 text-center text-xl font-bold text-gray-800">
            Detalles del Corte
          </h3>

          <div className="mb-6">
            <p className="mb-3 text-sm font-semibold text-gray-700">
              Tipo de corte
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {CORTE_OPTIONS.map(({ value, label }) => {
                const selected = formData.corteType === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setCorteError(null);
                      update("corteType", value);
                    }}
                    className={`cursor-pointer rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      selected
                          ? "border-sky-500 bg-sky-100 text-sky-800 shadow-md"
                          : "border-sky-200 bg-white text-gray-600 hover:border-sky-300 hover:bg-sky-50"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {corteError && (
              <p className="mt-2 text-sm text-red-600 font-medium">
                {corteError}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Especificaciones del corte
            </label>
            <textarea
              value={formData.corteSpecs || ""}
              onChange={(e) => update("corteSpecs", e.target.value)}
              placeholder="Ej: Dejar punta de cola tipo pompón, no tocar bigotes, no cortar mucho las orejas..."
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-700">
            ⚠️ Importante: Las mascotas con nudos o pelaje sumamente
            motado, por bienestar de la mascotita, podrían requerir obligatoriamente un
            corte rapado. El groomer evaluará el estado real del pelaje al
            recibir a la mascota.
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Foto referencial
            </label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-sky-300 bg-white px-5 py-3 text-sm font-medium text-gray-600 transition-all hover:border-sky-500 hover:text-sky-600"
              >
                <Upload className="h-5 w-5" />
                Subir foto
              </button>
              {formData.corteImage && (
                <div className="relative">
                  <img
                    src={formData.corteImage}
                    alt="Referencia de corte"
                    className="h-16 w-16 rounded-lg border border-gray-300 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -right-2 -top-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white shadow transition-colors hover:bg-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="mb-4 text-center text-lg font-semibold text-gray-700">
          Servicios adicionales
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {EXTRA_OPTIONS.map(({ value, label }) => {
            const checked = (formData.extraServices || []).includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleExtra(value)}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 text-sm font-medium transition-all duration-200 ${
                  checked
                      ? "border-sky-500 bg-sky-100 text-sky-800 shadow-md"
                      : "border-sky-200 bg-white text-gray-600 hover:border-sky-300 hover:bg-sky-50"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-md border-2 text-xs font-bold transition-all ${
                    checked
                        ? "border-sky-500 bg-sky-500 text-white"
                        : "border-sky-200 bg-white text-transparent"
                  }`}
                >
                  ✓
                </span>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="mt-10 w-full cursor-pointer rounded-xl bg-blue-600 py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-blue-700"
      >
        Continuar
      </button>
    </div>
  );
}