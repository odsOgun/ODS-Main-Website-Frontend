import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '@/components/shared/SuccessModal';
import { apiService, type ApiError } from '@/api/apiService';
import { Check, ArrowRight, ArrowLeft, ChevronDown, Loader2 } from 'lucide-react';

interface TeamMember {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  customRole: string;
}

interface HackathonRegistrationData {
  // Step 1: Team lead
  leadFullName: string;
  leadEmail: string;
  leadPhone: string;
  leadLocation: string;
  preferredContact: string;

  // Step 2: Your team (members excludes the team lead)
  teamName: string;
  memberCount: string;
  members: TeamMember[];

  // Step 3: The idea
  ideaTitle: string;
  solutionArea: string;
  problemDescription: string;
  whoExperiencesProblem: string;
  proposedSolution: string;
  validationStage: string;
  prototypeLink: string;
  uniqueApproach: string;
  nextSteps: string;

  // Step 4: Confirmation
  referralSource: string;
  referralSourceOther: string;
  agreeTerms: string;
  confirmAccurate1: boolean;
  confirmAccurate2: boolean;
}

// Keys match the backend: top-level field names, or "members[i].field" for member fields
type FormErrors = Record<string, string>;

interface HackathonErrorResponse {
  success: false;
  message?: string;
  errors?: FormErrors;
}

interface HackathonRegistrationProps {
  onBack?: () => void;
}

// Dropdown values must match the backend exactly
const PREFERRED_CONTACT_OPTIONS = ['WhatsApp', 'Email', 'Phone call'];

const MEMBER_COUNT_OPTIONS = ['2', '3', '4', '5'];
const MIN_MEMBERS = 2;
const MAX_MEMBERS = 5;

const ROLE_OPTIONS = [
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'UI/UX Designer',
  'Product Manager',
  'Data Specialist',
  'Mobile Developer',
  'Domain Expert',
  'Others'
];

const SOLUTION_AREA_OPTIONS = [
  'Edtech',
  'Fintech',
  'Proptech & Real Estate',
  'Healthtech & Telemedicine',
  'Agrictech & Food Security',
  'AI / Machine Learning'
];

const VALIDATION_STAGE_OPTIONS = [
  'Idea stage / Market research',
  'Wireframes / Figma prototypes',
  'Working prototype / MVP',
  'Live in pilot / Early users'
];

const REFERRAL_OPTIONS = [
  'X (Twitter)',
  'Instagram',
  'Facebook',
  'TikTok',
  'LinkedIn',
  'ODS Website',
  'Friend or Colleague',
  'Tech Community / WhatsApp',
  'Articles',
  'Radio',
  'Billboard',
  'Other'
];

const MAX_LENGTH = {
  name: 120,
  teamName: 100,
  location: 160,
  ideaTitle: 200,
  customRole: 80,
  referralSourceOther: 120,
  prototypeLink: 500,
  longText: 3000
};

const STEP_FIELDS: Record<number, string[]> = {
  1: ['leadFullName', 'leadEmail', 'leadPhone', 'leadLocation', 'preferredContact'],
  2: ['teamName', 'memberCount', 'members'],
  3: [
    'ideaTitle',
    'solutionArea',
    'problemDescription',
    'whoExperiencesProblem',
    'proposedSolution',
    'validationStage',
    'prototypeLink',
    'uniqueApproach',
    'nextSteps'
  ],
  4: ['referralSource', 'referralSourceOther', 'agreeTerms', 'confirmAccurate1', 'confirmAccurate2']
};

const TOO_MANY_ATTEMPTS_MESSAGE = 'Too many attempts, please wait a moment and try again.';
const GENERIC_ERROR_MESSAGE =
  'Something went wrong while submitting your registration. Your details have been kept, please try again.';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createEmptyMember = (): TeamMember => ({
  fullName: '',
  email: '',
  phoneNumber: '',
  role: '',
  customRole: ''
});

const createInitialFormData = (): HackathonRegistrationData => ({
  leadFullName: '',
  leadEmail: '',
  leadPhone: '',
  leadLocation: '',
  preferredContact: '',
  teamName: '',
  memberCount: '',
  members: [],
  ideaTitle: '',
  solutionArea: '',
  problemDescription: '',
  whoExperiencesProblem: '',
  proposedSolution: '',
  validationStage: '',
  prototypeLink: '',
  uniqueApproach: '',
  nextSteps: '',
  referralSource: '',
  referralSourceOther: '',
  agreeTerms: '',
  confirmAccurate1: false,
  confirmAccurate2: false
});

const digitsOnly = (value: string) => value.replace(/\D/g, '');

// Phone number validation helper: digits, spaces, "+", "-", "(", ")", "." allowed; 10–15 digits
export const isValidPhoneNumber = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  const trimmed = phone.trim();
  if (!/^[\d\s+\-().]+$/.test(trimmed)) return false;
  const digitCount = digitsOnly(trimmed).length;
  return digitCount >= 10 && digitCount <= 15;
};

const getStepForField = (key: string): number | null => {
  const baseKey = key.startsWith('members') ? 'members' : key;
  for (const [step, fields] of Object.entries(STEP_FIELDS)) {
    if (fields.includes(baseKey)) return Number(step);
  }
  return null;
};

const filterErrorsByStep = (errors: FormErrors, step: number, keep: boolean): FormErrors =>
  Object.fromEntries(
    Object.entries(errors).filter(([key]) => (getStepForField(key) === step) === keep)
  );

const getMemberIndex = (key: string): number | null => {
  const match = /^members\[(\d+)\]/.exec(key);
  return match ? Number(match[1]) : null;
};

const isErrorResponse = (data: unknown): data is HackathonErrorResponse =>
  typeof data === 'object' && data !== null && 'success' in data;

// Mirrors the backend validation so users see errors before submitting
function validateForm(data: HackathonRegistrationData): FormErrors {
  const errors: FormErrors = {};

  const checkRequired = (key: string, value: string, label: string, max: number) => {
    const trimmed = value.trim();
    if (!trimmed) errors[key] = `${label} is required`;
    else if (trimmed.length > max) errors[key] = `${label} must be ${max} characters or fewer`;
  };

  const checkOptional = (key: string, value: string, label: string, max: number) => {
    if (value.trim().length > max) errors[key] = `${label} must be ${max} characters or fewer`;
  };

  const checkEmail = (key: string, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) errors[key] = 'Email is required';
    else if (!EMAIL_REGEX.test(trimmed)) errors[key] = 'Please enter a valid email address';
  };

  const checkOption = (key: string, value: string, options: string[], message: string) => {
    if (!options.includes(value)) errors[key] = message;
  };

  // Step 1: Team lead
  checkRequired('leadFullName', data.leadFullName, 'Full name', MAX_LENGTH.name);
  checkEmail('leadEmail', data.leadEmail);
  if (!data.leadPhone.trim()) {
    errors.leadPhone = 'Phone number is required';
  } else if (!isValidPhoneNumber(data.leadPhone)) {
    errors.leadPhone = 'Please enter a valid phone number (10–15 digits)';
  }
  checkOptional('leadLocation', data.leadLocation, 'Location', MAX_LENGTH.location);
  checkOption(
    'preferredContact',
    data.preferredContact,
    PREFERRED_CONTACT_OPTIONS,
    'Please select a contact method'
  );

  // Step 2: Your team
  checkRequired('teamName', data.teamName, 'Team name', MAX_LENGTH.teamName);

  const count = parseInt(data.memberCount, 10);
  if (isNaN(count) || count < MIN_MEMBERS || count > MAX_MEMBERS) {
    errors.memberCount = `Please select between ${MIN_MEMBERS} and ${MAX_MEMBERS} members`;
  } else if (data.members.length !== count) {
    errors.members = `Please fill in details for all ${count} members`;
  }

  data.members.forEach((member, idx) => {
    const prefix = `members[${idx}]`;
    checkRequired(`${prefix}.fullName`, member.fullName, 'Full name', MAX_LENGTH.name);
    checkEmail(`${prefix}.email`, member.email);
    if (member.phoneNumber.trim() && !isValidPhoneNumber(member.phoneNumber)) {
      errors[`${prefix}.phoneNumber`] = 'Please enter a valid phone number (10–15 digits)';
    }
    checkOption(`${prefix}.role`, member.role, ROLE_OPTIONS, 'Primary role is required');
    if (member.role === 'Others') {
      checkOptional(`${prefix}.customRole`, member.customRole, 'Role', MAX_LENGTH.customRole);
    }
  });

  // Everyone on the team (lead + members) must be a different person.
  // The first occurrence wins; the later duplicate gets the error.
  const people = [
    {
      name: data.leadFullName,
      email: data.leadEmail,
      phone: data.leadPhone,
      keys: { name: 'leadFullName', email: 'leadEmail', phone: 'leadPhone' }
    },
    ...data.members.map((member, idx) => ({
      name: member.fullName,
      email: member.email,
      phone: member.phoneNumber,
      keys: {
        name: `members[${idx}].fullName`,
        email: `members[${idx}].email`,
        phone: `members[${idx}].phoneNumber`
      }
    }))
  ];

  const checkDuplicates = (
    field: 'name' | 'email' | 'phone',
    normalize: (value: string) => string,
    message: string
  ) => {
    const seen = new Set<string>();
    people.forEach((person) => {
      const value = normalize(person[field]);
      if (!value) return;
      if (seen.has(value)) {
        errors[person.keys[field]] ??= message;
      } else {
        seen.add(value);
      }
    });
  };

  const normalizeText = (value: string) => value.trim().toLowerCase();
  checkDuplicates('name', normalizeText, 'Each team member must have a different name');
  checkDuplicates('email', normalizeText, 'Each team member must have a different email');
  checkDuplicates('phone', digitsOnly, 'Each team member must have a different phone number');

  // Step 3: The idea
  checkRequired('ideaTitle', data.ideaTitle, 'Working title', MAX_LENGTH.ideaTitle);
  checkOption(
    'solutionArea',
    data.solutionArea,
    SOLUTION_AREA_OPTIONS,
    'Please select a solution area'
  );
  checkRequired('problemDescription', data.problemDescription, 'Description', MAX_LENGTH.longText);
  checkOptional(
    'whoExperiencesProblem',
    data.whoExperiencesProblem,
    'This field',
    MAX_LENGTH.longText
  );
  checkOptional('proposedSolution', data.proposedSolution, 'This field', MAX_LENGTH.longText);
  if (data.validationStage) {
    checkOption(
      'validationStage',
      data.validationStage,
      VALIDATION_STAGE_OPTIONS,
      'Please select a valid stage'
    );
  }
  checkOptional('prototypeLink', data.prototypeLink, 'Link', MAX_LENGTH.prototypeLink);
  checkOptional('uniqueApproach', data.uniqueApproach, 'This field', MAX_LENGTH.longText);
  checkOptional('nextSteps', data.nextSteps, 'This field', MAX_LENGTH.longText);

  // Step 4: Confirmation
  checkOption('referralSource', data.referralSource, REFERRAL_OPTIONS, 'Please select an option');
  if (data.referralSource === 'Other') {
    checkOptional(
      'referralSourceOther',
      data.referralSourceOther,
      'This field',
      MAX_LENGTH.referralSourceOther
    );
  }
  if (data.agreeTerms !== 'Yes') {
    errors.agreeTerms = 'All team members must agree to the hackathon terms';
  }
  if (!data.confirmAccurate1) errors.confirmAccurate1 = 'Please confirm this declaration';
  if (!data.confirmAccurate2) errors.confirmAccurate2 = 'Please confirm this declaration';

  return errors;
}

function buildPayload(data: HackathonRegistrationData) {
  return {
    leadFullName: data.leadFullName.trim(),
    leadEmail: data.leadEmail.trim(),
    leadPhone: data.leadPhone.trim(),
    leadLocation: data.leadLocation.trim(),
    preferredContact: data.preferredContact,
    teamName: data.teamName.trim(),
    memberCount: String(data.members.length),
    members: data.members.map((member) => ({
      fullName: member.fullName.trim(),
      email: member.email.trim(),
      phoneNumber: member.phoneNumber.trim(),
      role: member.role,
      customRole: member.role === 'Others' ? member.customRole.trim() : ''
    })),
    ideaTitle: data.ideaTitle.trim(),
    solutionArea: data.solutionArea,
    problemDescription: data.problemDescription.trim(),
    whoExperiencesProblem: data.whoExperiencesProblem.trim(),
    proposedSolution: data.proposedSolution.trim(),
    validationStage: data.validationStage,
    prototypeLink: data.prototypeLink.trim(),
    uniqueApproach: data.uniqueApproach.trim(),
    nextSteps: data.nextSteps.trim(),
    referralSource: data.referralSource,
    referralSourceOther: data.referralSource === 'Other' ? data.referralSourceOther.trim() : '',
    agreeTerms: data.agreeTerms,
    confirmAccurate1: data.confirmAccurate1,
    confirmAccurate2: data.confirmAccurate2
  };
}

interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: (DropdownOption | string)[];
  placeholder?: string;
  error?: string;
  className?: string;
}

function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = 'Select option',
  error,
  className = ''
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedOptions: DropdownOption[] = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <button
        type='button'
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full px-4 py-3 rounded-xl border text-sm flex items-center justify-between text-left transition-all cursor-pointer bg-white ${
          error
            ? 'border-red-400 focus:border-red-500 ring-2 ring-red-200'
            : isOpen
              ? 'border-[#009E49] ring-2 ring-[#009E49]/20'
              : 'border-[#D0D5DD] hover:border-[#98A2B3]'
        }`}
      >
        <span className={selectedOption ? 'text-[#101828] font-normal' : 'text-[#98A2B3]'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#667085] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#009E49]' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className='absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-xl border border-[#EAECF0] shadow-xl py-1.5 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150'
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type='button'
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleSelect(opt.value);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(opt.value);
                }}
                className={`w-full px-4 py-2.5 text-sm text-left flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#EBFDF0] text-[#009E49] font-medium'
                    : 'text-[#344054] hover:bg-[#F9FAFB] hover:text-[#101828]'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className='w-4 h-4 text-[#009E49] stroke-[2.5]' />}
              </button>
            );
          })}
        </div>
      )}
      {error && <span className='text-red-500 text-xs mt-1 block'>{error}</span>}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className='text-red-500 text-xs mt-1 block'>{message}</span>;
}

const inputClass = (hasError: boolean, variant: 'default' | 'card' = 'default') => {
  const base =
    variant === 'card'
      ? 'w-full bg-white px-3.5 py-2.5 rounded-xl border text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none transition-all'
      : 'w-full px-4 py-3 rounded-xl border text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none transition-all';
  return `${base} ${
    hasError
      ? 'border-red-400 focus:border-red-500 ring-2 ring-red-200'
      : 'border-[#D0D5DD] focus:border-[#009E49] focus:ring-2 focus:ring-[#009E49]/20'
  }`;
};

export default function HackathonRegistration({ onBack }: HackathonRegistrationProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepDirection, setStepDirection] = useState<'forward' | 'backward'>('forward');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<HackathonRegistrationData>(createInitialFormData);

  // Client errors are recomputed on Next/Submit; server errors persist until the field is edited
  const [clientErrors, setClientErrors] = useState<FormErrors>({});
  const [serverErrors, setServerErrors] = useState<FormErrors>({});
  const errors: FormErrors = { ...clientErrors, ...serverErrors };

  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const submittingRef = useRef(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [scrollRequest, setScrollRequest] = useState(0);

  // Scroll to the first errored field (in DOM order), or to the banner if no field is flagged
  useEffect(() => {
    if (!scrollRequest) return;
    const frame = requestAnimationFrame(() => {
      const target =
        document.querySelector<HTMLElement>('[data-invalid="true"]') ?? bannerRef.current;
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.querySelector<HTMLElement>('input, textarea, button')?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [scrollRequest]);

  const requestScroll = () => setScrollRequest((n) => n + 1);

  const fieldAttrs = (key: string) => ({
    'data-field': key,
    'data-invalid': errors[key] ? 'true' : undefined
  });

  const clearErrors = (match: (key: string) => boolean) => {
    const strip = (prev: FormErrors) =>
      Object.keys(prev).some(match)
        ? Object.fromEntries(Object.entries(prev).filter(([key]) => !match(key)))
        : prev;
    setClientErrors(strip);
    setServerErrors(strip);
  };

  const clearError = (...keys: string[]) => clearErrors((key) => keys.includes(key));

  const handleInputChange = <K extends keyof HackathonRegistrationData>(
    field: K,
    value: HackathonRegistrationData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const handleMemberCountChange = (countStr: string) => {
    const count = parseInt(countStr, 10);
    setFormData((prev) => ({
      ...prev,
      memberCount: countStr,
      members: Array.from({ length: count }, (_, i) => prev.members[i] ?? createEmptyMember())
    }));
    // Drop errors for the count itself and for member blocks that no longer exist
    clearErrors((key) => {
      if (key === 'memberCount' || key === 'members') return true;
      const index = getMemberIndex(key);
      return index !== null && index >= count;
    });
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    }));
    clearError(`members[${index}].${field}`);
  };

  const handleMemberRoleChange = (index: number, role: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.map((member, i) =>
        i === index
          ? { ...member, role, customRole: role === 'Others' ? member.customRole : '' }
          : member
      )
    }));
    clearError(`members[${index}].role`, `members[${index}].customRole`);
  };

  const handleReferralChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      referralSource: value,
      referralSourceOther: value === 'Other' ? prev.referralSourceOther : ''
    }));
    clearError('referralSource', 'referralSourceOther');
  };

  const goToStep = (step: number) => {
    setStepDirection(step < currentStep ? 'backward' : 'forward');
    setCurrentStep(step);
  };

  // Move to the earliest step that has an error, then scroll to the first errored field
  const showErrorsOnForm = (fieldErrors: FormErrors) => {
    const steps = Object.keys(fieldErrors)
      .map(getStepForField)
      .filter((step): step is number => step !== null);
    if (steps.length > 0) {
      const targetStep = Math.min(...steps);
      if (targetStep !== currentStep) goToStep(targetStep);
    }
    requestScroll();
  };

  const handleNext = () => {
    const stepErrors = filterErrorsByStep(validateForm(formData), currentStep, true);
    setClientErrors((prev) => ({ ...filterErrorsByStep(prev, currentStep, false), ...stepErrors }));

    const hasServerErrorsOnStep = Object.keys(serverErrors).some(
      (key) => getStepForField(key) === currentStep
    );
    if (Object.keys(stepErrors).length > 0 || hasServerErrorsOnStep) {
      requestScroll();
      return;
    }

    goToStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const canSubmit =
    formData.agreeTerms === 'Yes' &&
    formData.confirmAccurate1 &&
    formData.confirmAccurate2 &&
    !isSubmitting;

  const handleSubmit = async () => {
    if (submittingRef.current || !canSubmit) return;

    setBannerMessage(null);
    setServerErrors({});

    const allErrors = validateForm(formData);
    setClientErrors(allErrors);
    if (Object.keys(allErrors).length > 0) {
      setBannerMessage('Please fix the highlighted fields before submitting.');
      showErrorsOnForm(allErrors);
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      await apiService.hackathon.register(buildPayload(formData));
      setFormData(createInitialFormData());
      setClientErrors({});
      setStepDirection('backward');
      setCurrentStep(1);
      setShowSuccessModal(true);
    } catch (error: unknown) {
      const { status, data } = (error ?? {}) as Partial<ApiError>;

      if ((status === 400 || status === 409) && isErrorResponse(data)) {
        const fieldErrors = data.errors ?? {};
        setServerErrors(fieldErrors);
        setBannerMessage(data.message || 'Please review the highlighted fields.');
        showErrorsOnForm(fieldErrors);
      } else if (status === 429) {
        setBannerMessage(TOO_MANY_ATTEMPTS_MESSAGE);
        requestScroll();
      } else {
        setBannerMessage(GENERIC_ERROR_MESSAGE);
        requestScroll();
      }
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onBack) {
      onBack();
    } else {
      navigate('/hackathon');
    }
  };

  const steps = [
    { id: 1, label: 'Team lead' },
    { id: 2, label: 'Your team' },
    { id: 3, label: 'The idea' },
    { id: 4, label: 'Confirmation' }
  ];

  const showMemberCards = formData.members.length > 0;

  return (
    <div className='min-h-screen bg-white flex flex-col lg:flex-row font-sans'>
      {/* ================= LEFT SIDEBAR (Stretched Out, Dark Charcoal / Green) ================= */}
      <div className='w-full lg:w-[480px] xl:w-[540px] 2xl:w-[580px] bg-[#101612] text-white p-8 lg:p-12 xl:p-14 flex flex-col justify-between shrink-0 relative overflow-hidden min-h-[620px] lg:min-h-screen'>
        {/* Subtle grid pattern background */}
        <div
          className='pointer-events-none absolute inset-0 opacity-[0.04]'
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Top Badges */}
        <div className='relative z-10 flex flex-wrap items-center gap-4 text-xs text-[#B2BDB5]'>
          <span className='flex items-center gap-1.5'>
            <Check className='w-3.5 h-3.5 text-white' />
            <span>Fintech</span>
          </span>
          <span className='flex items-center gap-1.5'>
            <Check className='w-3.5 h-3.5 text-white' />
            <span>Edtech</span>
          </span>
          <span className='flex items-center gap-1.5'>
            <Check className='w-3.5 h-3.5 text-white' />
            <span>Agritech &amp; Food security</span>
          </span>
        </div>

        {/* Center Graphic */}
        <div className='relative z-10 my-8 lg:my-auto flex justify-center items-center py-6'>
          <div className='relative w-[320px] sm:w-[360px] lg:w-[390px] xl:w-[440px] max-w-full'>
            <img
              src='/img/ODS circle asset 1 [Vectorized].png'
              alt='ODS Hackathon Team'
              style={{
                filter: 'drop-shadow(14px 14px 0px #82E49C)'
              }}
              className='w-full h-auto object-contain select-none transition-transform duration-300 hover:scale-[1.02]'
            />
          </div>
        </div>

        {/* Bottom Numbers & Content */}
        <div className='relative z-10 pt-4'>
          <h4 className='text-lg font-bold text-white mb-2 text-center lg:text-left'>
            Our numbers in the last 5 years.
          </h4>
          <p className='text-xs sm:text-sm text-[#98A2B3] leading-relaxed mb-8 text-center lg:text-left max-w-md'>
            It all started with a dream in 2019 to bring together startup entrepreneurs, talents,
            creatives and founders with a strong focus to promote youth empowerment, tech
            entrepreneurship and social innovation.
          </p>

          <div className='grid grid-cols-3 gap-6 text-center lg:text-left border-t border-white/10 pt-6'>
            <div>
              <div className='text-3xl sm:text-4xl font-extrabold text-white'>+9k</div>
              <div className='text-xs text-[#98A2B3] mt-1'>Attendees</div>
            </div>
            <div>
              <div className='text-3xl sm:text-4xl font-extrabold text-white'>+65</div>
              <div className='text-xs text-[#98A2B3] mt-1'>Speakers</div>
            </div>
            <div>
              <div className='text-3xl sm:text-4xl font-extrabold text-white'>+30</div>
              <div className='text-xs text-[#98A2B3] mt-1'>Sessions</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT FORM AREA ================= */}
      <div className='flex-1 bg-white p-6 sm:p-10 lg:p-12 xl:p-16 max-w-4xl flex flex-col justify-start'>
        {/* Back Link */}
        <div className='mb-8'>
          <button
            onClick={handleBackClick}
            disabled={isSubmitting}
            className='inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#475467] hover:text-[#101828] transition-colors cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <ArrowLeft className='w-4 h-4 transition-transform group-hover:-translate-x-0.5' />
            <span>Back</span>
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start'>
          {/* Stepper on the Left Column */}
          <div className='md:col-span-4 lg:col-span-3 shrink-0'>
            <div className='flex flex-row md:flex-col gap-4 sm:gap-6 justify-between md:justify-start'>
              {steps.map((s) => {
                const isCompleted = s.id < currentStep;
                const isActive = s.id === currentStep;

                return (
                  <div key={s.id} className='flex items-center gap-3 transition-all duration-300'>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                        isCompleted
                          ? 'bg-[#009E49] text-white scale-100 shadow-sm'
                          : isActive
                            ? 'bg-[#009E49] text-white scale-105 shadow-sm'
                            : 'bg-[#E4E7EC] text-[#667085]'
                      }`}
                    >
                      {isCompleted ? <Check className='w-3.5 h-3.5 stroke-[3]' /> : s.id}
                    </div>
                    <span
                      className={`text-xs sm:text-sm whitespace-nowrap transition-colors duration-300 ${
                        isActive
                          ? 'font-bold text-[#101828]'
                          : isCompleted
                            ? 'font-medium text-[#344054]'
                            : 'text-[#98A2B3]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content on the Right Column with Smooth Transition */}
          <div className='md:col-span-8 lg:col-span-9 max-w-xl'>
            <div className='mb-8'>
              <h1 className='platypi-gf font-bold text-2xl sm:text-3xl text-[#0B4822] mb-1.5 tracking-tight'>
                Register Your Hackathon Team
              </h1>
              <p className='text-xs sm:text-sm text-[#667085]'>
                Tell us who is building with you and the problem you want to solve.
              </p>
            </div>

            {/* Submission banner: API message and general ("body") errors */}
            {(bannerMessage || errors.body) && (
              <div
                ref={bannerRef}
                role='alert'
                className='mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs sm:text-sm text-red-700'
              >
                {bannerMessage && <p className='font-medium'>{bannerMessage}</p>}
                {errors.body && <p className={bannerMessage ? 'mt-1' : ''}>{errors.body}</p>}
              </div>
            )}

            {/* Smooth Animated Container for Step Changes */}
            <div
              key={currentStep}
              className={`transition-all duration-300 ease-out animate-in fade-in-50 ${
                stepDirection === 'forward' ? 'slide-in-from-right-4' : 'slide-in-from-left-4'
              }`}
            >
              {/* ================= STEP 1: TEAM LEAD ================= */}
              {currentStep === 1 && (
                <div className='space-y-5'>
                  <div {...fieldAttrs('leadFullName')}>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      Full name
                    </label>
                    <input
                      type='text'
                      value={formData.leadFullName}
                      maxLength={MAX_LENGTH.name}
                      onChange={(e) => handleInputChange('leadFullName', e.target.value)}
                      placeholder='Team lead full name'
                      className={inputClass(Boolean(errors.leadFullName))}
                    />
                    <FieldError message={errors.leadFullName} />
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div {...fieldAttrs('leadEmail')}>
                      <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                        Email address
                      </label>
                      <input
                        type='email'
                        value={formData.leadEmail}
                        onChange={(e) => handleInputChange('leadEmail', e.target.value)}
                        placeholder='Team email address'
                        className={inputClass(Boolean(errors.leadEmail))}
                      />
                      <FieldError message={errors.leadEmail} />
                    </div>

                    <div {...fieldAttrs('leadPhone')}>
                      <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                        Phone number
                      </label>
                      <input
                        type='tel'
                        value={formData.leadPhone}
                        onChange={(e) => handleInputChange('leadPhone', e.target.value)}
                        placeholder='Team lead number'
                        className={inputClass(Boolean(errors.leadPhone))}
                      />
                      <FieldError message={errors.leadPhone} />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div {...fieldAttrs('leadLocation')}>
                      <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                        City / Location
                      </label>
                      <input
                        type='text'
                        value={formData.leadLocation}
                        maxLength={MAX_LENGTH.location}
                        onChange={(e) => handleInputChange('leadLocation', e.target.value)}
                        placeholder='Location'
                        className={inputClass(Boolean(errors.leadLocation))}
                      />
                      <FieldError message={errors.leadLocation} />
                    </div>

                    <div {...fieldAttrs('preferredContact')}>
                      <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                        Preferred contact method
                      </label>
                      <CustomDropdown
                        value={formData.preferredContact}
                        onChange={(val) => handleInputChange('preferredContact', val)}
                        placeholder='select method'
                        options={PREFERRED_CONTACT_OPTIONS}
                        error={errors.preferredContact}
                      />
                    </div>
                  </div>

                  <div className='pt-6 flex justify-start'>
                    <button
                      onClick={handleNext}
                      className='inline-flex items-center gap-2 bg-[#009E49] hover:bg-[#00873E] text-white text-sm font-semibold px-8 py-3 rounded-full shadow-md transition-all cursor-pointer'
                    >
                      <span>Next</span>
                      <ArrowRight className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 2: YOUR TEAM ================= */}
              {currentStep === 2 && (
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 items-start'>
                    <div className='sm:col-span-2' {...fieldAttrs('teamName')}>
                      <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                        Team name
                      </label>
                      <input
                        type='text'
                        value={formData.teamName}
                        maxLength={MAX_LENGTH.teamName}
                        onChange={(e) => handleInputChange('teamName', e.target.value)}
                        placeholder='Team name'
                        className={inputClass(Boolean(errors.teamName))}
                      />
                      <FieldError message={errors.teamName} />
                    </div>

                    <div className='relative z-40' {...fieldAttrs('memberCount')}>
                      <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                        Number of members
                      </label>
                      <CustomDropdown
                        value={formData.memberCount}
                        onChange={handleMemberCountChange}
                        placeholder='E.g 2'
                        options={MEMBER_COUNT_OPTIONS}
                        error={errors.memberCount}
                      />
                    </div>
                  </div>

                  <p className='text-xs text-[#667085] -mt-2'>
                    Add {MIN_MEMBERS}–{MAX_MEMBERS} members, not including yourself as team lead.
                  </p>

                  {errors.members && (
                    <div {...fieldAttrs('members')}>
                      <FieldError message={errors.members} />
                    </div>
                  )}

                  {/* Member 1 Placeholder when not entered */}
                  {!showMemberCards && (
                    <div>
                      <div className='text-xs font-medium text-[#344054] mb-2'>Member 1</div>
                      <div className='w-full bg-[#F9FAFB] rounded-xl p-5 text-center text-xs sm:text-sm text-[#667085] border border-[#F2F4F7]'>
                        This section will show up when you select the number of members
                      </div>
                    </div>
                  )}

                  {/* Dynamic Member Cards with Stacked z-index */}
                  {showMemberCards &&
                    formData.members.map((member, idx) => {
                      const key = (field: keyof TeamMember) => `members[${idx}].${field}`;
                      return (
                        <div
                          key={idx}
                          className='bg-[#F9FAFB] rounded-2xl p-5 sm:p-6 border border-[#EAECF0] space-y-4 relative'
                          style={{ zIndex: 30 - idx }}
                        >
                          <h4 className='text-sm font-semibold text-[#101828]'>Member {idx + 1}</h4>

                          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-start'>
                            <div {...fieldAttrs(key('fullName'))}>
                              <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                                Full name
                              </label>
                              <input
                                type='text'
                                value={member.fullName}
                                maxLength={MAX_LENGTH.name}
                                onChange={(e) =>
                                  handleMemberChange(idx, 'fullName', e.target.value)
                                }
                                placeholder='Enter full name'
                                className={inputClass(Boolean(errors[key('fullName')]), 'card')}
                              />
                              <FieldError message={errors[key('fullName')]} />
                            </div>

                            <div {...fieldAttrs(key('email'))}>
                              <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                                Email address
                              </label>
                              <input
                                type='email'
                                value={member.email}
                                onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                                placeholder='Enter email'
                                className={inputClass(Boolean(errors[key('email')]), 'card')}
                              />
                              <FieldError message={errors[key('email')]} />
                            </div>
                          </div>

                          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-start'>
                            <div {...fieldAttrs(key('phoneNumber'))}>
                              <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                                Phone number (Optional)
                              </label>
                              <input
                                type='tel'
                                value={member.phoneNumber}
                                onChange={(e) =>
                                  handleMemberChange(idx, 'phoneNumber', e.target.value)
                                }
                                placeholder='Enter phone number'
                                className={inputClass(Boolean(errors[key('phoneNumber')]), 'card')}
                              />
                              <FieldError message={errors[key('phoneNumber')]} />
                            </div>

                            <div {...fieldAttrs(key('role'))}>
                              <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                                Primary role
                              </label>
                              <CustomDropdown
                                value={member.role}
                                onChange={(role) => handleMemberRoleChange(idx, role)}
                                placeholder='select role'
                                options={ROLE_OPTIONS}
                                error={errors[key('role')]}
                              />
                            </div>
                          </div>

                          {member.role === 'Others' && (
                            <div {...fieldAttrs(key('customRole'))}>
                              <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                                Please specify your role (Optional)
                              </label>
                              <input
                                type='text'
                                value={member.customRole}
                                maxLength={MAX_LENGTH.customRole}
                                onChange={(e) =>
                                  handleMemberChange(idx, 'customRole', e.target.value)
                                }
                                placeholder='e.g. AI Engineer, DevOps...'
                                className={inputClass(Boolean(errors[key('customRole')]), 'card')}
                              />
                              <FieldError message={errors[key('customRole')]} />
                            </div>
                          )}
                        </div>
                      );
                    })}

                  <div className='pt-6 flex items-center gap-4'>
                    <button
                      onClick={handleBackClick}
                      className='bg-[#5E6963] hover:bg-[#4E5852] text-white text-sm font-semibold px-8 py-3 rounded-full transition-all cursor-pointer'
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      className='inline-flex items-center gap-2 bg-[#009E49] hover:bg-[#00873E] text-white text-sm font-semibold px-8 py-3 rounded-full shadow-md transition-all cursor-pointer'
                    >
                      <span>Next</span>
                      <ArrowRight className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 3: THE IDEA ================= */}
              {currentStep === 3 && (
                <div className='space-y-5'>
                  <div {...fieldAttrs('ideaTitle')}>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      Working title of the idea
                    </label>
                    <input
                      type='text'
                      value={formData.ideaTitle}
                      maxLength={MAX_LENGTH.ideaTitle}
                      onChange={(e) => handleInputChange('ideaTitle', e.target.value)}
                      placeholder='Enter title'
                      className={inputClass(Boolean(errors.ideaTitle))}
                    />
                    <FieldError message={errors.ideaTitle} />
                  </div>

                  <div className='relative z-20' {...fieldAttrs('solutionArea')}>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      Which solution area best fits your idea?
                    </label>
                    <CustomDropdown
                      value={formData.solutionArea}
                      onChange={(val) => handleInputChange('solutionArea', val)}
                      placeholder='Select area'
                      options={SOLUTION_AREA_OPTIONS}
                      error={errors.solutionArea}
                    />
                  </div>

                  <div {...fieldAttrs('problemDescription')}>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      Describe the problem you want to solve
                    </label>
                    <textarea
                      rows={3}
                      value={formData.problemDescription}
                      maxLength={MAX_LENGTH.longText}
                      onChange={(e) => handleInputChange('problemDescription', e.target.value)}
                      placeholder='Enter description'
                      className={inputClass(Boolean(errors.problemDescription))}
                    />
                    <FieldError message={errors.problemDescription} />
                  </div>

                  <div {...fieldAttrs('whoExperiencesProblem')}>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      Who experiences this problem most directly?
                    </label>
                    <textarea
                      rows={2}
                      value={formData.whoExperiencesProblem}
                      maxLength={MAX_LENGTH.longText}
                      onChange={(e) => handleInputChange('whoExperiencesProblem', e.target.value)}
                      placeholder='Enter description'
                      className={inputClass(Boolean(errors.whoExperiencesProblem))}
                    />
                    <FieldError message={errors.whoExperiencesProblem} />
                  </div>

                  <div {...fieldAttrs('proposedSolution')}>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      Describe your proposed solution
                    </label>
                    <textarea
                      rows={3}
                      value={formData.proposedSolution}
                      maxLength={MAX_LENGTH.longText}
                      onChange={(e) => handleInputChange('proposedSolution', e.target.value)}
                      placeholder='Enter description here'
                      className={inputClass(Boolean(errors.proposedSolution))}
                    />
                    <FieldError message={errors.proposedSolution} />
                  </div>

                  <div className='relative z-10' {...fieldAttrs('validationStage')}>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      What have you built or validated already?
                    </label>
                    <CustomDropdown
                      value={formData.validationStage}
                      onChange={(val) => handleInputChange('validationStage', val)}
                      placeholder='Select stage'
                      options={VALIDATION_STAGE_OPTIONS}
                      error={errors.validationStage}
                    />
                  </div>

                  <div {...fieldAttrs('prototypeLink')}>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      Link to prototype, deck, repository, or demo (Optional)
                    </label>
                    <input
                      type='text'
                      value={formData.prototypeLink}
                      maxLength={MAX_LENGTH.prototypeLink}
                      onChange={(e) => handleInputChange('prototypeLink', e.target.value)}
                      placeholder='Enter info here'
                      className={inputClass(Boolean(errors.prototypeLink))}
                    />
                    <FieldError message={errors.prototypeLink} />
                  </div>

                  <div {...fieldAttrs('uniqueApproach')}>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      What makes this approach different or useful?
                    </label>
                    <textarea
                      rows={2}
                      value={formData.uniqueApproach}
                      maxLength={MAX_LENGTH.longText}
                      onChange={(e) => handleInputChange('uniqueApproach', e.target.value)}
                      placeholder='Enter description here'
                      className={inputClass(Boolean(errors.uniqueApproach))}
                    />
                    <FieldError message={errors.uniqueApproach} />
                  </div>

                  <div {...fieldAttrs('nextSteps')}>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      What would you need to move from MVP to a launched product?
                    </label>
                    <textarea
                      rows={2}
                      value={formData.nextSteps}
                      maxLength={MAX_LENGTH.longText}
                      onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                      placeholder='Enter description here'
                      className={inputClass(Boolean(errors.nextSteps))}
                    />
                    <FieldError message={errors.nextSteps} />
                  </div>

                  <div className='pt-6 flex items-center gap-4'>
                    <button
                      onClick={handleBackClick}
                      className='bg-[#5E6963] hover:bg-[#4E5852] text-white text-sm font-semibold px-8 py-3 rounded-full transition-all cursor-pointer'
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      className='inline-flex items-center gap-2 bg-[#009E49] hover:bg-[#00873E] text-white text-sm font-semibold px-8 py-3 rounded-full shadow-md transition-all cursor-pointer'
                    >
                      <span>Next</span>
                      <ArrowRight className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 4: CONFIRMATION ================= */}
              {currentStep === 4 && (
                <div className='space-y-6'>
                  <div className='relative z-20' {...fieldAttrs('referralSource')}>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      How did you hear about the hackathon?
                    </label>
                    <CustomDropdown
                      value={formData.referralSource}
                      onChange={handleReferralChange}
                      placeholder='Select option'
                      options={REFERRAL_OPTIONS}
                      error={errors.referralSource}
                    />
                  </div>

                  {formData.referralSource === 'Other' && (
                    <div {...fieldAttrs('referralSourceOther')}>
                      <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                        Please specify (Optional)
                      </label>
                      <input
                        type='text'
                        value={formData.referralSourceOther}
                        maxLength={MAX_LENGTH.referralSourceOther}
                        onChange={(e) => handleInputChange('referralSourceOther', e.target.value)}
                        placeholder='Where did you hear about us?'
                        className={inputClass(Boolean(errors.referralSourceOther))}
                      />
                      <FieldError message={errors.referralSourceOther} />
                    </div>
                  )}

                  <div className='relative z-10' {...fieldAttrs('agreeTerms')}>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      Do all team members agree to participate under the official hackathon terms?
                    </label>
                    <CustomDropdown
                      value={formData.agreeTerms}
                      onChange={(val) => handleInputChange('agreeTerms', val)}
                      placeholder='Select option'
                      options={[
                        { label: 'Yes, we agree', value: 'Yes' },
                        { label: 'No', value: 'No' }
                      ]}
                      error={errors.agreeTerms}
                    />
                  </div>

                  <div className='space-y-4 pt-2'>
                    <div {...fieldAttrs('confirmAccurate1')}>
                      <label className='flex items-start gap-3 cursor-pointer group'>
                        <input
                          type='checkbox'
                          checked={formData.confirmAccurate1}
                          onChange={(e) => handleInputChange('confirmAccurate1', e.target.checked)}
                          className='mt-1 w-4 h-4 rounded text-[#009E49] focus:ring-[#009E49] border-[#D0D5DD]'
                        />
                        <span className='text-xs sm:text-[13px] text-[#475467] leading-relaxed group-hover:text-[#101828]'>
                          I confirm that the details provided are accurate and that I am submitting
                          on behalf of my team.
                        </span>
                      </label>
                      <FieldError message={errors.confirmAccurate1} />
                    </div>

                    <div {...fieldAttrs('confirmAccurate2')}>
                      <label className='flex items-start gap-3 cursor-pointer group'>
                        <input
                          type='checkbox'
                          checked={formData.confirmAccurate2}
                          onChange={(e) => handleInputChange('confirmAccurate2', e.target.checked)}
                          className='mt-1 w-4 h-4 rounded text-[#009E49] focus:ring-[#009E49] border-[#D0D5DD]'
                        />
                        <span className='text-xs sm:text-[13px] text-[#475467] leading-relaxed group-hover:text-[#101828]'>
                          I confirm that the details provided are accurate and that I am submitting
                          on behalf of my team.
                        </span>
                      </label>
                      <FieldError message={errors.confirmAccurate2} />
                    </div>
                  </div>

                  <div className='pt-6 flex items-center gap-4'>
                    <button
                      onClick={handleBackClick}
                      disabled={isSubmitting}
                      className='bg-[#5E6963] hover:bg-[#4E5852] text-white text-sm font-semibold px-8 py-3 rounded-full transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      className='inline-flex items-center gap-2 bg-[#009E49] hover:bg-[#00873E] text-white text-sm font-semibold px-8 py-3 rounded-full shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#009E49]'
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className='w-4 h-4 animate-spin' />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit</span>
                          <ArrowRight className='w-4 h-4' />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          if (onBack) {
            onBack();
          } else {
            navigate('/hackathon');
          }
        }}
        title='Registration Submitted!'
        message={`Thank you for registering your team for the Ogun Digital Summit 2026 Hackathon. We have received your submission and will be in touch shortly.  `}
      />
    </div>
  );
}
