import { Waves, TriangleAlert } from "lucide-react";
import type { FormData } from "../BookingWizard";

interface AddressStepProps {
  formData: FormData;
  update: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  onNext: () => void;
  onBack?: () => void;
  onAddAnother?: () => void;
  onContinue?: () => void;
}

const OPTIONS = [
  { value: "normal" as const, label: "Normal / Sin nudos", icon: Waves },
  { value: "knotted" as const, label: "Con nudos / Enmarañado", icon: TriangleAlert },
];

export function AddressStep({ formData, update, onNext }: AddressStepProps) {
  const handleSelect = (value: "normal" | "knotted") => {
    update("coat", value);
    onNext();
  };

  return (
    <div>
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">
        ¿Cómo está el pelaje?
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {OPTIONS.map(({ value, label, icon: Icon }) => {
          const selected = formData.coat === value;
          return (
            <button
              key={value}
              onClick={() => handleSelect(value)}
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
    </div>
  );
}