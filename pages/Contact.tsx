import React, { FormEvent, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  ADD_ON_OPTIONS,
  BEDROOM_OPTIONS,
  BATHROOM_OPTIONS,
  BUDGET_RANGE_OPTIONS,
  CLEANING_FREQUENCY_OPTIONS,
  CONTACT_METHOD_OPTIONS,
  CONTACT_STEPS,
  CONTACT_TIME_OPTIONS,
  ContactFormState,
  ContactStepId,
  FURNISHED_STATUS_OPTIONS,
  GUEST_CAPACITY_OPTIONS,
  getServiceLabel,
  humanizeSourceTag,
  INITIAL_CONTACT_FORM_STATE,
  INQUIRY_TYPE_OPTIONS,
  INSPECTION_OPTIONS,
  LISTING_STATUS_OPTIONS,
  MANAGEMENT_COORDINATION_OPTIONS,
  MANAGEMENT_SETUP_OPTIONS,
  PAYMENT_COORDINATION_OPTIONS,
  parseServiceParam,
  PHOTOGRAPHY_PACKAGE_OPTIONS,
  PHOTOGRAPHY_VISUALS_OPTIONS,
  PROJECT_WINDOW_OPTIONS,
  PROPERTY_COUNT_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
  RESERVATION_PLATFORM_OPTIONS,
  SERVICE_OPTIONS,
  Service,
  URGENCY_OPTIONS,
  VISUAL_MEDIA_SERVICES,
} from '@/lib/contact-intake';
import { cn } from '@/lib/utils';

type FormErrors = Partial<Record<keyof ContactFormState | 'services' | 'consent', string>>;

const CONTACT_EMAIL = 'mks.cyservices@gmail.com';
const CONTACT_PHONE = '+35799156137';

const SERVICE_FIELD_MAP: Record<Service, Array<keyof ContactFormState>> = {
  'reservations-hosting': [
    'reservationPlatformCoverage',
    'reservationGuestCommunicationNeeds',
    'reservationOccupancyGoals',
  ],
  'cleaning-preparation': [
    'cleaningTurnoverFrequency',
    'cleaningLaundryLinenNeeds',
    'cleaningWelcomePackExpectations',
  ],
  'property-management': [
    'managementMaintenanceCoordination',
    'managementInspections',
    'managementPaymentCoordination',
  ],
  'accessorising-design': [
    'designFurnishedStatus',
    'designScope',
    'designTargetAesthetic',
    'designRoomPriorities',
  ],
  photography: [
    'photographyPackageInterest',
    'photographyLaunchTimeline',
    'photographyCurrentVisualsStatus',
    'photographyAddOnInterest',
  ],
  'drone-video': [
    'photographyPackageInterest',
    'photographyLaunchTimeline',
    'photographyCurrentVisualsStatus',
    'photographyAddOnInterest',
  ],
};

const VISUAL_MEDIA_FIELDS = new Set<keyof ContactFormState>(SERVICE_FIELD_MAP.photography);

const STEP_FIELD_MAP: Record<ContactStepId, Array<keyof ContactFormState | 'services' | 'consent'>> = {
  serviceSelection: ['services', 'inquiryType'],
  clientDetails: [
    'fullName',
    'email',
    'phone',
    'preferredContactMethod',
    'preferredContactTime',
  ],
  propertyProfile: [
    'propertyLocation',
    'propertyType',
    'numberOfProperties',
    'bedrooms',
    'bathrooms',
    'guestCapacity',
    'listingStatus',
  ],
  currentSituation: [
    'currentManagementSetup',
    'existingBookingPlatforms',
    'biggestPainPoints',
    'targetOutcome',
  ],
  serviceDetails: [
    ...SERVICE_FIELD_MAP['reservations-hosting'],
    ...SERVICE_FIELD_MAP['cleaning-preparation'],
    ...SERVICE_FIELD_MAP['property-management'],
    ...SERVICE_FIELD_MAP['accessorising-design'],
    ...SERVICE_FIELD_MAP.photography,
  ],
  timelineBudget: ['desiredStartDate', 'urgency', 'budgetRange', 'idealProjectWindow'],
  finalNotes: ['consent'],
};

const PLACEHOLDER_ENDPOINT_PATTERNS = ['placeholder', 'your-form', 'your-form-id', 'example.com'];

const inputClassName =
  'w-full border border-brand-charcoal/12 bg-white px-4 py-3 text-sm text-brand-charcoal placeholder:text-brand-charcoal/35 transition focus:border-brand-charcoal focus:outline-none focus:ring-4 focus:ring-brand-charcoal/5';

function Contact() {
  const [searchParams] = useSearchParams();
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const [formState, setFormState] = useState<ContactFormState>(INITIAL_CONTACT_FORM_STATE);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const activeStep = CONTACT_STEPS[activeStepIndex];
  const selectedServiceLabels = formState.services.map((service) => getServiceLabel(service));
  const remainingSteps = Math.max(0, CONTACT_STEPS.length - activeStepIndex - 1);
  const hasVisualMediaSelection = formState.services.some((service) =>
    VISUAL_MEDIA_SERVICES.includes(service),
  );

  const rawFormspreeEndpoint = (import.meta.env.VITE_FORMSPREE_CONTACT_ENDPOINT ?? '').trim();
  const formspreeEndpoint = rawFormspreeEndpoint;
  const formspreeConfigured =
    Boolean(formspreeEndpoint) &&
    PLACEHOLDER_ENDPOINT_PATTERNS.every((pattern) => !formspreeEndpoint.toLowerCase().includes(pattern));
  const formspreeConfigMessage =
    'Live submission is disabled until `VITE_FORMSPREE_CONTACT_ENDPOINT` is set to a real Formspree endpoint.';

  useEffect(() => {
    const serviceFromQuery = parseServiceParam(searchParams.get('service'));
    const packageFromQuery = searchParams.get('package')?.trim() ?? '';
    const sourceFromQuery = searchParams.get('source')?.trim() ?? '';
    const impliedService = serviceFromQuery ?? (packageFromQuery ? 'photography' : null);

    if (!impliedService && !packageFromQuery && !sourceFromQuery) {
      return;
    }

    setHasStarted(true);
    setFormState((previous) => {
      const nextServices = impliedService && !previous.services.includes(impliedService)
        ? [...previous.services, impliedService]
        : previous.services;

      const nextState: ContactFormState = {
        ...previous,
        services: nextServices,
        photographyPackageInterest:
          packageFromQuery && !previous.photographyPackageInterest
            ? packageFromQuery
            : previous.photographyPackageInterest,
        sourceTag: sourceFromQuery || previous.sourceTag,
      };

      return nextState;
    });
  }, [searchParams]);

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const beginJourney = () => {
    setHasStarted(true);
    scrollToForm();
  };

  const updateField = <K extends keyof ContactFormState>(field: K, value: ContactFormState[K]) => {
    setFormState((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => {
      if (!previous[field] && !(field === 'consent' && previous.consent)) {
        return previous;
      }

      const nextErrors = { ...previous };
      delete nextErrors[field];

      if (field === 'consent') {
        delete nextErrors.consent;
      }

      return nextErrors;
    });

    if (submitError) {
      setSubmitError(null);
    }
  };

  const toggleService = (service: Service) => {
    const isSelected = formState.services.includes(service);
    const nextServices = isSelected
      ? formState.services.filter((item) => item !== service)
      : [...formState.services, service];

    setFormState((previous) => ({
      ...previous,
      services: nextServices,
    }));

    setErrors((previous) => {
      const nextErrors = { ...previous };
      delete nextErrors.services;

      if (!isSelected) {
        return nextErrors;
      }

      const otherVisualMediaStillSelected = nextServices.some((item) =>
        VISUAL_MEDIA_SERVICES.includes(item),
      );

      SERVICE_FIELD_MAP[service].forEach((field) => {
        if (VISUAL_MEDIA_FIELDS.has(field) && otherVisualMediaStillSelected) {
          return;
        }

        delete nextErrors[field];
      });

      return nextErrors;
    });

    if (submitError) {
      setSubmitError(null);
    }
  };

  const applyStepErrors = (stepId: ContactStepId, nextErrors: FormErrors) => {
    setErrors((previous) => {
      const cleared = { ...previous };

      STEP_FIELD_MAP[stepId].forEach((field) => {
        delete cleared[field];
      });

      return {
        ...cleared,
        ...nextErrors,
      };
    });
  };

  const goToNextStep = () => {
    const nextErrors = validateStep(activeStep.id, formState);
    applyStepErrors(activeStep.id, nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setActiveStepIndex((previous) => Math.min(previous + 1, CONTACT_STEPS.length - 1));
    setSubmitError(null);
    scrollToForm();
  };

  const goToPreviousStep = () => {
    if (activeStepIndex === 0) {
      setHasStarted(false);
      scrollToForm();
      return;
    }

    setActiveStepIndex((previous) => Math.max(previous - 1, 0));
    setSubmitError(null);
    scrollToForm();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateStep('finalNotes', formState);
    applyStepErrors('finalNotes', nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (!formspreeConfigured) {
      setSubmitError(formspreeConfigMessage);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(buildSubmissionPayload(formState)),
      });

      const responseBody = (await response.json().catch(() => null)) as
        | { error?: string; errors?: Array<{ message?: string }> }
        | null;

      if (!response.ok) {
        throw new Error(getSubmissionErrorMessage(responseBody));
      }

      if (responseBody?.error || responseBody?.errors?.length) {
        throw new Error(getSubmissionErrorMessage(responseBody));
      }

      setIsSuccess(true);
      scrollToForm();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'We could not send the inquiry just now. Your answers are still here, so you can try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const sourceSummary = formState.sourceTag ? humanizeSourceTag(formState.sourceTag) : '';
  const inquiryTypeLabel =
    INQUIRY_TYPE_OPTIONS.find((option) => option.value === formState.inquiryType)?.label ?? '';

  return (
    <div className="page-shell bg-white">
      <section className="relative overflow-hidden bg-brand-charcoal text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_32%)]" />
        <div className="absolute -left-20 top-24 h-56 w-56 rounded-full border border-white/10" />
        <div className="absolute right-[-3rem] top-16 h-64 w-64 rounded-full border border-white/10" />

        <div className="site-frame relative py-20 md:py-28">
          <div className="max-w-4xl">
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.34em] text-white/72">
              Contact • Concierge Intake
            </p>
            <h1 className="max-w-4xl text-5xl font-serif leading-[1.02] text-white md:text-7xl">
              A guided inquiry for owners, launches, refreshes, and one-off requests.
            </h1>
            <p className="mt-8 max-w-2xl font-light leading-loose text-white/78 text-lg">
              This is designed as a private concierge brief, not a generic contact form. Share
              the services you need, the condition of the property, and the outcome you want.
              We’ll tailor the follow-up around what you select.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button size="xl" variant="inverse" onClick={beginJourney}>
                <span>Begin Inquiry</span>
                <ArrowRight size={16} />
              </Button>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/24 px-6 py-4 text-[10px] font-medium uppercase tracking-[0.25em] text-white transition-colors hover:border-white/50 hover:bg-white/8"
              >
                <Mail size={16} />
                Email Directly
              </a>
            </div>
          </div>
        </div>
      </section>

      <section ref={formSectionRef} className="bg-[#f8f6f2] py-16 md:py-24">
        <div className="site-frame">
          <div className="grid gap-10 xl:grid-cols-[18.5rem_minmax(0,1fr)]">
            <aside className="space-y-6 xl:sticky xl:top-32 xl:self-start">
              <div className="border border-brand-charcoal/10 bg-white p-6">
                <p className="text-[10px] uppercase tracking-[0.28em] text-brand-charcoal/45">
                  Fallback
                </p>
                <div className="mt-5 space-y-4">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center gap-3 font-light text-brand-charcoal transition-colors hover:text-brand-charcoal/72"
                  >
                    <Mail size={18} className="text-brand-charcoal/55" />
                    {CONTACT_EMAIL}
                  </a>
                  <a
                    href={`tel:${CONTACT_PHONE}`}
                    className="flex items-center gap-3 font-light text-brand-charcoal transition-colors hover:text-brand-charcoal/72"
                  >
                    <Phone size={18} className="text-brand-charcoal/55" />
                    +357 99156137
                  </a>
                </div>

                {!formspreeConfigured && (
                  <div className="mt-6 border border-amber-600/20 bg-amber-50 px-4 py-4">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-amber-800">
                      Configuration needed
                    </p>
                    <p className="mt-2 font-light leading-relaxed text-amber-900/80">
                      {formspreeConfigMessage}
                    </p>
                  </div>
                )}
              </div>
            </aside>

            <div className="min-w-0">
              {!hasStarted ? (
                <div className="border border-brand-charcoal/10 bg-white p-8 shadow-[0_24px_80px_rgba(6,63,71,0.08)] md:p-12">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-brand-charcoal/45">
                    Begin When Ready
                  </p>
                  <h2 className="mt-5 max-w-3xl text-4xl font-serif leading-tight text-brand-charcoal md:text-5xl">
                    Tell us the service mix, the property context, and the outcome you want.
                  </h2>
                  <p className="mt-6 max-w-2xl font-light leading-loose text-brand-charcoal/72">
                    Once you begin, the page keeps everything in one guided flow. You can move
                    forward and back without losing answers, and the detailed questions only appear
                    for the services you select.
                  </p>

                  <div className="mt-10 grid gap-4 md:grid-cols-2">
                    {CONTACT_STEPS.map((step, index) => (
                      <div key={step.id} className="border border-brand-charcoal/10 bg-[#f8f6f2] p-5">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-brand-charcoal/40">
                          Step {index + 1}
                        </p>
                        <p className="mt-3 text-lg font-serif text-brand-charcoal">{step.label}</p>
                        <p className="mt-2 font-light leading-relaxed text-brand-charcoal/68">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10">
                    <Button size="xl" onClick={beginJourney}>
                      <span>Begin Inquiry</span>
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              ) : isSuccess ? (
                <div className="border border-brand-charcoal/10 bg-white p-8 shadow-[0_24px_80px_rgba(6,63,71,0.08)] md:p-12">
                  <div className="flex items-start justify-between gap-6 border-b border-brand-charcoal/10 pb-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-brand-charcoal/45">
                        Inquiry received
                      </p>
                      <h2 className="mt-4 text-4xl font-serif text-brand-charcoal md:text-5xl">
                        Thank you, {formState.fullName || 'we have your brief'}.
                      </h2>
                      <p className="mt-5 max-w-2xl font-light leading-loose text-brand-charcoal/72">
                        Your {selectedServiceLabels.join(' + ')}
                        {inquiryTypeLabel ? ` ${inquiryTypeLabel.toLowerCase()}` : ' inquiry'} is now with
                        Mikaela. We’ll review the property context, selected services, and timing
                        before responding with next steps.
                      </p>
                    </div>
                    <ShieldCheck size={32} className="hidden text-brand-charcoal/35 md:block" />
                  </div>

                  <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-brand-charcoal/45">
                        Next steps
                      </p>
                      <ul className="mt-5 space-y-4">
                        <li className="flex items-start gap-3 font-light leading-relaxed text-brand-charcoal/72">
                          <CheckCircle2 size={18} className="mt-1 text-brand-charcoal/45" />
                          We review the selected service mix and the property profile you shared.
                        </li>
                        <li className="flex items-start gap-3 font-light leading-relaxed text-brand-charcoal/72">
                          <CheckCircle2 size={18} className="mt-1 text-brand-charcoal/45" />
                          We return with clarifying questions or a recommended next conversation.
                        </li>
                        <li className="flex items-start gap-3 font-light leading-relaxed text-brand-charcoal/72">
                          <CheckCircle2 size={18} className="mt-1 text-brand-charcoal/45" />
                          If photography or visual media was selected, we’ll factor in the package
                          context and launch timing you provided.
                        </li>
                      </ul>
                    </div>

                    <div className="border border-brand-charcoal/10 bg-[#f8f6f2] p-6">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-brand-charcoal/45">
                        Need a direct follow-up?
                      </p>
                      <div className="mt-5 space-y-4">
                        <a
                          href={`mailto:${CONTACT_EMAIL}`}
                          className="flex items-center gap-3 font-light text-brand-charcoal transition-colors hover:text-brand-charcoal/72"
                        >
                          <Mail size={18} className="text-brand-charcoal/55" />
                          {CONTACT_EMAIL}
                        </a>
                        <a
                          href={`tel:${CONTACT_PHONE}`}
                          className="flex items-center gap-3 font-light text-brand-charcoal transition-colors hover:text-brand-charcoal/72"
                        >
                          <Phone size={18} className="text-brand-charcoal/55" />
                          +357 99156137
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="border border-brand-charcoal/10 bg-white p-8 shadow-[0_24px_80px_rgba(6,63,71,0.08)] md:p-12"
                >
                  <div className="border-b border-brand-charcoal/10 pb-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                      <div className="max-w-3xl">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-brand-charcoal/45">
                          Step {activeStepIndex + 1}
                        </p>
                        <h2 className="mt-4 text-4xl font-serif text-brand-charcoal md:text-5xl">
                          {activeStep.label}
                        </h2>
                        <p className="mt-5 font-light leading-loose text-brand-charcoal/72">
                          {activeStep.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 border border-brand-charcoal/10 bg-[#f8f6f2] px-4 py-3 text-[10px] uppercase tracking-[0.24em] text-brand-charcoal/55">
                        <Clock3 size={15} />
                        {remainingSteps === 0 ? 'Final step' : `${remainingSteps} steps remaining`}
                      </div>
                    </div>
                  </div>

                  <div key={activeStep.id} className="concierge-step-enter pt-8">
                    {activeStep.id === 'serviceSelection' && (
                      <div className="space-y-10">
                        <section>
                          <div className="mb-5 max-w-2xl">
                            <p className="text-[10px] uppercase tracking-[0.28em] text-brand-charcoal/45">
                              Select one or more services
                            </p>
                            <p className="mt-3 font-light leading-relaxed text-brand-charcoal/68">
                              We’ll only show the follow-up detail that matches what you select.
                            </p>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            {SERVICE_OPTIONS.map((service, index) => {
                              const selected = formState.services.includes(service.value);

                              return (
                                <button
                                  key={service.value}
                                  type="button"
                                  onClick={() => toggleService(service.value)}
                                  className={cn(
                                    'group border px-5 py-5 text-left transition-all duration-300',
                                    selected
                                      ? 'border-brand-charcoal bg-brand-charcoal text-white shadow-[0_18px_40px_rgba(6,63,71,0.14)]'
                                      : 'border-brand-charcoal/10 bg-[#f8f6f2] hover:border-brand-charcoal/28 hover:bg-white',
                                  )}
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <p
                                        className={cn(
                                          'text-[10px] uppercase tracking-[0.28em]',
                                          selected ? 'text-white/70' : 'text-brand-charcoal/40',
                                        )}
                                      >
                                        Service {String(index + 1).padStart(2, '0')}
                                      </p>
                                      <p className="mt-3 text-xl font-serif">{service.label}</p>
                                      <p
                                        className={cn(
                                          'mt-2 font-light leading-relaxed',
                                          selected ? 'text-white/78' : 'text-brand-charcoal/68',
                                        )}
                                      >
                                        {service.hint}
                                      </p>
                                    </div>
                                    <span
                                      className={cn(
                                        'inline-flex h-8 w-8 items-center justify-center border text-[10px] uppercase tracking-[0.24em]',
                                        selected
                                          ? 'border-white/24 bg-white/8 text-white'
                                          : 'border-brand-charcoal/12 text-brand-charcoal/55',
                                      )}
                                    >
                                      {selected ? 'On' : 'Add'}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          {errors.services && (
                            <p className="mt-4 text-sm text-red-700">{errors.services}</p>
                          )}
                        </section>

                        <section>
                          <div className="mb-5 max-w-2xl">
                            <p className="text-[10px] uppercase tracking-[0.28em] text-brand-charcoal/45">
                              Inquiry type
                            </p>
                            <p className="mt-3 font-light leading-relaxed text-brand-charcoal/68">
                              This helps us understand whether you are launching, refreshing, or
                              scoping one focused service.
                            </p>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            {INQUIRY_TYPE_OPTIONS.map((option) => {
                              const selected = formState.inquiryType === option.value;

                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => updateField('inquiryType', option.value)}
                                  className={cn(
                                    'border px-5 py-5 text-left transition-all duration-300',
                                    selected
                                      ? 'border-brand-charcoal bg-brand-charcoal text-white'
                                      : 'border-brand-charcoal/10 bg-white hover:border-brand-charcoal/28',
                                  )}
                                >
                                  <p
                                    className={cn(
                                      'text-[10px] uppercase tracking-[0.28em]',
                                      selected ? 'text-white/70' : 'text-brand-charcoal/40',
                                    )}
                                  >
                                    Inquiry Type
                                  </p>
                                  <p className="mt-3 text-2xl font-serif">{option.label}</p>
                                </button>
                              );
                            })}
                          </div>
                          {errors.inquiryType && (
                            <p className="mt-4 text-sm text-red-700">{errors.inquiryType}</p>
                          )}
                        </section>
                      </div>
                    )}

                    {activeStep.id === 'clientDetails' && (
                      <div className="grid gap-6 md:grid-cols-2">
                        <TextField
                          label="Full name"
                          name="fullName"
                          value={formState.fullName}
                          onChange={(value) => updateField('fullName', value)}
                          error={errors.fullName}
                        />
                        <TextField
                          label="Email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={(value) => updateField('email', value)}
                          error={errors.email}
                        />
                        <TextField
                          label="Phone"
                          name="phone"
                          type="tel"
                          value={formState.phone}
                          onChange={(value) => updateField('phone', value)}
                          error={errors.phone}
                        />
                        <TextField
                          label="Company / brand"
                          name="companyBrand"
                          value={formState.companyBrand}
                          onChange={(value) => updateField('companyBrand', value)}
                          error={errors.companyBrand}
                          optional
                        />
                        <SelectField
                          label="Preferred contact method"
                          name="preferredContactMethod"
                          value={formState.preferredContactMethod}
                          onChange={(value) => updateField('preferredContactMethod', value)}
                          options={CONTACT_METHOD_OPTIONS}
                          error={errors.preferredContactMethod}
                        />
                        <SelectField
                          label="Preferred contact time"
                          name="preferredContactTime"
                          value={formState.preferredContactTime}
                          onChange={(value) => updateField('preferredContactTime', value)}
                          options={CONTACT_TIME_OPTIONS}
                          error={errors.preferredContactTime}
                        />
                      </div>
                    )}

                    {activeStep.id === 'propertyProfile' && (
                      <div className="grid gap-6 md:grid-cols-2">
                        <TextField
                          label="Property location"
                          name="propertyLocation"
                          value={formState.propertyLocation}
                          onChange={(value) => updateField('propertyLocation', value)}
                          error={errors.propertyLocation}
                          hint="City, area, or development name is enough for this stage."
                        />
                        <SelectField
                          label="Property type"
                          name="propertyType"
                          value={formState.propertyType}
                          onChange={(value) => updateField('propertyType', value)}
                          options={PROPERTY_TYPE_OPTIONS}
                          error={errors.propertyType}
                        />
                        <SelectField
                          label="Number of properties"
                          name="numberOfProperties"
                          value={formState.numberOfProperties}
                          onChange={(value) => updateField('numberOfProperties', value)}
                          options={PROPERTY_COUNT_OPTIONS}
                          error={errors.numberOfProperties}
                        />
                        <SelectField
                          label="Bedrooms"
                          name="bedrooms"
                          value={formState.bedrooms}
                          onChange={(value) => updateField('bedrooms', value)}
                          options={BEDROOM_OPTIONS}
                          error={errors.bedrooms}
                        />
                        <SelectField
                          label="Bathrooms"
                          name="bathrooms"
                          value={formState.bathrooms}
                          onChange={(value) => updateField('bathrooms', value)}
                          options={BATHROOM_OPTIONS}
                          error={errors.bathrooms}
                        />
                        <SelectField
                          label="Guest capacity"
                          name="guestCapacity"
                          value={formState.guestCapacity}
                          onChange={(value) => updateField('guestCapacity', value)}
                          options={GUEST_CAPACITY_OPTIONS}
                          error={errors.guestCapacity}
                        />
                        <SelectField
                          label="Listing / live status"
                          name="listingStatus"
                          value={formState.listingStatus}
                          onChange={(value) => updateField('listingStatus', value)}
                          options={LISTING_STATUS_OPTIONS}
                          error={errors.listingStatus}
                        />
                        <TextAreaField
                          label="Airbnb or booking links"
                          name="bookingLinks"
                          value={formState.bookingLinks}
                          onChange={(value) => updateField('bookingLinks', value)}
                          error={errors.bookingLinks}
                          hint="Optional. Paste one or several listing URLs."
                          optional
                          rows={5}
                        />
                      </div>
                    )}

                    {activeStep.id === 'currentSituation' && (
                      <div className="grid gap-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <SelectField
                            label="Current management setup"
                            name="currentManagementSetup"
                            value={formState.currentManagementSetup}
                            onChange={(value) => updateField('currentManagementSetup', value)}
                            options={MANAGEMENT_SETUP_OPTIONS}
                            error={errors.currentManagementSetup}
                          />
                          <TextAreaField
                            label="Existing booking platforms"
                            name="existingBookingPlatforms"
                            value={formState.existingBookingPlatforms}
                            onChange={(value) => updateField('existingBookingPlatforms', value)}
                            error={errors.existingBookingPlatforms}
                            hint="For example: Airbnb, Booking.com, direct bookings, Vrbo."
                            rows={4}
                          />
                        </div>

                        <TextAreaField
                          label="Biggest pain points"
                          name="biggestPainPoints"
                          value={formState.biggestPainPoints}
                          onChange={(value) => updateField('biggestPainPoints', value)}
                          error={errors.biggestPainPoints}
                          rows={4}
                        />
                        <TextAreaField
                          label="What is already working"
                          name="whatAlreadyWorking"
                          value={formState.whatAlreadyWorking}
                          onChange={(value) => updateField('whatAlreadyWorking', value)}
                          error={errors.whatAlreadyWorking}
                          hint="Optional, but helpful for protecting what is already strong."
                          optional
                          rows={4}
                        />
                        <TextAreaField
                          label="Target outcome"
                          name="targetOutcome"
                          value={formState.targetOutcome}
                          onChange={(value) => updateField('targetOutcome', value)}
                          error={errors.targetOutcome}
                          rows={4}
                        />
                      </div>
                    )}

                    {activeStep.id === 'serviceDetails' && (
                      <div className="grid gap-6">
                        {formState.services.includes('reservations-hosting') && (
                          <ServiceDetailCard
                            eyebrow="Reservations & Hosting"
                            title="Platform and guest communication brief"
                            copy="Tell us what coverage and guest support you want handled."
                          >
                            <div className="grid gap-6 md:grid-cols-2">
                              <SelectField
                                label="Platform coverage"
                                name="reservationPlatformCoverage"
                                value={formState.reservationPlatformCoverage}
                                onChange={(value) => updateField('reservationPlatformCoverage', value)}
                                options={RESERVATION_PLATFORM_OPTIONS}
                                error={errors.reservationPlatformCoverage}
                              />
                              <TextAreaField
                                label="Guest communication needs"
                                name="reservationGuestCommunicationNeeds"
                                value={formState.reservationGuestCommunicationNeeds}
                                onChange={(value) =>
                                  updateField('reservationGuestCommunicationNeeds', value)
                                }
                                error={errors.reservationGuestCommunicationNeeds}
                                rows={4}
                              />
                            </div>
                            <TextAreaField
                              label="Occupancy / review goals"
                              name="reservationOccupancyGoals"
                              value={formState.reservationOccupancyGoals}
                              onChange={(value) => updateField('reservationOccupancyGoals', value)}
                              error={errors.reservationOccupancyGoals}
                              rows={4}
                            />
                          </ServiceDetailCard>
                        )}

                        {formState.services.includes('cleaning-preparation') && (
                          <ServiceDetailCard
                            eyebrow="Cleaning & Preparation"
                            title="Turnover, linen, and arrival standards"
                            copy="Set the cadence and guest-ready expectations for every clean."
                          >
                            <div className="grid gap-6 md:grid-cols-2">
                              <SelectField
                                label="Turnover frequency"
                                name="cleaningTurnoverFrequency"
                                value={formState.cleaningTurnoverFrequency}
                                onChange={(value) => updateField('cleaningTurnoverFrequency', value)}
                                options={CLEANING_FREQUENCY_OPTIONS}
                                error={errors.cleaningTurnoverFrequency}
                              />
                              <TextAreaField
                                label="Laundry / linen needs"
                                name="cleaningLaundryLinenNeeds"
                                value={formState.cleaningLaundryLinenNeeds}
                                onChange={(value) => updateField('cleaningLaundryLinenNeeds', value)}
                                error={errors.cleaningLaundryLinenNeeds}
                                rows={4}
                              />
                            </div>
                            <TextAreaField
                              label="Welcome pack expectations"
                              name="cleaningWelcomePackExpectations"
                              value={formState.cleaningWelcomePackExpectations}
                              onChange={(value) =>
                                updateField('cleaningWelcomePackExpectations', value)
                              }
                              error={errors.cleaningWelcomePackExpectations}
                              rows={4}
                            />
                          </ServiceDetailCard>
                        )}

                        {formState.services.includes('property-management') && (
                          <ServiceDetailCard
                            eyebrow="Property Management"
                            title="Oversight and coordination scope"
                            copy="Clarify the level of maintenance, inspection, and coordination support needed."
                          >
                            <div className="grid gap-6 md:grid-cols-2">
                              <SelectField
                                label="Maintenance coordination"
                                name="managementMaintenanceCoordination"
                                value={formState.managementMaintenanceCoordination}
                                onChange={(value) =>
                                  updateField('managementMaintenanceCoordination', value)
                                }
                                options={MANAGEMENT_COORDINATION_OPTIONS}
                                error={errors.managementMaintenanceCoordination}
                              />
                              <SelectField
                                label="Inspections"
                                name="managementInspections"
                                value={formState.managementInspections}
                                onChange={(value) => updateField('managementInspections', value)}
                                options={INSPECTION_OPTIONS}
                                error={errors.managementInspections}
                              />
                            </div>
                            <SelectField
                              label="Payment / service coordination"
                              name="managementPaymentCoordination"
                              value={formState.managementPaymentCoordination}
                              onChange={(value) =>
                                updateField('managementPaymentCoordination', value)
                              }
                              options={PAYMENT_COORDINATION_OPTIONS}
                              error={errors.managementPaymentCoordination}
                            />
                          </ServiceDetailCard>
                        )}

                        {formState.services.includes('accessorising-design') && (
                          <ServiceDetailCard
                            eyebrow="Accessorising & Design"
                            title="Styling scope and aesthetic brief"
                            copy="Share the furnishing status, the desired feel, and which spaces matter most."
                          >
                            <div className="grid gap-6 md:grid-cols-2">
                              <SelectField
                                label="Furnished status"
                                name="designFurnishedStatus"
                                value={formState.designFurnishedStatus}
                                onChange={(value) => updateField('designFurnishedStatus', value)}
                                options={FURNISHED_STATUS_OPTIONS}
                                error={errors.designFurnishedStatus}
                              />
                              <TextAreaField
                                label="Scope"
                                name="designScope"
                                value={formState.designScope}
                                onChange={(value) => updateField('designScope', value)}
                                error={errors.designScope}
                                rows={4}
                              />
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                              <TextAreaField
                                label="Target aesthetic"
                                name="designTargetAesthetic"
                                value={formState.designTargetAesthetic}
                                onChange={(value) => updateField('designTargetAesthetic', value)}
                                error={errors.designTargetAesthetic}
                                rows={4}
                              />
                              <TextAreaField
                                label="Room priorities"
                                name="designRoomPriorities"
                                value={formState.designRoomPriorities}
                                onChange={(value) => updateField('designRoomPriorities', value)}
                                error={errors.designRoomPriorities}
                                rows={4}
                              />
                            </div>
                          </ServiceDetailCard>
                        )}

                        {hasVisualMediaSelection && (
                          <ServiceDetailCard
                            eyebrow={
                              formState.services.includes('photography') &&
                              formState.services.includes('drone-video')
                                ? 'Photography + Drone/Video'
                                : formState.services.includes('drone-video')
                                  ? 'Drone/Video'
                                  : 'Photography'
                            }
                            title="Visual launch brief"
                            copy="Tell us what you want shot, how soon it needs to happen, and whether add-ons matter."
                          >
                            <div className="grid gap-6 md:grid-cols-2">
                              <SelectField
                                label="Package interest"
                                name="photographyPackageInterest"
                                value={formState.photographyPackageInterest}
                                onChange={(value) => updateField('photographyPackageInterest', value)}
                                options={PHOTOGRAPHY_PACKAGE_OPTIONS}
                                error={errors.photographyPackageInterest}
                              />
                              <TextField
                                label="Launch timeline"
                                name="photographyLaunchTimeline"
                                value={formState.photographyLaunchTimeline}
                                onChange={(value) => updateField('photographyLaunchTimeline', value)}
                                error={errors.photographyLaunchTimeline}
                              />
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                              <SelectField
                                label="Current visuals status"
                                name="photographyCurrentVisualsStatus"
                                value={formState.photographyCurrentVisualsStatus}
                                onChange={(value) =>
                                  updateField('photographyCurrentVisualsStatus', value)
                                }
                                options={PHOTOGRAPHY_VISUALS_OPTIONS}
                                error={errors.photographyCurrentVisualsStatus}
                              />
                              <SelectField
                                label="Add-on interest"
                                name="photographyAddOnInterest"
                                value={formState.photographyAddOnInterest}
                                onChange={(value) => updateField('photographyAddOnInterest', value)}
                                options={ADD_ON_OPTIONS}
                                error={errors.photographyAddOnInterest}
                              />
                            </div>
                          </ServiceDetailCard>
                        )}
                      </div>
                    )}

                    {activeStep.id === 'timelineBudget' && (
                      <div className="grid gap-6 md:grid-cols-2">
                        <TextField
                          label="Desired start date"
                          name="desiredStartDate"
                          type="date"
                          value={formState.desiredStartDate}
                          onChange={(value) => updateField('desiredStartDate', value)}
                          error={errors.desiredStartDate}
                        />
                        <SelectField
                          label="Urgency"
                          name="urgency"
                          value={formState.urgency}
                          onChange={(value) => updateField('urgency', value)}
                          options={URGENCY_OPTIONS}
                          error={errors.urgency}
                        />
                        <SelectField
                          label="Budget range"
                          name="budgetRange"
                          value={formState.budgetRange}
                          onChange={(value) => updateField('budgetRange', value)}
                          options={BUDGET_RANGE_OPTIONS}
                          error={errors.budgetRange}
                        />
                        <SelectField
                          label="Ideal project window"
                          name="idealProjectWindow"
                          value={formState.idealProjectWindow}
                          onChange={(value) => updateField('idealProjectWindow', value)}
                          options={PROJECT_WINDOW_OPTIONS}
                          error={errors.idealProjectWindow}
                        />
                      </div>
                    )}

                    {activeStep.id === 'finalNotes' && (
                      <div className="space-y-6">
                        <TextAreaField
                          label="Additional context"
                          name="additionalContext"
                          value={formState.additionalContext}
                          onChange={(value) => updateField('additionalContext', value)}
                          error={errors.additionalContext}
                          hint="Optional. Share anything that would help us prepare better."
                          optional
                          rows={5}
                        />
                        <SelectField
                          label="Referral source"
                          name="referralSource"
                          value={formState.referralSource}
                          onChange={(value) => updateField('referralSource', value)}
                          options={REFERRAL_SOURCE_OPTIONS}
                          error={errors.referralSource}
                          optional
                        />

                        {sourceSummary && (
                          <div className="border border-brand-charcoal/10 bg-[#f8f6f2] px-4 py-4">
                            <p className="text-[10px] uppercase tracking-[0.26em] text-brand-charcoal/45">
                              CTA source captured
                            </p>
                            <p className="mt-2 font-light text-brand-charcoal/72">
                              {sourceSummary}
                            </p>
                          </div>
                        )}

                        {!formspreeConfigured && (
                          <div className="border border-amber-600/20 bg-amber-50 px-4 py-4">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-amber-800">
                              Configuration needed
                            </p>
                            <p className="mt-2 font-light leading-relaxed text-amber-900/80">
                              {formspreeConfigMessage}
                            </p>
                          </div>
                        )}

                        {submitError && (
                          <div className="border border-red-700/16 bg-red-50 px-4 py-4">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-red-800">
                              Submission issue
                            </p>
                            <p className="mt-2 font-light leading-relaxed text-red-900/80">
                              {submitError}
                            </p>
                          </div>
                        )}

                        <label className="flex items-start gap-4 border border-brand-charcoal/10 bg-[#f8f6f2] px-5 py-5">
                          <input
                            type="checkbox"
                            checked={formState.consent}
                            onChange={(event) => updateField('consent', event.target.checked)}
                            className="mt-1 h-4 w-4 rounded-none border-brand-charcoal/20 text-brand-charcoal focus:ring-brand-charcoal/10"
                          />
                          <span className="font-light leading-relaxed text-brand-charcoal/72">
                            I consent to being contacted about this inquiry and understand that my
                            answers will be used to prepare an appropriate follow-up.
                            {errors.consent && (
                              <span className="mt-2 block text-sm text-red-700">{errors.consent}</span>
                            )}
                          </span>
                        </label>

                        <div className="hidden" aria-hidden="true">
                          <label htmlFor="website">Website</label>
                          <input
                            id="website"
                            tabIndex={-1}
                            autoComplete="off"
                            type="text"
                            value={formState.honeypot}
                            onChange={(event) => updateField('honeypot', event.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-10 flex flex-col gap-4 border-t border-brand-charcoal/10 pt-8 md:flex-row md:items-center md:justify-between">
                    <Button type="button" variant="secondary" size="lg" onClick={goToPreviousStep}>
                      <ArrowLeft size={16} />
                      <span>{activeStepIndex === 0 ? 'Back To Overview' : 'Back'}</span>
                    </Button>

                    {activeStep.id === 'finalNotes' ? (
                      <Button type="submit" size="xl" disabled={isSubmitting}>
                        <span>{isSubmitting ? 'Sending Inquiry' : 'Submit Inquiry'}</span>
                        {!isSubmitting && <ArrowRight size={16} />}
                      </Button>
                    ) : (
                      <Button type="button" size="xl" onClick={goToNextStep}>
                        <span>Continue</span>
                        <ArrowRight size={16} />
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface FieldShellProps {
  children: React.ReactNode;
  error?: string;
  hint?: string;
  htmlFor: string;
  label: string;
  optional?: boolean;
}

function FieldShell({ children, error, hint, htmlFor, label, optional }: FieldShellProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <label
          htmlFor={htmlFor}
          className="text-[10px] uppercase tracking-[0.24em] text-brand-charcoal/55"
        >
          {label}
        </label>
        {optional && (
          <span className="text-[10px] uppercase tracking-[0.22em] text-brand-charcoal/35">
            Optional
          </span>
        )}
      </div>
      {children}
      {error ? (
        <p className="mt-2 text-sm text-red-700">{error}</p>
      ) : hint ? (
        <p className="mt-2 font-light leading-relaxed text-brand-charcoal/55">{hint}</p>
      ) : null}
    </div>
  );
}

interface TextFieldProps {
  error?: string;
  hint?: string;
  label: string;
  name: string;
  onChange: (value: string) => void;
  optional?: boolean;
  type?: React.HTMLInputTypeAttribute;
  value: string;
}

function TextField({
  error,
  hint,
  label,
  name,
  onChange,
  optional,
  type = 'text',
  value,
}: TextFieldProps) {
  return (
    <FieldShell error={error} hint={hint} htmlFor={name} label={label} optional={optional}>
      <input
        id={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          inputClassName,
          error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10',
        )}
      />
    </FieldShell>
  );
}

interface SelectFieldProps {
  error?: string;
  hint?: string;
  label: string;
  name: string;
  onChange: (value: string) => void;
  optional?: boolean;
  options: ReadonlyArray<{ label: string; value: string }>;
  value: string;
}

function SelectField({
  error,
  hint,
  label,
  name,
  onChange,
  optional,
  options,
  value,
}: SelectFieldProps) {
  return (
    <FieldShell error={error} hint={hint} htmlFor={name} label={label} optional={optional}>
      <select
        id={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          inputClassName,
          error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10',
        )}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

interface TextAreaFieldProps {
  error?: string;
  hint?: string;
  label: string;
  name: string;
  onChange: (value: string) => void;
  optional?: boolean;
  rows?: number;
  value: string;
}

function TextAreaField({
  error,
  hint,
  label,
  name,
  onChange,
  optional,
  rows = 5,
  value,
}: TextAreaFieldProps) {
  return (
    <FieldShell error={error} hint={hint} htmlFor={name} label={label} optional={optional}>
      <textarea
        id={name}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          `${inputClassName} resize-y`,
          error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10',
        )}
      />
    </FieldShell>
  );
}

interface ServiceDetailCardProps {
  children: React.ReactNode;
  copy: string;
  eyebrow: string;
  title: string;
}

function ServiceDetailCard({ children, copy, eyebrow, title }: ServiceDetailCardProps) {
  return (
    <section className="border border-brand-charcoal/10 bg-[#f8f6f2] p-6 md:p-8">
      <p className="text-[10px] uppercase tracking-[0.28em] text-brand-charcoal/45">{eyebrow}</p>
      <h3 className="mt-4 text-3xl font-serif text-brand-charcoal">{title}</h3>
      <p className="mt-3 max-w-2xl font-light leading-relaxed text-brand-charcoal/68">{copy}</p>
      <div className="mt-6 grid gap-6">{children}</div>
    </section>
  );
}

function validateStep(stepId: ContactStepId, formState: ContactFormState): FormErrors {
  const nextErrors: FormErrors = {};
  const requireField = (field: keyof ContactFormState, message: string) => {
    const value = formState[field];

    if (typeof value === 'string' && !value.trim()) {
      nextErrors[field] = message;
    }
  };

  if (stepId === 'serviceSelection') {
    if (formState.services.length === 0) {
      nextErrors.services = 'Select at least one service so we can tailor the next steps.';
    }

    if (!formState.inquiryType) {
      nextErrors.inquiryType = 'Choose the inquiry type before moving on.';
    }
  }

  if (stepId === 'clientDetails') {
    requireField('fullName', 'Please add the client name.');
    requireField('email', 'Please add an email address.');
    requireField('phone', 'Please add a phone number.');
    requireField('preferredContactMethod', 'Choose how you prefer to be contacted.');
    requireField('preferredContactTime', 'Choose the preferred contact window.');

    if (formState.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
  }

  if (stepId === 'propertyProfile') {
    requireField('propertyLocation', 'Please add the property location.');
    requireField('propertyType', 'Select the property type.');
    requireField('numberOfProperties', 'Select the number of properties.');
    requireField('bedrooms', 'Select the bedroom count.');
    requireField('bathrooms', 'Select the bathroom count.');
    requireField('guestCapacity', 'Select the guest capacity.');
    requireField('listingStatus', 'Select the listing status.');
  }

  if (stepId === 'currentSituation') {
    requireField('currentManagementSetup', 'Select the current management setup.');
    requireField('existingBookingPlatforms', 'Tell us which booking platforms are currently in use.');
    requireField('biggestPainPoints', 'Tell us what the main pain points are.');
    requireField('targetOutcome', 'Tell us what outcome you want from this engagement.');
  }

  if (stepId === 'serviceDetails') {
    if (formState.services.includes('reservations-hosting')) {
      requireField('reservationPlatformCoverage', 'Select the platform coverage you need.');
      requireField(
        'reservationGuestCommunicationNeeds',
        'Tell us what guest communication support is needed.',
      );
      requireField('reservationOccupancyGoals', 'Tell us the occupancy or review goals.');
    }

    if (formState.services.includes('cleaning-preparation')) {
      requireField('cleaningTurnoverFrequency', 'Select the turnover frequency.');
      requireField('cleaningLaundryLinenNeeds', 'Tell us the laundry or linen requirements.');
      requireField(
        'cleaningWelcomePackExpectations',
        'Tell us what welcome-pack expectations should be factored in.',
      );
    }

    if (formState.services.includes('property-management')) {
      requireField(
        'managementMaintenanceCoordination',
        'Select the level of maintenance coordination required.',
      );
      requireField('managementInspections', 'Select the inspection cadence.');
      requireField(
        'managementPaymentCoordination',
        'Select the payment or service coordination scope.',
      );
    }

    if (formState.services.includes('accessorising-design')) {
      requireField('designFurnishedStatus', 'Select the furnished status.');
      requireField('designScope', 'Tell us the design or accessorising scope.');
      requireField('designTargetAesthetic', 'Tell us the target aesthetic.');
      requireField('designRoomPriorities', 'Tell us which rooms matter most.');
    }

    if (formState.services.some((service) => VISUAL_MEDIA_SERVICES.includes(service))) {
      requireField('photographyPackageInterest', 'Select the package or visual brief.');
      requireField('photographyLaunchTimeline', 'Tell us the launch timeline.');
      requireField(
        'photographyCurrentVisualsStatus',
        'Select the current visuals status.',
      );
      requireField('photographyAddOnInterest', 'Select the add-on interest level.');
    }
  }

  if (stepId === 'timelineBudget') {
    requireField('desiredStartDate', 'Please add the desired start date.');
    requireField('urgency', 'Select the urgency.');
    requireField('budgetRange', 'Select the budget range.');
    requireField('idealProjectWindow', 'Select the ideal project window.');
  }

  if (stepId === 'finalNotes' && !formState.consent) {
    nextErrors.consent = 'Consent is required before sending the inquiry.';
  }

  return nextErrors;
}

function buildSubmissionPayload(formState: ContactFormState) {
  const payload = {
    _subject: `MKS inquiry: ${formState.fullName || 'New contact'}`,
    _replyto: formState.email.trim(),
    sourceTag: formState.sourceTag.trim(),
    inquiryType: formState.inquiryType,
    services: formState.services.map((service) => getServiceLabel(service)).join(', '),
    fullName: formState.fullName.trim(),
    email: formState.email.trim(),
    phone: formState.phone.trim(),
    preferredContactMethod: formState.preferredContactMethod,
    preferredContactTime: formState.preferredContactTime,
    companyBrand: formState.companyBrand.trim(),
    propertyLocation: formState.propertyLocation.trim(),
    propertyType: formState.propertyType,
    numberOfProperties: formState.numberOfProperties,
    bedrooms: formState.bedrooms,
    bathrooms: formState.bathrooms,
    guestCapacity: formState.guestCapacity,
    listingStatus: formState.listingStatus,
    bookingLinks: formState.bookingLinks.trim(),
    currentManagementSetup: formState.currentManagementSetup,
    existingBookingPlatforms: formState.existingBookingPlatforms.trim(),
    biggestPainPoints: formState.biggestPainPoints.trim(),
    whatAlreadyWorking: formState.whatAlreadyWorking.trim(),
    targetOutcome: formState.targetOutcome.trim(),
    reservationPlatformCoverage: formState.reservationPlatformCoverage,
    reservationGuestCommunicationNeeds: formState.reservationGuestCommunicationNeeds.trim(),
    reservationOccupancyGoals: formState.reservationOccupancyGoals.trim(),
    cleaningTurnoverFrequency: formState.cleaningTurnoverFrequency,
    cleaningLaundryLinenNeeds: formState.cleaningLaundryLinenNeeds.trim(),
    cleaningWelcomePackExpectations: formState.cleaningWelcomePackExpectations.trim(),
    managementMaintenanceCoordination: formState.managementMaintenanceCoordination,
    managementInspections: formState.managementInspections,
    managementPaymentCoordination: formState.managementPaymentCoordination,
    designFurnishedStatus: formState.designFurnishedStatus,
    designScope: formState.designScope.trim(),
    designTargetAesthetic: formState.designTargetAesthetic.trim(),
    designRoomPriorities: formState.designRoomPriorities.trim(),
    photographyPackageInterest: formState.photographyPackageInterest.trim(),
    photographyLaunchTimeline: formState.photographyLaunchTimeline.trim(),
    photographyCurrentVisualsStatus: formState.photographyCurrentVisualsStatus,
    photographyAddOnInterest: formState.photographyAddOnInterest,
    desiredStartDate: formState.desiredStartDate,
    urgency: formState.urgency,
    budgetRange: formState.budgetRange,
    idealProjectWindow: formState.idealProjectWindow,
    additionalContext: formState.additionalContext.trim(),
    referralSource: formState.referralSource,
    consentToContact: formState.consent ? 'Yes' : 'No',
    website: formState.honeypot.trim(),
  };

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }

      return Boolean(value);
    }),
  );
}

function getSubmissionErrorMessage(
  responseBody: { error?: string; errors?: Array<{ message?: string }> } | null,
) {
  if (responseBody?.errors?.length) {
    return responseBody.errors
      .map((item) => item.message)
      .filter(Boolean)
      .join(' ');
  }

  if (responseBody?.error) {
    return responseBody.error;
  }

  return 'We could not send the inquiry just now. Your answers are still here, so you can try again.';
}

export default Contact;
