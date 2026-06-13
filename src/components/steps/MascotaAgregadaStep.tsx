import { CheckCircle } from "lucide-react";
import type { FormData, PetData } from "../BookingWizard";

interface MascotaAgregadaStepProps {
  formData: FormData;
  update?: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  onNext?: () => void;
  onBack?: () => void;
  onAddAnother: () => void;
  onContinue: () => void;
}

const PET_TYPE_LABELS: Record<string, string> = { dog: "Perro", cat: "Gato" };
const SERVICE_LABELS: Record<string, string> = { bath: "Baño", bath_cut: "Baño + Corte" };
const SIZE_LABELS: Record<string, string> = { small: "Pequeño", medium: "Mediano", large: "Grande" };
const COAT_LABELS: Record<string, string> = { normal: "Normal / Sin nudos", knotted: "Con nudos / Enmarañado" };
const EXTRA_LABELS: Record<string, string> = { deworming: "Desparasitación", antiflea: "Antipulgas", vaccine: "Vacuna" };

export function MascotaAgregadaStep({ formData, onAddAnother, onContinue }: MascotaAgregadaStepProps) {
  const currentPet: PetData = {
    petType: formData.petType ?? "dog",
    service: formData.service ?? "bath",
    extraServices: formData.extraServices ?? [],
    size: formData.size ?? "small",
    coat: formData.coat ?? "normal",
    petNotes: formData.petNotes,
    petName: formData.petName,
  };

  const extraSummary =
    currentPet.extraServices.length > 0
      ? currentPet.extraServices.map((s) => EXTRA_LABELS[s] || s).join(", ")
      : null;

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <CheckCircle className="h-24 w-24 text-green-500" />
      <h2 className="text-center text-3xl font-bold text-gray-800">
        ¡Mascota agregada!
      </h2>
      <p className="text-center text-gray-500">
        {currentPet.petName || "Mascota"} — {PET_TYPE_LABELS[currentPet.petType]} | {SERVICE_LABELS[currentPet.service]} | {SIZE_LABELS[currentPet.size]} | {COAT_LABELS[currentPet.coat]}
        {extraSummary && <> | {extraSummary}</>}
      </p>

      <div className="mt-4 flex w-full flex-col gap-4">
        <button
          onClick={onAddAnother}
          className="w-full cursor-pointer rounded-xl border-2 border-blue-500 bg-white py-4 text-lg font-semibold text-blue-600 transition-all hover:bg-blue-50"
        >
          Agregar otra mascota
        </button>
        <button
          onClick={onContinue}
          className="w-full cursor-pointer rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white shadow-md transition-all hover:bg-blue-700"
        >
          Continuar con el recojo
        </button>
      </div>
    </div>
  );
}