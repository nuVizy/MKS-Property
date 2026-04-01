export interface Option {
  value: string;
  label: string;
  hint?: string;
}

export const SERVICE_OPTIONS = [
  {
    value: 'reservations-hosting',
    label: 'Reservations & Hosting',
    hint: 'Platform coverage, guest messaging, and performance goals.',
  },
  {
    value: 'cleaning-preparation',
    label: 'Cleaning & Preparation',
    hint: 'Turnovers, linen support, and welcome-pack readiness.',
  },
  {
    value: 'property-management',
    label: 'Property Management',
    hint: 'Maintenance oversight, inspections, and coordination.',
  },
  {
    value: 'accessorising-design',
    label: 'Accessorising & Design',
    hint: 'Styling direction, furnishing scope, and room priorities.',
  },
  {
    value: 'photography',
    label: 'Photography',
    hint: 'Launch visuals, refreshed imagery, and listing photography.',
  },
  {
    value: 'drone-video',
    label: 'Drone/Video',
    hint: 'Cinematic coverage, motion assets, and aerial perspective.',
  },
] as const satisfies readonly Option[];

export type Service = (typeof SERVICE_OPTIONS)[number]['value'];

export const SERVICE_LABELS: Record<Service, string> = SERVICE_OPTIONS.reduce(
  (labels, option) => {
    labels[option.value] = option.label;
    return labels;
  },
  {} as Record<Service, string>,
);

export const INQUIRY_TYPE_OPTIONS = [
  { value: 'new-inquiry', label: 'New inquiry' },
  { value: 'existing-rental-refresh', label: 'Existing rental refresh' },
  { value: 'launch-prep', label: 'Launch prep' },
  { value: 'one-off-service', label: 'One-off service' },
] as const satisfies readonly Option[];

export type InquiryType = (typeof INQUIRY_TYPE_OPTIONS)[number]['value'];

export const PROPERTY_TYPE_OPTIONS = [
  { value: 'studio', label: 'Studio' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'maisonette', label: 'Maisonette' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'mixed-portfolio', label: 'Mixed portfolio' },
] as const satisfies readonly Option[];

export const PROPERTY_COUNT_OPTIONS = [
  { value: '1', label: '1 property' },
  { value: '2-3', label: '2 to 3 properties' },
  { value: '4-7', label: '4 to 7 properties' },
  { value: '8+', label: '8+ properties' },
] as const satisfies readonly Option[];

export const BEDROOM_OPTIONS = [
  { value: 'studio', label: 'Studio' },
  { value: '1', label: '1 bedroom' },
  { value: '2', label: '2 bedrooms' },
  { value: '3', label: '3 bedrooms' },
  { value: '4', label: '4 bedrooms' },
  { value: '5+', label: '5+ bedrooms' },
] as const satisfies readonly Option[];

export const BATHROOM_OPTIONS = [
  { value: '1', label: '1 bathroom' },
  { value: '2', label: '2 bathrooms' },
  { value: '3', label: '3 bathrooms' },
  { value: '4+', label: '4+ bathrooms' },
] as const satisfies readonly Option[];

export const GUEST_CAPACITY_OPTIONS = [
  { value: '1-2', label: '1 to 2 guests' },
  { value: '3-4', label: '3 to 4 guests' },
  { value: '5-6', label: '5 to 6 guests' },
  { value: '7-8', label: '7 to 8 guests' },
  { value: '9+', label: '9+ guests' },
] as const satisfies readonly Option[];

export const LISTING_STATUS_OPTIONS = [
  { value: 'live', label: 'Already live' },
  { value: 'launching-soon', label: 'Preparing to launch' },
  { value: 'refreshing', label: 'Live but needs a refresh' },
  { value: 'direct-booking', label: 'Direct booking only' },
  { value: 'new-acquisition', label: 'New acquisition / not yet positioned' },
] as const satisfies readonly Option[];

export const CONTACT_METHOD_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone call' },
  { value: 'whatsapp', label: 'WhatsApp' },
] as const satisfies readonly Option[];

export const CONTACT_TIME_OPTIONS = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'flexible', label: 'Flexible' },
] as const satisfies readonly Option[];

export const MANAGEMENT_SETUP_OPTIONS = [
  { value: 'self-managed', label: 'Self-managed' },
  { value: 'cleaner-support', label: 'Cleaner / contractor support only' },
  { value: 'agency-managed', label: 'Managed by another agency' },
  { value: 'hybrid-support', label: 'Hybrid / shared responsibility' },
  { value: 'not-live-yet', label: 'Not live yet' },
] as const satisfies readonly Option[];

export const RESERVATION_PLATFORM_OPTIONS = [
  { value: 'airbnb-only', label: 'Airbnb only' },
  { value: 'airbnb-booking', label: 'Airbnb + Booking.com' },
  { value: 'multi-ota', label: 'Multiple OTAs' },
  { value: 'direct-and-ota', label: 'Direct bookings + OTAs' },
  { value: 'not-set-up', label: 'Not set up yet' },
] as const satisfies readonly Option[];

export const CLEANING_FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Weekly turnovers' },
  { value: 'multi-weekly', label: 'Multiple turnovers per week' },
  { value: 'seasonal', label: 'Seasonal / occasional' },
  { value: 'ad-hoc', label: 'Ad hoc support' },
  { value: 'not-sure', label: 'Not sure yet' },
] as const satisfies readonly Option[];

export const MANAGEMENT_COORDINATION_OPTIONS = [
  { value: 'full-oversight', label: 'Full oversight' },
  { value: 'on-demand', label: 'On-demand support' },
  { value: 'vendor-only', label: 'Vendor coordination only' },
  { value: 'existing-vendors', label: 'Existing vendors need oversight' },
] as const satisfies readonly Option[];

export const INSPECTION_OPTIONS = [
  { value: 'arrival-departure', label: 'Arrival / departure only' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'case-by-case', label: 'Case by case' },
] as const satisfies readonly Option[];

export const PAYMENT_COORDINATION_OPTIONS = [
  { value: 'petty-cash', label: 'Petty cash only' },
  { value: 'owner-approved', label: 'Owner-approved vendor payments' },
  { value: 'guest-charge', label: 'Guest charge coordination' },
  { value: 'full-coordination', label: 'Full payment / service coordination' },
] as const satisfies readonly Option[];

export const FURNISHED_STATUS_OPTIONS = [
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'partially-furnished', label: 'Partially furnished' },
  { value: 'fully-furnished', label: 'Fully furnished' },
  { value: 'needs-refresh', label: 'Furnished but needs a refresh' },
] as const satisfies readonly Option[];

export const PHOTOGRAPHY_PACKAGE_OPTIONS = [
  { value: 'apartment', label: 'Apartment package' },
  { value: 'maisonette', label: 'Maisonette package' },
  { value: 'house-villa', label: 'House / Villa package' },
  { value: 'custom-quote', label: 'Custom quote' },
  { value: 'drone-video-only', label: 'Drone / video only' },
] as const satisfies readonly Option[];

export const PHOTOGRAPHY_VISUALS_OPTIONS = [
  { value: 'none-yet', label: 'No visuals yet' },
  { value: 'outdated', label: 'Outdated imagery' },
  { value: 'phone-only', label: 'Phone photos only' },
  { value: 'mixed-assets', label: 'Mixed existing assets' },
  { value: 'recent-but-underperforming', label: 'Recent shoot but underperforming' },
] as const satisfies readonly Option[];

export const ADD_ON_OPTIONS = [
  { value: 'none', label: 'No add-ons needed' },
  { value: 'drone-stills', label: 'Drone stills' },
  { value: 'drone-video', label: 'Drone video' },
  { value: 'short-form-video', label: 'Reels / short-form video' },
  { value: 'full-visual-suite', label: 'Full visual suite' },
] as const satisfies readonly Option[];

export const BUDGET_RANGE_OPTIONS = [
  { value: 'under-500', label: 'Under €500' },
  { value: '500-1500', label: '€500 to €1,500' },
  { value: '1500-5000', label: '€1,500 to €5,000' },
  { value: '5000-10000', label: '€5,000 to €10,000' },
  { value: '10000+', label: '€10,000+' },
  { value: 'scope-first', label: 'Let’s scope it first' },
] as const satisfies readonly Option[];

export const VISUAL_MEDIA_SERVICES: readonly Service[] = ['photography', 'drone-video'];

export const CONTACT_STEPS = [
  {
    id: 'serviceSelection',
    label: 'Service Selection',
    description: 'Tell us what kind of support you want to scope first.',
  },
  {
    id: 'clientDetails',
    label: 'Client Details',
    description: 'Who should we contact and how should we reach you?',
  },
  {
    id: 'propertyProfile',
    label: 'Property Profile',
    description: 'A quick snapshot of the property, portfolio, and listing status.',
  },
  {
    id: 'currentSituation',
    label: 'Current Situation',
    description: 'What is happening now and which issues need attention most?',
  },
  {
    id: 'serviceDetails',
    label: 'Service-Specific Detail',
    description: 'Only the detail blocks tied to your selected services appear here.',
  },
  {
    id: 'timelineBudget',
    label: 'Timeline + Budget',
    description: 'Help us understand timing and commercial fit.',
  },
  {
    id: 'finalNotes',
    label: 'Final Notes',
    description: 'Add any final context and send the inquiry directly from this page.',
  },
] as const;

export type ContactStepId = (typeof CONTACT_STEPS)[number]['id'];

export interface ContactFormState {
  services: Service[];
  inquiryType: InquiryType | '';
  fullName: string;
  email: string;
  phone: string;
  preferredContactMethod: string;
  preferredContactTime: string;
  companyBrand: string;
  propertyLocation: string;
  propertyType: string;
  numberOfProperties: string;
  bedrooms: string;
  bathrooms: string;
  guestCapacity: string;
  listingStatus: string;
  bookingLinks: string;
  currentManagementSetup: string;
  existingBookingPlatforms: string;
  currentIssues: string;
  whatAlreadyWorking: string;
  reservationPlatformCoverage: string;
  reservationGuestCommunicationNeeds: string;
  reservationOccupancyGoals: string;
  cleaningTurnoverFrequency: string;
  cleaningLaundryLinenNeeds: string;
  cleaningWelcomePackExpectations: string;
  managementMaintenanceCoordination: string;
  managementInspections: string;
  managementPaymentCoordination: string;
  designFurnishedStatus: string;
  designScope: string;
  designTargetAesthetic: string;
  designRoomPriorities: string;
  photographyPackageInterest: string;
  photographyLaunchTimeline: string;
  photographyCurrentVisualsStatus: string;
  photographyAddOnInterest: string;
  desiredStartDate: string;
  budgetRange: string;
  additionalContext: string;
  consent: boolean;
  honeypot: string;
  sourceTag: string;
}

export const INITIAL_CONTACT_FORM_STATE: ContactFormState = {
  services: [],
  inquiryType: '',
  fullName: '',
  email: '',
  phone: '',
  preferredContactMethod: '',
  preferredContactTime: '',
  companyBrand: '',
  propertyLocation: '',
  propertyType: '',
  numberOfProperties: '',
  bedrooms: '',
  bathrooms: '',
  guestCapacity: '',
  listingStatus: '',
  bookingLinks: '',
  currentManagementSetup: '',
  existingBookingPlatforms: '',
  currentIssues: '',
  whatAlreadyWorking: '',
  reservationPlatformCoverage: '',
  reservationGuestCommunicationNeeds: '',
  reservationOccupancyGoals: '',
  cleaningTurnoverFrequency: '',
  cleaningLaundryLinenNeeds: '',
  cleaningWelcomePackExpectations: '',
  managementMaintenanceCoordination: '',
  managementInspections: '',
  managementPaymentCoordination: '',
  designFurnishedStatus: '',
  designScope: '',
  designTargetAesthetic: '',
  designRoomPriorities: '',
  photographyPackageInterest: '',
  photographyLaunchTimeline: '',
  photographyCurrentVisualsStatus: '',
  photographyAddOnInterest: '',
  desiredStartDate: '',
  budgetRange: '',
  additionalContext: '',
  consent: false,
  honeypot: '',
  sourceTag: '',
};

const SERVICE_QUERY_MAP: Record<string, Service> = {
  reservations: 'reservations-hosting',
  hosting: 'reservations-hosting',
  'reservations-hosting': 'reservations-hosting',
  cleaning: 'cleaning-preparation',
  preparation: 'cleaning-preparation',
  'cleaning-preparation': 'cleaning-preparation',
  management: 'property-management',
  'property-management': 'property-management',
  accessorising: 'accessorising-design',
  accessorizing: 'accessorising-design',
  design: 'accessorising-design',
  'accessorising-design': 'accessorising-design',
  photography: 'photography',
  photo: 'photography',
  drone: 'drone-video',
  video: 'drone-video',
  'drone-video': 'drone-video',
};

export function getServiceLabel(service: Service): string {
  return SERVICE_LABELS[service];
}

export function parseServiceParam(value: string | null): Service | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return SERVICE_QUERY_MAP[normalized] ?? null;
}

export function humanizeSourceTag(sourceTag: string): string {
  return sourceTag
    .trim()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
