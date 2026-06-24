import { Dog } from "lucide-react";
import type { FormData } from "../BookingWizard";

interface OwnerInfoStepProps {
  formData: FormData;
  update: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  onNext: () => void;
  onBack: () => void;
  onAddAnother?: () => void;
  onContinue?: () => void;
}

const OPTIONS = [
  {
    value: "small" as const,
    label: "Pequeño",
    weight: "2 – 10 kg",
    iconSize: "h-11 w-11",
    iconStroke: 1.5,
  },
  {
    value: "medium" as const,
    label: "Mediano",
    weight: "10 – 20 kg",
    iconSize: "h-16 w-16",
    iconStroke: 1.5,
  },
  {
    value: "large" as const,
    label: "Grande",
    weight: "20 – 30 kg",
    iconSize: "h-20 w-20",
    iconStroke: 1.5,
  },
];

export function OwnerInfoStep({ formData, update, onNext }: OwnerInfoStepProps) {
  const handleSelect = (value: "small" | "medium" | "large") => {
    update("size", value);
    onNext();
  };

  return (
    <div>
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">
        ¿Qué tamaño tiene tu mascota?
      </h2>
      <div className="grid grid-cols-3 gap-5">
        {OPTIONS.map(({ value, label, weight, iconSize, iconStroke }) => {
          const selected = formData.size === value;
          return (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] ${
                selected
                  ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                  : "border-gray-200 bg-white shadow-sm hover:border-blue-300 hover:shadow-md hover:shadow-gray-200"
              }`}
            >
              <Dog
                strokeWidth={iconStroke}
                className={`${iconSize} transition-colors ${
                  selected ? "text-blue-600" : "text-gray-600"
                }`}
              />
              <span
                className={`text-base font-bold ${
                  selected ? "text-blue-700" : "text-gray-700"
                }`}
              >
                {label}
              </span>
              <span className="text-xs text-gray-500">{weight}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}