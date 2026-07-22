import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  MapPin,
  ExternalLink,
  Loader2,
  Phone,
  PhoneCall,
  Calendar,
  Clock,
  Info,
  User,
  ShieldCheck,
  Check,
  Scissors,
  Droplets,
  StickyNote,
  Pill,
  Bug,
  Syringe,
  FlaskConical,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { FormData, PetData } from "../BookingWizard";
import { BRANCH_BY_VALUE } from "../../data/branches";
import {
  PET_TYPE_LABELS,
  SERVICE_LABELS,
  SIZE_LABELS,
  TIME_LABELS,
  formatExtraLabel,
  CORTE_LABELS,
  BATH_LABELS,
  PERFUME_LABELS,
  BRANCH_LABELS,
} from "../../data/labels";
import { submitBooking } from "../../services/submitBooking";

interface ConfirmationStepProps {
  formData: FormData;
  onBack?: () => void;
  update?: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  onNext?: () => void;
  onAddAnother?: () => void;
  onContinue?: () => void;
}

type SubmitState = "idle" | "loading" | "success" | "error";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return format(d, "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
}

function stripEmoji(s: string): string {
  return s.replace(/^[^\wáéíóúÁÉÍÓÚñÑ]+/, "").trim();
}

function getInitials(name: string, fallback: string): string {
  if (!name) return fallback;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const EXTRA_ICON: Record<string, LucideIcon> = {
  deworming: Pill,
  antiflea: Bug,
  vaccine: Syringe,
};

function ServiceItem({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 text-sm text-gray-700">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Icon className="h-4 w-4" />
      </span>
      <span className="leading-snug">{children}</span>
    </li>
  );
}

function PetCard({ pet, index }: { pet: PetData; index: number }) {
  const name = pet.petName || `Mascota ${index + 1}`;
  const initials = name.slice(0, 1).toUpperCase();
  const subtitle = [
    PET_TYPE_LABELS[pet.petType],
    pet.size ? SIZE_LABELS[pet.size] : null,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group flex flex-col gap-5 rounded-[22px] border border-gray-100/80 bg-white p-6 shadow-[0_10px_30px_-12px_rgba(29,78,216,0.15)] transition-all duration-250 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(29,78,216,0.22)] sm:p-7"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-blue text-xl font-semibold text-white shadow-md shadow-blue-200/50">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xl font-bold tracking-tight text-gray-900">{name}</p>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>

      <ul className="space-y-3">
        <ServiceItem icon={Sparkles}>{SERVICE_LABELS[pet.service]}</ServiceItem>
        {pet.bathType && BATH_LABELS[pet.bathType] && (
          <ServiceItem icon={Droplets}>{BATH_LABELS[pet.bathType]}</ServiceItem>
        )}
        {pet.service === "bath_cut" && pet.corteType && CORTE_LABELS[pet.corteType] && (
          <ServiceItem icon={Scissors}>{CORTE_LABELS[pet.corteType]}</ServiceItem>
        )}
        {pet.service === "bath_cut" && pet.corteSpecs && (
          <ServiceItem icon={StickyNote}>{pet.corteSpecs}</ServiceItem>
        )}
        {pet.service === "bath_cut" && pet.corteImage && (
          <li className="mt-1">
            <img
              src={pet.corteImage}
              alt="Referencia de corte"
              className="h-20 w-20 rounded-2xl border border-gray-100 object-cover"
            />
          </li>
        )}
        {pet.extraServices && pet.extraServices.length > 0 && (
          <>
            {pet.extraServices.map((extra, i) => {
              const Icon = EXTRA_ICON[extra.service] ?? Pill;
              return (
                <ServiceItem key={i} icon={Icon}>
                  {formatExtraLabel(extra)}
                </ServiceItem>
              );
            })}
          </>
        )}
        {pet.perfume && PERFUME_LABELS[pet.perfume] && (
          <ServiceItem icon={FlaskConical}>{stripEmoji(PERFUME_LABELS[pet.perfume])}</ServiceItem>
        )}
        {pet.petNotes && (
          <ServiceItem icon={StickyNote}>{pet.petNotes}</ServiceItem>
        )}
      </ul>
    </motion.div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[18px] border border-[#E8EEF7] bg-white p-6 shadow-[0_1px_3px_rgba(16,24,40,0.04),0_8px_24px_-12px_rgba(16,24,40,0.06)] sm:p-7">
      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export function ConfirmationStep({ formData, onBack: _onBack }: ConfirmationStepProps) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string>("");

  const branch = formData.branch ? BRANCH_BY_VALUE[formData.branch] : null;
  const branchPhone = branch?.phone ?? null;

  const handleSubmit = async () => {
    if (submitState === "loading") return;
    setSubmitState("loading");
    setSubmitError("");
    const result = await submitBooking(formData);
    if (result.ok) {
      setSubmitState("success");
    } else {
      setSubmitState("error");
      setSubmitError(result.error ?? "Ocurrió un error inesperado");
    }
  };

  if (submitState === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <motion.img
          src="/images/vetMascot/agendado.png"
          alt="Bulldog feliz manejando la movilidad"
          className="h-auto w-72 object-contain sm:w-[28rem]"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <h2 className="text-center text-[var(--text-step-title)] font-bold tracking-tight text-green-700">
          ¡Solicitud enviada con éxito!
        </h2>
        <p className="text-center text-gray-500">
          Su mascotita ya fue agendada. Estaremos en contacto con usted cuando pasen por su domicilio. Recordarle que la movilidad sólo podrá esperar fuera de su domicilio 5 minutos luego de la primera llamada 🐾🐶🐱
        </p>
      </div>
    );
  }

  if (submitState === "error") {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <motion.img
          src="/images/vetMascot/errorAgenda.png"
          alt="Bulldog mirando con cara preocupada"
          className="h-auto w-72 object-contain sm:w-[28rem]"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <h2 className="text-2xl font-bold tracking-tight text-red-600">
          No se pudo enviar la solicitud
        </h2>
        <p className="text-center text-sm text-gray-500">
          {submitError}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => setSubmitState("idle")}
            className="cursor-pointer rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
          >
            Reintentar
          </button>
          {branchPhone && (
            <a
              href={`tel:${branchPhone.replace(/\s/g, "")}`}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-blue-200 bg-white px-6 py-3 text-base font-semibold text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98]"
            >
              <Phone className="h-5 w-5" />
              Llámanos
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <h2 className="mb-2 text-[var(--text-step-title)] font-display font-bold tracking-tight text-gray-900">
          Revisa y confirma tu reserva
        </h2>
        <p className="mx-auto max-w-md text-sm text-gray-500">
          Verifica que toda la información sea correcta antes de confirmar la reserva.
        </p>
      </motion.div>

      {branch && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="relative min-h-[180px] overflow-hidden rounded-[20px] shadow-xl shadow-blue-900/20 sm:min-h-[190px]"
        >
          <img
            src={branch.image}
            alt={branch.label}
            className="absolute inset-0 h-full w-full scale-105 object-cover blur-[2px] saturate-[0.6]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-blue-900/65 to-blue-900/30" />
          <div className="relative flex h-full min-h-[180px] flex-col justify-center p-5 sm:min-h-[190px] sm:p-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5" />
              Sede seleccionada
            </span>
            <h3 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {BRANCH_LABELS[formData.branch!]}
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-blue-50">
              <p className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-white" />
                {branch.address}
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-white" />
                {branch.phone}
              </p>
            </div>
          </div>
        </motion.section>
      )}

      <SectionCard title="Mascotas Agendadas" icon={Sparkles}>
        {formData.pets.length === 0 ? (
          <p className="text-sm text-gray-500">No hay mascotas registradas.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {formData.pets.map((pet, i) => (
              <PetCard key={i} pet={pet} index={i} />
            ))}
          </div>
        )}
      </SectionCard>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-stretch">
        <SectionCard title="Agenda" icon={Calendar}>
        <div className="grid grid-cols-1 gap-1">
          <div className="flex items-start gap-4 rounded-[14px] border border-[#DCEBFF] bg-[#F7FBFF] p-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
              <Calendar className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Fecha</p>
              <p className="mt-1 text-base font-semibold text-[#0F172A]">
                {formData.date ? formatDate(formData.date) : "-"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-[14px] border border-[#DCEBFF] bg-[#F7FBFF] p-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
              <Clock className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Horario</p>
              <p className="mt-1 text-base font-semibold text-[#0F172A]">
                {TIME_LABELS[formData.timeRange ?? ""] ?? "-"}
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Datos del cliente" icon={User}>
        <div className="flex items-start gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-blue text-lg font-semibold text-white shadow-md shadow-blue-200/50">
            {getInitials(formData.ownerName, "--")}
          </div>
          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
                <User className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Nombre</p>
                <p className="mt-1 truncate text-sm font-semibold text-[#0F172A]">{formData.ownerName || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
                <Phone className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Teléfono</p>
                <p className="mt-1 truncate text-sm font-semibold text-[#0F172A]">{formData.ownerPhone || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:col-span-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
                <MapPin className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Dirección</p>
                <div className="mt-1 flex items-start gap-2">
                  <p className="text-sm font-semibold text-[#0F172A]">{formData.ownerAddress || "-"}</p>
                  {formData.ownerLat && formData.ownerLng && (
                    <a
                      href={`https://www.google.com/maps?q=${formData.ownerLat},${formData.ownerLng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 flex shrink-0 items-center gap-1 text-[#2563EB] transition-colors hover:text-[#1d4ed8]"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            {formData.mobilityPhoneDifferent && formData.mobilityPhone && (
              <div className="flex items-start gap-3 sm:col-span-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
                  <PhoneCall className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Tel. movilidad</p>
                  <p className="mt-1 truncate text-sm font-semibold text-[#0F172A]">{formData.mobilityPhone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </SectionCard>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-start gap-3 rounded-[18px] border border-blue-100 bg-blue-50/50 p-4"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-brand-blue">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-gray-800">
            Tu reserva quedará confirmada al presionar el botón.
          </p>
          <p className="mt-0.5 text-sm text-gray-500">
            Te enviaremos una confirmación por WhatsApp con todos los detalles.
          </p>
        </div>
      </motion.div>

      <button
        onClick={handleSubmit}
        disabled={submitState === "loading"}
        className={`flex min-h-[60px] w-full items-center justify-center gap-2.5 rounded-2xl text-lg font-bold text-white transition-all ${
          submitState === "loading"
            ? "cursor-wait bg-blue-400"
            : "cursor-pointer bg-brand-blue hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200/50 hover:-translate-y-0.5 active:scale-[0.98]"
        }`}
      >
        {submitState === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Enviando...
          </span>
        ) : (
          <>
            <Check className="h-5 w-5" />
            Confirmar Reserva
          </>
        )}
      </button>
      <p className="text-center text-xs text-gray-500">
        No se realizará ningún cobro en este momento.
      </p>
    </div>
  );
}
