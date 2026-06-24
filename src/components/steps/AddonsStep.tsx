import { Sun, Sunset } from "lucide-react";
import type { FormData } from "../BookingWizard";

interface AddonsStepProps {
  formData: FormData;
  update: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  onNext: () => void;
  onBack: () => void;
  onAddAnother?: () => void;
  onContinue?: () => void;
}

const OPTIONS = [
  { value: "9-11" as const, label: "9:00 am – 11:00 am", sub: "Turno mañana", icon: Sun },
  { value: "11-14" as const, label: "11:00 am – 2:00 pm", sub: "Turno mediodía", icon: Sunset },
];

export function AddonsStep({ formData, update, onNext }: AddonsStepProps) {
  const handleSelect = (value: "9-11" | "11-14") => {
    update("timeRange", value);
    onNext();
  };

  return (
    <div>
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">
        Elige un horario de recojo
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {OPTIONS.map(({ value, label, sub, icon: Icon }) => {
          const selected = formData.timeRange === value;
          return (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={`flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 p-10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] ${
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
                className={`text-xl font-semibold ${
                  selected ? "text-blue-700" : "text-gray-700"
                }`}
              >
                {label}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  selected
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}