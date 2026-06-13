import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { ServiceTypeStep } from "./steps/ServiceTypeStep";
import { PetInfoStep } from "./steps/PetInfoStep";
import { OwnerInfoStep } from "./steps/OwnerInfoStep";
import { AddressStep } from "./steps/AddressStep";
import { MascotaAgregadaStep } from "./steps/MascotaAgregadaStep";
import { ScheduleStep } from "./steps/ScheduleStep";
import { AddonsStep } from "./steps/AddonsStep";
import { ReviewStep } from "./steps/ReviewStep";
import { ConfirmationStep } from "./steps/ConfirmationStep";

export interface PetData {
  petType: "dog" | "cat";
  service: "bath" | "bath_cut";
  extraServices: string[];
  size: "small" | "medium" | "large";
  coat: "normal" | "knotted";
  petNotes: string;
  petName: string;
  corteType: "rapado" | "rebaje" | "tijera" | null;
  corteSpecs: string;
  corteImage: string;
}

export interface FormData {
  petType: "dog" | "cat" | null;
  service: "bath" | "bath_cut" | null;
  extraServices: string[];
  size: "small" | "medium" | "large" | null;
  coat: "normal" | "knotted" | null;
  petNotes: string;
  petName: string;
  corteType: "rapado" | "rebaje" | "tijera" | null;
  corteSpecs: string;
  corteImage: string;
  pets: PetData[];
  date: string | null;
  timeRange: "9-11" | "11-14" | null;
  ownerName: string;
  ownerPhone: string;
  ownerAddress: string;
  hasHistory: boolean | null;
  ownerDni: string;
  registeredPetName: string;
  registeredPhone: string;
  petBirthDate: string;
  petSpecies: "dog" | "cat" | null;
  petBreed: string;
  petCastrated: boolean;
  mobilityPhoneDifferent: boolean;
  mobilityPhone: string;
}

const INITIAL_PET_FIELDS = {
  petType: null as "dog" | "cat" | null,
  service: null as "bath" | "bath_cut" | null,
  extraServices: [] as string[],
  size: null as "small" | "medium" | "large" | null,
  coat: null as "normal" | "knotted" | null,
  petNotes: "",
  petName: "",
  corteType: null as "rapado" | "rebaje" | "tijera" | null,
  corteSpecs: "",
  corteImage: "",
};

const STEPS = [
  ServiceTypeStep,
  PetInfoStep,
  OwnerInfoStep,
  AddressStep,
  MascotaAgregadaStep,
  ScheduleStep,
  AddonsStep,
  ReviewStep,
  ConfirmationStep,
] as const;

const STEP_LABELS = [
  "Tipo de mascota",
  "Servicio",
  "Tamaño",
  "Pelaje",
  "Mascota Agregada",
  "Fecha",
  "Horario",
  "Tus datos",
  "Resumen",
];

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    ...INITIAL_PET_FIELDS,
    corteType: null,
    corteSpecs: "",
    corteImage: "",
    pets: [],
    date: null,
    timeRange: null,
    ownerName: "",
    ownerPhone: "",
    ownerAddress: "",
    hasHistory: null,
    ownerDni: "",
    registeredPetName: "",
    registeredPhone: "",
    petBirthDate: "",
    petSpecies: null,
    petBreed: "",
    petCastrated: false,
    mobilityPhoneDifferent: false,
    mobilityPhone: "",
  });

  const StepComponent = STEPS[currentStep];
  const totalSteps = STEPS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const saveCurrentPet = () => {
    if (!formData.petType || !formData.service || !formData.size || !formData.coat) return;
    const pet: PetData = {
      petType: formData.petType,
      service: formData.service,
      extraServices: formData.extraServices,
      size: formData.size,
      coat: formData.coat,
      petNotes: formData.petNotes,
      petName: formData.petName,
      corteType: formData.corteType,
      corteSpecs: formData.corteSpecs,
      corteImage: formData.corteImage,
    };
    setFormData((prev) => ({ ...prev, pets: [...prev.pets, pet] }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => {
      if (prev === 5) {
        setFormData((f) => ({ ...f, pets: f.pets.slice(0, -1) }));
        return 3;
      }
      return Math.max(prev - 1, 0);
    });
  };

  const handleAddAnother = () => {
    saveCurrentPet();
    setFormData((prev) => ({ ...prev, ...INITIAL_PET_FIELDS }));
    setCurrentStep(0);
  };

  const handleContinue = () => {
    saveCurrentPet();
    setCurrentStep(5);
  };

  const update = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
              <span className="font-medium text-gray-700">
                Paso {currentStep + 1} de {totalSteps}
              </span>
              <span>{STEP_LABELS[currentStep]}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <StepComponent
            formData={formData}
            update={update}
            onNext={handleNext}
            onBack={handleBack}
            onAddAnother={handleAddAnother}
            onContinue={handleContinue}
          />

          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="mt-8 flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-800"
            >
              <ChevronLeft className="h-4 w-4" />
              Volver atrás
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
