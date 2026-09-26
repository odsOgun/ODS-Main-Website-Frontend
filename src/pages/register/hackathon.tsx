import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '@/components/shared/SuccessModal';
import { Check, ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';

interface TeamMember {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  customRole?: string;
}

interface HackathonRegistrationData {
  // Step 1: Team lead
  leadFullName: string;
  leadEmail: string;
  leadPhone: string;
  leadLocation: string;
  preferredContact: string;

  // Step 2: Your team
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
  agreeTerms: string;
  confirmAccurate1: boolean;
  confirmAccurate2: boolean;
}

interface HackathonRegistrationProps {
  onBack?: () => void;
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

// Special Role Dropdown with integrated "Others" option and Enter-to-apply input
interface RoleDropdownProps {
  value: string;
  customRole?: string;
  onChange: (role: string, customRole?: string) => void;
  error?: string;
}

function RoleDropdown({ value, customRole, onChange, error }: RoleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showOthersInput, setShowOthersInput] = useState(false);
  const [typedRole, setTypedRole] = useState(customRole || '');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const standardRoles = [
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'UI/UX Designer',
    'Product Manager',
    'Data Specialist',
    'Mobile Developer',
    'Domain Expert'
  ];

  function isStandardRole(role: string) {
    return standardRoles.includes(role);
  }

  // Keep typedRole synced when props change
  useEffect(() => {
    if (customRole) {
      setTypedRole(customRole);
    } else if (value && !isStandardRole(value)) {
      setTypedRole(value);
    }
  }, [value, customRole]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowOthersInput(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRole = (role: string) => {
    if (role === 'Others') {
      setShowOthersInput(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setShowOthersInput(false);
      setIsOpen(false);
      onChange(role, '');
    }
  };

  const handleConfirmCustom = () => {
    const trimmed = typedRole.trim();
    if (trimmed) {
      setShowOthersInput(false);
      setIsOpen(false);
      onChange(trimmed, trimmed);
    }
  };

  const displayLabel = value || 'select role';
  const hasValue = Boolean(value);

  return (
    <div ref={dropdownRef} className='relative w-full'>
      <button
        type='button'
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen && value && !isStandardRole(value)) {
            setShowOthersInput(true);
          }
        }}
        className={`w-full px-4 py-3 rounded-xl border text-sm flex items-center justify-between text-left transition-all cursor-pointer bg-white ${
          error
            ? 'border-red-400 focus:border-red-500 ring-2 ring-red-200'
            : isOpen
              ? 'border-[#009E49] ring-2 ring-[#009E49]/20'
              : 'border-[#D0D5DD] hover:border-[#98A2B3]'
        }`}
      >
        <span className={hasValue ? 'text-[#101828] font-normal' : 'text-[#98A2B3]'}>
          {displayLabel}
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
          className='absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-xl border border-[#EAECF0] shadow-xl py-1.5 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-150'
        >
          {/* If a custom typed role is active, show it as selected */}
          {value && !isStandardRole(value) && (
            <button
              type='button'
              onMouseDown={(e) => {
                e.stopPropagation();
                handleConfirmCustom();
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleConfirmCustom();
              }}
              className='w-full px-4 py-2.5 text-sm text-left flex items-center justify-between bg-[#EBFDF0] text-[#009E49] font-medium'
            >
              <span>{value} (Custom)</span>
              <Check className='w-4 h-4 text-[#009E49] stroke-[2.5]' />
            </button>
          )}

          {standardRoles.map((role) => {
            const isSelected = value === role;
            return (
              <button
                key={role}
                type='button'
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleSelectRole(role);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectRole(role);
                }}
                className={`w-full px-4 py-2.5 text-sm text-left flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#EBFDF0] text-[#009E49] font-medium'
                    : 'text-[#344054] hover:bg-[#F9FAFB] hover:text-[#101828]'
                }`}
              >
                <span>{role}</span>
                {isSelected && <Check className='w-4 h-4 text-[#009E49] stroke-[2.5]' />}
              </button>
            );
          })}

          {/* Others Option */}
          <button
            type='button'
            onMouseDown={(e) => {
              e.stopPropagation();
              handleSelectRole('Others');
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectRole('Others');
            }}
            className={`w-full px-4 py-2.5 text-sm text-left flex items-center justify-between border-t border-[#F2F4F7] transition-colors cursor-pointer ${
              showOthersInput
                ? 'bg-[#EBFDF0] text-[#009E49] font-medium'
                : 'text-[#344054] hover:bg-[#F9FAFB] hover:text-[#101828]'
            }`}
          >
            <span>Others</span>
            <span className='text-xs text-[#667085]'>Type role →</span>
          </button>

          {/* Inline input directly inside dropdown when "Others" is selected */}
          {showOthersInput && (
            <div className='p-3 bg-[#F9FAFB] border-t border-[#EAECF0] rounded-b-xl'>
              <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                Type role & press Enter ⏎
              </label>
              <div className='flex items-center gap-2'>
                <input
                  ref={inputRef}
                  type='text'
                  value={typedRole}
                  onChange={(e) => setTypedRole(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleConfirmCustom();
                    }
                  }}
                  placeholder='e.g. AI Engineer, DevOps...'
                  className='w-full bg-white px-3 py-2 rounded-lg border border-[#D0D5DD] text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#009E49] focus:ring-2 focus:ring-[#009E49]/20'
                  autoFocus
                />
                <button
                  type='button'
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleConfirmCustom();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirmCustom();
                  }}
                  className='px-3 py-2 bg-[#009E49] hover:bg-[#00873E] text-white text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer shadow-sm'
                >
                  Enter ⏎
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* External pill indicator when custom role is active */}
      {value && !isStandardRole(value) && (
        <div className='mt-2 flex items-center justify-between text-xs text-[#009E49] bg-[#EBFDF0] px-3 py-1.5 rounded-lg border border-[#A6F4C5]'>
          <span>
            Role set to: <strong className='font-semibold'>{value}</strong>
          </span>
          <button
            type='button'
            onClick={() => {
              setIsOpen(true);
              setShowOthersInput(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className='underline text-xs text-[#00873E] hover:text-[#005728] ml-2 font-medium cursor-pointer'
          >
            Change
          </button>
        </div>
      )}

      {error && <span className='text-red-500 text-xs mt-1 block'>{error}</span>}
    </div>
  );
}

// Phone number validation helper: digits between 10 and 15
export const isValidPhoneNumber = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  const stripped = phone.replace(/[\s\-().]/g, '');
  if (!/^\+?[0-9]+$/.test(stripped)) return false;
  const digitsOnly = stripped.replace(/\+/, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

export default function HackathonRegistration({ onBack }: HackathonRegistrationProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepDirection, setStepDirection] = useState<'forward' | 'backward'>('forward');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<HackathonRegistrationData>({
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
    agreeTerms: '',
    confirmAccurate1: false,
    confirmAccurate2: false
  });

  const handleInputChange = <K extends keyof HackathonRegistrationData>(
    field: K,
    value: HackathonRegistrationData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleMemberCountChange = (countStr: string) => {
    handleInputChange('memberCount', countStr);
    const count = parseInt(countStr, 10);
    if (!isNaN(count) && count > 0) {
      const sanitizedCount = Math.min(Math.max(count, 1), 6);
      const updatedMembers: TeamMember[] = [];
      for (let i = 0; i < sanitizedCount; i++) {
        updatedMembers.push(
          formData.members[i] || {
            fullName: '',
            email: '',
            phoneNumber: '',
            role: '',
            customRole: ''
          }
        );
      }
      setFormData((prev) => ({ ...prev, memberCount: countStr, members: updatedMembers }));
    } else {
      setFormData((prev) => ({ ...prev, memberCount: countStr, members: [] }));
    }
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...formData.members];
    if (updatedMembers[index]) {
      updatedMembers[index] = { ...updatedMembers[index], [field]: value };
      setFormData((prev) => ({ ...prev, members: updatedMembers }));
      // Clear associated error
      const errorKey = `member_${field}_${index}`;
      if (errors[errorKey]) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy[errorKey];
          return copy;
        });
      }
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.leadFullName.trim()) {
        newErrors.leadFullName = 'Full name is required';
      }
      if (!formData.leadEmail.trim()) {
        newErrors.leadEmail = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.leadEmail)) {
        newErrors.leadEmail = 'Please enter a valid email address';
      }
      if (!formData.leadPhone.trim()) {
        newErrors.leadPhone = 'Phone number is required';
      } else if (!isValidPhoneNumber(formData.leadPhone)) {
        newErrors.leadPhone = 'Please enter a valid phone number (at least 10 digits)';
      }
    } else if (currentStep === 2) {
      if (!formData.teamName.trim()) {
        newErrors.teamName = 'Team name is required';
      }
      formData.members.forEach((member, idx) => {
        if (member.phoneNumber && !isValidPhoneNumber(member.phoneNumber)) {
          newErrors[`member_phoneNumber_${idx}`] = 'Please enter a valid phone number';
        }
        if (!member.role || !member.role.trim() || member.role === 'Others') {
          newErrors[`member_role_${idx}`] = 'Primary role is required';
        }
      });
    } else if (currentStep === 3) {
      if (!formData.ideaTitle.trim()) newErrors.ideaTitle = 'Working title is required';
      if (!formData.solutionArea) newErrors.solutionArea = 'Please select a solution area';
      if (!formData.problemDescription.trim())
        newErrors.problemDescription = 'Description is required';
    } else if (currentStep === 4) {
      if (!formData.referralSource) newErrors.referralSource = 'Please select an option';
      if (formData.agreeTerms !== 'Yes') newErrors.agreeTerms = 'Team must agree to terms';
      if (!formData.confirmAccurate1 || !formData.confirmAccurate2) {
        newErrors.confirm = 'Please confirm both declarations';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 4) {
        setStepDirection('forward');
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setShowSuccessModal(true);
      }
    }
  };

  const handleBackClick = () => {
    if (currentStep > 1) {
      setStepDirection('backward');
      setCurrentStep((prev) => prev - 1);
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

  const parsedMemberCount = parseInt(formData.memberCount, 10);
  const showMemberCards =
    !isNaN(parsedMemberCount) && parsedMemberCount > 0 && formData.members.length > 0;

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
            className='inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#475467] hover:text-[#101828] transition-colors cursor-pointer group'
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
                  <div>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      Full name
                    </label>
                    <input
                      type='text'
                      value={formData.leadFullName}
                      onChange={(e) => handleInputChange('leadFullName', e.target.value)}
                      placeholder='Team lead full name'
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none transition-all ${
                        errors.leadFullName
                          ? 'border-red-400 focus:border-red-500 ring-2 ring-red-200'
                          : 'border-[#D0D5DD] focus:border-[#009E49] focus:ring-2 focus:ring-[#009E49]/20'
                      }`}
                    />
                    {errors.leadFullName && (
                      <span className='text-red-500 text-xs mt-1 block'>{errors.leadFullName}</span>
                    )}
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                        Email address
                      </label>
                      <input
                        type='email'
                        value={formData.leadEmail}
                        onChange={(e) => handleInputChange('leadEmail', e.target.value)}
                        placeholder='Team email address'
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none transition-all ${
                          errors.leadEmail
                            ? 'border-red-400 focus:border-red-500 ring-2 ring-red-200'
                            : 'border-[#D0D5DD] focus:border-[#009E49] focus:ring-2 focus:ring-[#009E49]/20'
                        }`}
                      />
                      {errors.leadEmail && (
                        <span className='text-red-500 text-xs mt-1 block'>{errors.leadEmail}</span>
                      )}
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                        Phone number
                      </label>
                      <input
                        type='tel'
                        value={formData.leadPhone}
                        onChange={(e) => handleInputChange('leadPhone', e.target.value)}
                        placeholder='Team lead number'
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none transition-all ${
                          errors.leadPhone
                            ? 'border-red-400 focus:border-red-500 ring-2 ring-red-200'
                            : 'border-[#D0D5DD] focus:border-[#009E49] focus:ring-2 focus:ring-[#009E49]/20'
                        }`}
                      />
                      {errors.leadPhone && (
                        <span className='text-red-500 text-xs mt-1 block'>{errors.leadPhone}</span>
                      )}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                        City / Location
                      </label>
                      <input
                        type='text'
                        value={formData.leadLocation}
                        onChange={(e) => handleInputChange('leadLocation', e.target.value)}
                        placeholder='Location'
                        className='w-full px-4 py-3 rounded-xl border border-[#D0D5DD] text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#009E49] focus:ring-2 focus:ring-[#009E49]/20 transition-all'
                      />
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                        Preferred contact method
                      </label>
                      <CustomDropdown
                        value={formData.preferredContact}
                        onChange={(val) => handleInputChange('preferredContact', val)}
                        placeholder='select method'
                        options={['WhatsApp', 'Email', 'Phone call']}
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
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 items-end'>
                    <div className='sm:col-span-2'>
                      <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                        Team name
                      </label>
                      <input
                        type='text'
                        value={formData.teamName}
                        onChange={(e) => handleInputChange('teamName', e.target.value)}
                        placeholder='Team lead full name'
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none transition-all ${
                          errors.teamName
                            ? 'border-red-400 focus:border-red-500 ring-2 ring-red-200'
                            : 'border-[#D0D5DD] focus:border-[#009E49] focus:ring-2 focus:ring-[#009E49]/20'
                        }`}
                      />
                      {errors.teamName && (
                        <span className='text-red-500 text-xs mt-1 block'>{errors.teamName}</span>
                      )}
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                        Number if member
                      </label>
                      <input
                        type='number'
                        min='1'
                        max='6'
                        value={formData.memberCount}
                        onChange={(e) => handleMemberCountChange(e.target.value)}
                        placeholder='E.g 2'
                        className='w-full px-4 py-3 rounded-xl border border-[#D0D5DD] text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#009E49] focus:ring-2 focus:ring-[#009E49]/20 transition-all'
                      />
                    </div>
                  </div>

                  {/* Member 1 Placeholder when not entered */}
                  {!showMemberCards && (
                    <div>
                      <div className='text-xs font-medium text-[#344054] mb-2'>Member 1</div>
                      <div className='w-full bg-[#F9FAFB] rounded-xl p-5 text-center text-xs sm:text-sm text-[#667085] border border-[#F2F4F7]'>
                        This section will show up when your enter number of members
                      </div>
                    </div>
                  )}

                  {/* Dynamic Member Cards with Stacked z-index */}
                  {showMemberCards &&
                    formData.members.map((member, idx) => (
                      <div
                        key={idx}
                        className='bg-[#F9FAFB] rounded-2xl p-5 sm:p-6 border border-[#EAECF0] space-y-4 relative'
                        style={{ zIndex: 30 - idx }}
                      >
                        <h4 className='text-sm font-semibold text-[#101828]'>Member {idx + 1}</h4>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                          <div>
                            <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                              Full name
                            </label>
                            <input
                              type='text'
                              value={member.fullName}
                              onChange={(e) => handleMemberChange(idx, 'fullName', e.target.value)}
                              placeholder='Enter full name'
                              className='w-full bg-white px-3.5 py-2.5 rounded-xl border border-[#D0D5DD] text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#009E49]'
                            />
                          </div>

                          <div>
                            <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                              Email address
                            </label>
                            <input
                              type='email'
                              value={member.email}
                              onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                              placeholder='Enter email'
                              className='w-full bg-white px-3.5 py-2.5 rounded-xl border border-[#D0D5DD] text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#009E49]'
                            />
                          </div>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-start'>
                          <div>
                            <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                              Phone number
                            </label>
                            <input
                              type='tel'
                              value={member.phoneNumber}
                              onChange={(e) =>
                                handleMemberChange(idx, 'phoneNumber', e.target.value)
                              }
                              placeholder='Enter phone number'
                              className={`w-full bg-white px-3.5 py-2.5 rounded-xl border text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none ${
                                errors[`member_phoneNumber_${idx}`]
                                  ? 'border-red-400 focus:border-red-500 ring-2 ring-red-200'
                                  : 'border-[#D0D5DD] focus:border-[#009E49]'
                              }`}
                            />
                            {errors[`member_phoneNumber_${idx}`] && (
                              <span className='text-red-500 text-xs mt-1 block'>
                                {errors[`member_phoneNumber_${idx}`]}
                              </span>
                            )}
                          </div>

                          <div>
                            <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                              Primary role
                            </label>
                            <RoleDropdown
                              value={member.role}
                              customRole={member.customRole}
                              onChange={(role, customRole) => {
                                const updated = [...formData.members];
                                if (updated[idx]) {
                                  updated[idx] = {
                                    ...updated[idx],
                                    role: role,
                                    customRole: customRole || ''
                                  };
                                  setFormData((prev) => ({ ...prev, members: updated }));
                                  if (errors[`member_role_${idx}`]) {
                                    setErrors((prev) => {
                                      const copy = { ...prev };
                                      delete copy[`member_role_${idx}`];
                                      return copy;
                                    });
                                  }
                                }
                              }}
                              error={errors[`member_role_${idx}`]}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

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
                  <div>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      Working title of the idea
                    </label>
                    <input
                      type='text'
                      value={formData.ideaTitle}
                      onChange={(e) => handleInputChange('ideaTitle', e.target.value)}
                      placeholder='Enter title'
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none transition-all ${
                        errors.ideaTitle
                          ? 'border-red-400 focus:border-red-500 ring-2 ring-red-200'
                          : 'border-[#D0D5DD] focus:border-[#009E49]'
                      }`}
                    />
                    {errors.ideaTitle && (
                      <span className='text-red-500 text-xs mt-1 block'>{errors.ideaTitle}</span>
                    )}
                  </div>

                  <div>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      Which solution area best fits your idea?
                    </label>
                    <CustomDropdown
                      value={formData.solutionArea}
                      onChange={(val) => handleInputChange('solutionArea', val)}
                      placeholder='Select area'
                      options={[
                        'Edtech',
                        'Fintech',
                        'Proptech & Real Estate',
                        'Healthtech & Telemedicine',
                        'Agrictech & Food Security',
                        'AI / Machine Learning',
                        'Others'
                      ]}
                      error={errors.solutionArea}
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      Describe the problem you want to solve
                    </label>
                    <textarea
                      rows={3}
                      value={formData.problemDescription}
                      onChange={(e) => handleInputChange('problemDescription', e.target.value)}
                      placeholder='Enter description'
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none transition-all ${
                        errors.problemDescription
                          ? 'border-red-400 focus:border-red-500 ring-2 ring-red-200'
                          : 'border-[#D0D5DD] focus:border-[#009E49]'
                      }`}
                    />
                    {errors.problemDescription && (
                      <span className='text-red-500 text-xs mt-1 block'>
                        {errors.problemDescription}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      Who experiences this problem most directly?
                    </label>
                    <textarea
                      rows={2}
                      value={formData.whoExperiencesProblem}
                      onChange={(e) => handleInputChange('whoExperiencesProblem', e.target.value)}
                      placeholder='Enter description'
                      className='w-full px-4 py-3 rounded-xl border border-[#D0D5DD] text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#009E49]'
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      Describe your proposed solution
                    </label>
                    <textarea
                      rows={3}
                      value={formData.proposedSolution}
                      onChange={(e) => handleInputChange('proposedSolution', e.target.value)}
                      placeholder='Enter description here'
                      className='w-full px-4 py-3 rounded-xl border border-[#D0D5DD] text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#009E49]'
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      What have you built or validated already?
                    </label>
                    <CustomDropdown
                      value={formData.validationStage}
                      onChange={(val) => handleInputChange('validationStage', val)}
                      placeholder='Select stage'
                      options={[
                        'Idea stage / Market research',
                        'Wireframes / Figma prototypes',
                        'Working prototype / MVP',
                        'Live in pilot / Early users'
                      ]}
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      Link to prototype, deck, repository, or demo (Optional)
                    </label>
                    <input
                      type='text'
                      value={formData.prototypeLink}
                      onChange={(e) => handleInputChange('prototypeLink', e.target.value)}
                      placeholder='Enter info here'
                      className='w-full px-4 py-3 rounded-xl border border-[#D0D5DD] text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#009E49]'
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      What makes this approach different or useful?
                    </label>
                    <textarea
                      rows={2}
                      value={formData.uniqueApproach}
                      onChange={(e) => handleInputChange('uniqueApproach', e.target.value)}
                      placeholder='Enter description here'
                      className='w-full px-4 py-3 rounded-xl border border-[#D0D5DD] text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#009E49]'
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      What would you need to move from MVP to a launched product?
                    </label>
                    <input
                      type='text'
                      value={formData.nextSteps}
                      onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                      placeholder='Select area'
                      className='w-full px-4 py-3 rounded-xl border border-[#D0D5DD] text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#009E49]'
                    />
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
                  <div>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      How did you hear about the hackathon?
                    </label>
                    <CustomDropdown
                      value={formData.referralSource}
                      onChange={(val) => handleInputChange('referralSource', val)}
                      placeholder='Select area'
                      options={[
                        'Twitter / X',
                        'Instagram',
                        'LinkedIn',
                        'Friend or Colleague',
                        'Tech Community / WhatsApp',
                        'Ogun Tech Hub',
                        'Other'
                      ]}
                      error={errors.referralSource}
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-medium text-[#344054] mb-1.5'>
                      Do all team members agree to participate under the official hackathon terms?
                    </label>
                    <CustomDropdown
                      value={formData.agreeTerms}
                      onChange={(val) => handleInputChange('agreeTerms', val)}
                      placeholder='Select area'
                      options={[
                        { label: 'Yes, we agree', value: 'Yes' },
                        { label: 'No', value: 'No' }
                      ]}
                      error={errors.agreeTerms}
                    />
                  </div>

                  <div className='space-y-4 pt-2'>
                    <label className='flex items-start gap-3 cursor-pointer group'>
                      <input
                        type='checkbox'
                        checked={formData.confirmAccurate1}
                        onChange={(e) => handleInputChange('confirmAccurate1', e.target.checked)}
                        className='mt-1 w-4 h-4 rounded text-[#009E49] focus:ring-[#009E49] border-[#D0D5DD]'
                      />
                      <span className='text-xs sm:text-[13px] text-[#475467] leading-relaxed group-hover:text-[#101828]'>
                        I confirm that the details provided are accurate and that I am submitting on
                        behalf of my team.
                      </span>
                    </label>

                    <label className='flex items-start gap-3 cursor-pointer group'>
                      <input
                        type='checkbox'
                        checked={formData.confirmAccurate2}
                        onChange={(e) => handleInputChange('confirmAccurate2', e.target.checked)}
                        className='mt-1 w-4 h-4 rounded text-[#009E49] focus:ring-[#009E49] border-[#D0D5DD]'
                      />
                      <span className='text-xs sm:text-[13px] text-[#475467] leading-relaxed group-hover:text-[#101828]'>
                        I confirm that the details provided are accurate and that I am submitting on
                        behalf of my team.
                      </span>
                    </label>

                    {errors.confirm && (
                      <span className='text-red-500 text-xs mt-1 block'>{errors.confirm}</span>
                    )}
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
        message='Thank you for registering your team for the Ogun Digital Summit 2026 Hackathon. We have received your submission and will be in touch shortly.'
      />
    </div>
  );
}
