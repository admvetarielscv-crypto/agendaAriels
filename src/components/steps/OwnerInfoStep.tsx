import { Rat, Dog, Tractor } from "lucide-react";
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
  { value: "small" as const, label: "2kg - 10kg", icon: Rat },
  { value: "medium" as const, label: "10kg - 20kg", icon: Dog },
  { value: "large" as const, label: "20kg - 30kg", icon: Tractor },
  
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
        {OPTIONS.map(({ value, label, icon: Icon }) => {
          const selected = formData.size === value;
          return (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={`flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 p-8 transition-all duration-200 ${
                selected
                  ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                  : "border-gray-200 bg-white shadow-sm hover:border-blue-300 hover:shadow-md hover:shadow-gray-200"
              }`}
            >
              <Icon
                className={`h-16 w-16 transition-colors ${
                  selected ? "text-blue-600" : "text-gray-600"
                }`}
              />
              <span
                className={`text-lg font-semibold ${
                  selected ? "text-blue-700" : "text-gray-700"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}