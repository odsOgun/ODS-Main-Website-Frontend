import RegisterLayout from '@/components/layouts/registerLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, type ApiError } from '@/api/apiService';
import SuccessModal from '@/components/shared/SuccessModal';
import ErrorModal from '@/components/shared/ErrorModal';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  founderPhoneNumber: string;
  founderEmail: string;
  founderTitle: string;
  location: string;
  socialLink: string;
  canAttendPhysically: string;
  startupName: string;
  startupSector: string;
  startupSectorOther: string;
  startupStage: string;
  wantsToPitch: string;
  website: string;
  startupTwitterUrl: string;
  startupLinkedinUrl: string;
  pitchDeckUrl: string;
}

interface FormErrors {
  firstName: string;
  lastName: string;
  founderPhoneNumber: string;
  founderEmail: string;
  founderTitle: string;
  location: string;
  socialLink: string;
  canAttendPhysically: string;
  startupName: string;
  startupSector: string;
  startupSectorOther: string;
  startupStage: string;
  wantsToPitch: string;
  website: string;
  startupTwitterUrl: string;
  startupLinkedinUrl: string;
  pitchDeckUrl: string;
}

const SECTORS = [
  'PropTech',
  'Fintech',
  'EdTech',
  'BioTech',
  'AgriTech',
  'HealthTech',
  'SaaS',
  'others'
];
const STARTUP_STAGES = [
  'Pre Seed Round',
  'Seed Round',
  'MVP',
  'Pre Revenue',
  'Revenue (Generating)',
  'Series A'
];
const YES_NO_OPTIONS = ['Yes', 'No'];
const URL_FIELDS: (keyof FormData)[] = [
  'socialLink',
  'website',
  'startupTwitterUrl',
  'startupLinkedinUrl',
  'pitchDeckUrl'
];
const SECTION_TITLES = [
  "Let's start with your personal details",
  "Let's Understand you more",
  'Tell us more about your Startup',
  'Complete your startup application'
];
const SECTION_LABELS = ['Personal details', 'Your background', 'Your startup', 'Confirmation'];
const SECTION_FIELDS: (keyof FormData)[][] = [
  ['firstName', 'lastName', 'founderTitle', 'founderPhoneNumber', 'founderEmail'],
  ['location', 'socialLink', 'canAttendPhysically'],
  ['startupName', 'website', 'startupTwitterUrl', 'startupLinkedinUrl', 'pitchDeckUrl'],
  ['startupSector', 'startupSectorOther', 'startupStage', 'wantsToPitch']
];

const inputClass = (hasError: boolean) =>
  `w-full h-auto px-4 py-3 rounded-xl border text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none transition-all ${
    hasError
      ? 'border-red-400 focus:border-red-500 ring-2 ring-red-200'
      : 'border-[#D0D5DD] focus:border-[#009E49] focus:ring-2 focus:ring-[#009E49]/20'
  }`;

const selectClass = (hasError: boolean) =>
  `w-full px-4 py-3 rounded-xl border text-sm text-[#101828] focus:outline-none transition-all ${
    hasError
      ? 'border-red-400 focus:border-red-500 ring-2 ring-red-200'
      : 'border-[#D0D5DD] focus:border-[#009E49] focus:ring-2 focus:ring-[#009E49]/20'
  }`;

const getApiFieldErrors = (data: unknown): Partial<FormErrors> => {
  if (!data || typeof data !== 'object' || !('errors' in data)) return {};

  const apiErrors = data.errors;
  if (!apiErrors || typeof apiErrors !== 'object') return {};

  return Object.entries(apiErrors).reduce((fieldErrors, [field, value]) => {
    const fieldName = field === 'sector' ? 'startupSector' : field;
    if (fieldName in fieldErrors) {
      fieldErrors[fieldName as keyof FormErrors] = Array.isArray(value)
        ? value.join(', ')
        : String(value);
    }
    return fieldErrors;
  }, {} as Partial<FormErrors>);
};

const Startup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    founderPhoneNumber: '',
    founderEmail: '',
    founderTitle: '',
    location: '',
    socialLink: '',
    canAttendPhysically: '',
    startupName: '',
    startupSector: '',
    startupSectorOther: '',
    startupStage: '',
    wantsToPitch: '',
    website: '',
    startupTwitterUrl: '',
    startupLinkedinUrl: '',
    pitchDeckUrl: ''
  });

  const [errors, setErrors] = useState<FormErrors>({
    firstName: '',
    lastName: '',
    founderPhoneNumber: '',
    founderEmail: '',
    founderTitle: '',
    location: '',
    socialLink: '',
    canAttendPhysically: '',
    startupName: '',
    startupSector: '',
    startupSectorOther: '',
    startupStage: '',
    wantsToPitch: '',
    website: '',
    startupTwitterUrl: '',
    startupLinkedinUrl: '',
    pitchDeckUrl: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateNigerianPhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    const patterns = [/^\+234[789][01]\d{8}$/, /^234[789][01]\d{8}$/, /^0[789][01]\d{8}$/];
    return patterns.some((pattern) => pattern.test(cleanPhone));
  };

  const validateUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      firstName: '',
      lastName: '',
      founderPhoneNumber: '',
      founderEmail: '',
      founderTitle: '',
      location: '',
      socialLink: '',
      canAttendPhysically: '',
      startupName: '',
      startupSector: '',
      startupSectorOther: '',
      startupStage: '',
      wantsToPitch: '',
      website: '',
      startupTwitterUrl: '',
      startupLinkedinUrl: '',
      pitchDeckUrl: ''
    };

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.founderTitle.trim()) newErrors.founderTitle = 'Title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    URL_FIELDS.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      } else if (!validateUrl(formData[field].trim())) {
        newErrors[field] = 'Please enter a valid HTTP or HTTPS URL';
      }
    });

    if (!formData.founderEmail.trim()) {
      newErrors.founderEmail = 'Founder email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.founderEmail)) {
      newErrors.founderEmail = 'Please enter a valid email';
    }

    if (!formData.founderPhoneNumber.trim()) {
      newErrors.founderPhoneNumber = 'Founder phone number is required';
    } else if (!validateNigerianPhoneNumber(formData.founderPhoneNumber)) {
      newErrors.founderPhoneNumber =
        'Please enter a valid Nigerian phone number (e.g., +234 803 123 4567 or 0803 123 4567)';
    }

    if (!formData.startupName.trim()) {
      newErrors.startupName = 'Startup name is required';
    }

    if (!YES_NO_OPTIONS.includes(formData.canAttendPhysically)) {
      newErrors.canAttendPhysically = 'Please select Yes or No';
    }
    if (!SECTORS.includes(formData.startupSector)) {
      newErrors.startupSector = 'Please select a valid startup sector';
    }
    if (formData.startupSector === 'others' && !formData.startupSectorOther.trim()) {
      newErrors.startupSectorOther = 'Please enter your startup sector';
    }
    if (!STARTUP_STAGES.includes(formData.startupStage)) {
      newErrors.startupStage = 'Please select a valid startup stage';
    }
    if (!YES_NO_OPTIONS.includes(formData.wantsToPitch)) {
      newErrors.wantsToPitch = 'Please select Yes or No';
    }

    const fieldsToCheck = currentSection
      ? SECTION_FIELDS[currentSection - 1]
      : (Object.keys(newErrors) as (keyof FormErrors)[]);
    const visibleErrors = Object.keys(newErrors).reduce((sectionErrors, field) => {
      const fieldName = field as keyof FormErrors;
      sectionErrors[fieldName] = fieldsToCheck.includes(fieldName) ? newErrors[fieldName] : '';
      return sectionErrors;
    }, {} as FormErrors);
    setErrors(visibleErrors);
    return fieldsToCheck.every((field) => !newErrors[field]);
  };

  const handleNextSection = (): void => {
    if (validateForm() && currentSection < SECTION_TITLES.length) {
      setCurrentSection((section) => section + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        founderPhoneNumber: formData.founderPhoneNumber.trim(),
        founderEmail: formData.founderEmail.trim(),
        founderTitle: formData.founderTitle.trim(),
        location: formData.location.trim(),
        socialLink: formData.socialLink.trim(),
        canAttendPhysically: formData.canAttendPhysically,
        startupName: formData.startupName.trim(),
        startupSector: formData.startupSector,
        startupSectorOther: formData.startupSectorOther.trim(),
        startupStage: formData.startupStage,
        wantsToPitch: formData.wantsToPitch,
        website: formData.website.trim(),
        startupTwitterUrl: formData.startupTwitterUrl.trim(),
        startupLinkedinUrl: formData.startupLinkedinUrl.trim(),
        pitchDeckUrl: formData.pitchDeckUrl.trim()
      };

      await apiService.startup.create(payload);

      setFormData({
        firstName: '',
        lastName: '',
        founderPhoneNumber: '',
        founderEmail: '',
        founderTitle: '',
        location: '',
        socialLink: '',
        canAttendPhysically: '',
        startupName: '',
        startupSector: '',
        startupSectorOther: '',
        startupStage: '',
        wantsToPitch: '',
        website: '',
        startupTwitterUrl: '',
        startupLinkedinUrl: '',
        pitchDeckUrl: ''
      });
      setShowSuccessModal(true);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.status === 400) {
        setErrors((previousErrors) => ({
          ...previousErrors,
          ...getApiFieldErrors(apiError.data)
        }));
        setErrorMessage(apiError.message || 'Please correct the highlighted fields.');
      } else if (apiError.status === 409) {
        setErrorMessage('This startup has already been registered');
      } else if (apiError.status === 500) {
        setErrorMessage('Unable to submit startup registration');
      } else {
        setErrorMessage(apiError.message || 'Unable to submit startup registration');
      }
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterLayout>
      <div className='max-w-[900px] mx-auto p-6 sm:p-10 lg:p-16'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start'>
          <aside className='md:col-span-4 lg:col-span-3 shrink-0'>
            <div className='flex flex-row md:flex-col gap-4 sm:gap-6 justify-between md:justify-start'>
              {SECTION_LABELS.map((label, index) => {
                const step = index + 1;
                const isCompleted = step < currentSection;
                const isActive = step === currentSection;

                return (
                  <div key={label} className='flex items-center gap-3 transition-all duration-300'>
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        isCompleted || isActive
                          ? 'bg-[#009E49] text-white scale-105 shadow-sm'
                          : 'bg-[#E4E7EC] text-[#667085]'
                      }`}
                    >
                      {isCompleted ? <Check className='w-4 h-4 stroke-[3]' /> : step}
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
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>

          <div className='md:col-span-8 lg:col-span-9 max-w-xl'>
            <h1 className='platypi-gf font-bold text-2xl sm:text-3xl text-[#0B4822] mb-1.5 tracking-tight'>
              Register Your Startup
            </h1>
            <p className='text-xs sm:text-sm text-[#667085] mb-10'>
              Fill out the form below to register your startup for Ogun Digital Summit 2026.
            </p>
            <div className='mb-6'>
              <h2 className='text-base font-semibold text-[#0B4822] mt-5'>
                {SECTION_TITLES[currentSection - 1]}
              </h2>
            </div>

            <form className='space-y-10' onSubmit={handleSubmit}>
              <div className='space-y-5'>
                <div hidden={currentSection !== 1}>
                  <label
                    htmlFor='firstName'
                    className='block text-xs font-medium text-[#344054] mb-1.5'
                  >
                    First name
                  </label>
                  <Input
                    id='firstName'
                    name='firstName'
                    placeholder='First name'
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={inputClass(Boolean(errors.firstName))}
                    disabled={loading}
                  />
                  {errors.firstName && (
                    <p className='text-red-500 text-xs mt-1'>{errors.firstName}</p>
                  )}
                </div>

                <div hidden={currentSection !== 1}>
                  <label
                    htmlFor='lastName'
                    className='block text-xs font-medium text-[#344054] mb-1.5'
                  >
                    Last name
                  </label>
                  <Input
                    id='lastName'
                    name='lastName'
                    placeholder='Last name'
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={inputClass(Boolean(errors.lastName))}
                    disabled={loading}
                  />
                  {errors.lastName && (
                    <p className='text-red-500 text-xs mt-1'>{errors.lastName}</p>
                  )}
                </div>

                <div hidden={currentSection !== 1}>
                  <label
                    htmlFor='founderTitle'
                    className='block text-xs font-medium text-[#344054] mb-1.5'
                  >
                    Title (CEO/CTO/Co-Founder)
                  </label>
                  <Input
                    id='founderTitle'
                    name='founderTitle'
                    placeholder='Title (CEO/CTO/Co-Founder)'
                    value={formData.founderTitle}
                    onChange={handleInputChange}
                    className={inputClass(Boolean(errors.founderTitle))}
                    disabled={loading}
                  />
                  {errors.founderTitle && (
                    <p className='text-red-500 text-xs mt-1'>{errors.founderTitle}</p>
                  )}
                </div>

                <div hidden={currentSection !== 1}>
                  <label
                    htmlFor='founderPhoneNumber'
                    className='block text-xs font-medium text-[#344054] mb-1.5'
                  >
                    Founder Phone Number
                  </label>
                  <Input
                    id='founderPhoneNumber'
                    name='founderPhoneNumber'
                    type='tel'
                    placeholder='+234 803 123 4567'
                    value={formData.founderPhoneNumber}
                    onChange={handleInputChange}
                    className={inputClass(Boolean(errors.founderPhoneNumber))}
                    disabled={loading}
                  />
                  {errors.founderPhoneNumber && (
                    <p className='text-red-500 text-xs mt-1'>{errors.founderPhoneNumber}</p>
                  )}
                </div>

                <div hidden={currentSection !== 1}>
                  <label
                    htmlFor='founderEmail'
                    className='block text-xs font-medium text-[#344054] mb-1.5'
                  >
                    Founder Email
                  </label>
                  <Input
                    id='founderEmail'
                    name='founderEmail'
                    type='email'
                    placeholder='email@example.com'
                    value={formData.founderEmail}
                    onChange={handleInputChange}
                    className={inputClass(Boolean(errors.founderEmail))}
                    disabled={loading}
                  />
                  {errors.founderEmail && (
                    <p className='text-red-500 text-xs mt-1'>{errors.founderEmail}</p>
                  )}
                </div>

                <div hidden={currentSection !== 3}>
                  <label
                    htmlFor='startupName'
                    className='block text-xs font-medium text-[#344054] mb-1.5'
                  >
                    Startup Name
                  </label>
                  <Input
                    id='startupName'
                    name='startupName'
                    placeholder='Enter startup name'
                    value={formData.startupName}
                    onChange={handleInputChange}
                    className={inputClass(Boolean(errors.startupName))}
                    disabled={loading}
                  />
                  {errors.startupName && (
                    <p className='text-red-500 text-xs mt-1'>{errors.startupName}</p>
                  )}
                </div>

                <div hidden={currentSection !== 2}>
                  <label
                    htmlFor='location'
                    className='block text-xs font-medium text-[#344054] mb-1.5'
                  >
                    Where are you based?
                  </label>
                  <Input
                    id='location'
                    name='location'
                    placeholder='Where are you based?'
                    value={formData.location}
                    onChange={handleInputChange}
                    className={inputClass(Boolean(errors.location))}
                    disabled={loading}
                  />
                  {errors.location && (
                    <p className='text-red-500 text-xs mt-1'>{errors.location}</p>
                  )}
                </div>

                <div hidden={currentSection !== 2}>
                  <label
                    htmlFor='socialLink'
                    className='block text-xs font-medium text-[#344054] mb-1.5'
                  >
                    Link to your socials (LinkedIn or Twitter)
                  </label>
                  <Input
                    id='socialLink'
                    name='socialLink'
                    type='url'
                    placeholder='LinkedIn or Twitter link'
                    value={formData.socialLink}
                    onChange={handleInputChange}
                    className={inputClass(Boolean(errors.socialLink))}
                    disabled={loading}
                  />
                  {errors.socialLink && (
                    <p className='text-red-500 text-xs mt-1'>{errors.socialLink}</p>
                  )}
                </div>

                <div hidden={currentSection !== 2}>
                  <label
                    htmlFor='canAttendPhysically'
                    className='block text-xs font-medium text-[#344054] mb-1.5'
                  >
                    Are you able to attend ODS 2026 physically?
                  </label>
                  <select
                    id='canAttendPhysically'
                    name='canAttendPhysically'
                    value={formData.canAttendPhysically}
                    onChange={handleSelectChange}
                    className={selectClass(Boolean(errors.canAttendPhysically))}
                    disabled={loading}
                  >
                    <option value=''>Select an option</option>
                    {YES_NO_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.canAttendPhysically && (
                    <p className='text-red-500 text-xs mt-1'>{errors.canAttendPhysically}</p>
                  )}
                </div>

                <div hidden={currentSection !== 4}>
                  <label
                    htmlFor='startupSector'
                    className='block text-xs font-medium text-[#344054] mb-1.5'
                  >
                    Tell us your Startup Sector?
                  </label>
                  <select
                    id='startupSector'
                    name='startupSector'
                    value={formData.startupSector}
                    onChange={handleSelectChange}
                    className={selectClass(Boolean(errors.startupSector))}
                    disabled={loading}
                  >
                    <option value=''>Select sector</option>
                    {SECTORS.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                  {errors.startupSector && (
                    <p className='text-red-500 text-xs mt-1'>{errors.startupSector}</p>
                  )}
                </div>

                <div hidden={currentSection !== 4 || formData.startupSector !== 'others'}>
                  <label
                    htmlFor='startupSectorOther'
                    className='block text-xs font-medium text-[#344054] mb-1.5'
                  >
                    Enter your startup sector
                  </label>
                  <Input
                    id='startupSectorOther'
                    name='startupSectorOther'
                    placeholder='Enter your startup sector'
                    value={formData.startupSectorOther}
                    onChange={handleInputChange}
                    className={inputClass(Boolean(errors.startupSectorOther))}
                    disabled={loading}
                  />
                  {errors.startupSectorOther && (
                    <p className='text-red-500 text-xs mt-1'>{errors.startupSectorOther}</p>
                  )}
                </div>

                <div hidden={currentSection !== 3}>
                  <label
                    htmlFor='website'
                    className='block text-xs font-medium text-[#344054] mb-1.5'
                  >
                    Website
                  </label>
                  <Input
                    id='website'
                    name='website'
                    type='url'
                    placeholder='example.com'
                    value={formData.website}
                    onChange={handleInputChange}
                    className={inputClass(Boolean(errors.website))}
                    disabled={loading}
                  />
                  {errors.website && <p className='text-red-500 text-xs mt-1'>{errors.website}</p>}
                </div>

                <div hidden={currentSection !== 4}>
                  <label
                    htmlFor='startupStage'
                    className='block text-xs font-medium text-[#344054] mb-1.5'
                  >
                    Tell us your Startup Stage of Fundraising?
                  </label>
                  <select
                    id='startupStage'
                    name='startupStage'
                    value={formData.startupStage}
                    onChange={handleSelectChange}
                    className={selectClass(Boolean(errors.startupStage))}
                    disabled={loading}
                  >
                    <option value=''>Select startup stage</option>
                    {STARTUP_STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                  {errors.startupStage && (
                    <p className='text-red-500 text-xs mt-1'>{errors.startupStage}</p>
                  )}
                </div>

                <div hidden={currentSection !== 4}>
                  <label
                    htmlFor='wantsToPitch'
                    className='block text-xs font-medium text-[#344054] mb-1.5'
                  >
                    Do you want to Pitch your Idea to win Monetary Prize?
                  </label>
                  <select
                    id='wantsToPitch'
                    name='wantsToPitch'
                    value={formData.wantsToPitch}
                    onChange={handleSelectChange}
                    className={selectClass(Boolean(errors.wantsToPitch))}
                    disabled={loading}
                  >
                    <option value=''>Select an option</option>
                    {YES_NO_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.wantsToPitch && (
                    <p className='text-red-500 text-xs mt-1'>{errors.wantsToPitch}</p>
                  )}
                </div>

                <div hidden={currentSection !== 3}>
                  <label
                    htmlFor='startupTwitterUrl'
                    className='block text-xs font-medium text-[#344054] mb-1.5'
                  >
                    Link to your startup Twitter
                  </label>
                  <Input
                    id='startupTwitterUrl'
                    name='startupTwitterUrl'
                    type='url'
                    placeholder='Link to your startup Twitter'
                    value={formData.startupTwitterUrl}
                    onChange={handleInputChange}
                    className={inputClass(Boolean(errors.startupTwitterUrl))}
                    disabled={loading}
                  />
                  {errors.startupTwitterUrl && (
                    <p className='text-red-500 text-xs mt-1'>{errors.startupTwitterUrl}</p>
                  )}
                </div>

                <div hidden={currentSection !== 3}>
                  <label
                    htmlFor='startupLinkedinUrl'
                    className='block text-xs font-medium text-[#344054] mb-1.5'
                  >
                    Link to your startup LinkedIn
                  </label>
                  <Input
                    id='startupLinkedinUrl'
                    name='startupLinkedinUrl'
                    type='url'
                    placeholder='Link to your startup LinkedIn'
                    value={formData.startupLinkedinUrl}
                    onChange={handleInputChange}
                    className={inputClass(Boolean(errors.startupLinkedinUrl))}
                    disabled={loading}
                  />
                  {errors.startupLinkedinUrl && (
                    <p className='text-red-500 text-xs mt-1'>{errors.startupLinkedinUrl}</p>
                  )}
                </div>

                <div hidden={currentSection !== 3}>
                  <label
                    htmlFor='pitchDeckUrl'
                    className='block text-xs font-medium text-[#344054] mb-1.5'
                  >
                    Pitch Deck
                  </label>
                  <Input
                    id='pitchDeckUrl'
                    name='pitchDeckUrl'
                    type='url'
                    placeholder='https://docs.google.com/...'
                    value={formData.pitchDeckUrl}
                    onChange={handleInputChange}
                    className={inputClass(Boolean(errors.pitchDeckUrl))}
                    disabled={loading}
                  />
                  {errors.pitchDeckUrl && (
                    <p className='text-red-500 text-xs mt-1'>{errors.pitchDeckUrl}</p>
                  )}
                </div>
              </div>

              <div className='flex justify-between gap-4'>
                {currentSection > 1 && (
                  <Button
                    type='button'
                    className='bg-[#5E6963] hover:bg-[#4E5852] text-white text-sm font-semibold px-8 py-3 rounded-full transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => setCurrentSection((section) => Math.max(1, section - 1))}
                    disabled={loading}
                  >
                    <ArrowLeft className='w-4 h-4 mr-2' />
                    Back
                  </Button>
                )}
                {currentSection < SECTION_TITLES.length ? (
                  <Button
                    type='button'
                    className='inline-flex items-center gap-2 bg-[#009E49] hover:bg-[#00873E] text-white text-sm font-semibold px-8 py-3 rounded-full shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ml-auto'
                    onClick={handleNextSection}
                    disabled={loading}
                  >
                    Next
                    <ArrowRight className='w-4 h-4' />
                  </Button>
                ) : (
                  <Button
                    type='submit'
                    className='inline-flex items-center gap-2 bg-[#009E49] hover:bg-[#00873E] text-white text-sm font-semibold px-8 py-3 rounded-full shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ml-auto'
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                    <ArrowRight className='w-4 h-4' />
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/');
        }}
        title='Registration Successful'
        message='You have successfully registered your startup, our team will reach out to you soon.'
      />
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title='Registration Failed'
        message={errorMessage}
      />
    </RegisterLayout>
  );
};

export default Startup;
