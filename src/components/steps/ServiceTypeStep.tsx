import { Dog, Cat } from "lucide-react";
import type { FormData } from "../BookingWizard";

interface ServiceTypeStepProps {
  formData: FormData;
  update: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  onNext: () => void;
  onBack?: () => void;
  onAddAnother?: () => void;
  onContinue?: () => void;
}

const OPTIONS = [
  { value: "dog" as const, label: "Perro", icon: Dog },
  { value: "cat" as const, label: "Gato", icon: Cat },
];

export function ServiceTypeStep({ formData, update, onNext }: ServiceTypeStepProps) {
  const handleSelect = (value: "dog" | "cat") => {
    update("petType", value);
    onNext();
  };

  return (
    <div>
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">
        ¿Qué tipo de mascota es?
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {OPTIONS.map(({ value, label, icon: Icon }) => {
          const selected = formData.petType === value;
          return (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={`flex cursor-pointer flex-col items-center gap-5 rounded-2xl border-2 p-10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] ${
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