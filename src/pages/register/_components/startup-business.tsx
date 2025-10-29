import { Badge } from '@/components/ui/badge';
import Check from '@/components/ui/check';
import { cn } from '@/lib/utils';
import { useState, useId } from 'react';
import { Button } from '@/components/ui/button2';
import { Input } from '@/components/ui/input2';
import { STARTUP_BUSINESS_OPTIONS, REFERRAL_SOURCE_OPTIONS, TICKET_TIERS } from '@/lib/constants';
import { apiService } from '@/api/apiService';
import { toast } from 'sonner';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface StartupBusinessData {
  ownStartup: boolean;
  startupName?: string;
  hearAboutUs: string;
}

interface StartupBusinessProps {
  onContinue: (data: StartupBusinessData) => void;
  initialData?: StartupBusinessData;
  selectedTicketTier?: string;
  completeRegistrationData?: {
    fullName: string;
    email: string;
    phoneNumber: string;
    jobRole: string;
    schoolCompany: string;
    isNyscCorpMember?: boolean;
    interestLevel: string;
    interestAreas?: string[];
  };
}

interface FormErrors {
  ownStartup?: string;
  startupName?: string;
  hearAboutUs?: string;
  otherReferralSource?: string;
}

function StartupBusiness({
  onContinue,
  initialData,
  selectedTicketTier,
  completeRegistrationData
}: StartupBusinessProps) {
  const [selectedOption, setSelectedOption] = useState<string>(
    initialData?.ownStartup ? 'yes' : 'no'
  );
  const [selectedReferralSource, setSelectedReferralSource] = useState<string>(
    initialData?.hearAboutUs || ''
  );
  const [startupName, setStartupName] = useState<string>(initialData?.startupName || '');
  const [otherReferralSource, setOtherReferralSource] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const startupBusinessId = useId();
  const startupNameId = useId();
  const otherReferralId = useId();

  // Get ticket details for payment
  const ticketDetails = TICKET_TIERS.find((tier) => tier.id === selectedTicketTier);
  const ticketPrice = (ticketDetails?.price as number) || 0;

  // Flutterwave configuration - created at component level
  const flutterwaveConfig = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: `ODS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    amount: ticketPrice,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: completeRegistrationData?.email || '',
      phone_number: completeRegistrationData?.phoneNumber || '',
      name: completeRegistrationData?.fullName || ''
    },
    customizations: {
      title: 'Registration for Ogun Digital Summit 2025',
      description: `Payment for ${ticketDetails?.name || 'ODS 2025'} ticket`,
      logo: 'https://res.cloudinary.com/dbmvwrk56/image/upload/v1761758626/Layer_2_mh45id.png'
    }
  };

  const handleFlutterPayment = useFlutterwave(flutterwaveConfig);

  // Function to map frontend ticket tier IDs to backend expected values
  const mapTicketTierForApi = (tier: string | undefined): string => {
    if (!tier) return 'regular';

    const tierMap: Record<string, string> = {
      basic: 'regular',
      gold: 'silver',
      vip: 'prime'
    };

    return tierMap[tier] || 'regular';
  };

  // Function to handle API registration
  const handleApiRegistration = (transactionId?: string | number) => {
    const apiTicketTier = mapTicketTierForApi(selectedTicketTier);

    // Use custom referral source if "Others" is selected, otherwise use the selected option
    const finalHearAboutUs =
      selectedReferralSource === 'others' ? otherReferralSource.trim() : selectedReferralSource;

    const registrationData = {
      fullName: completeRegistrationData?.fullName || '',
      email: completeRegistrationData?.email || '',
      phoneNumber: completeRegistrationData?.phoneNumber || '',
      jobRole: completeRegistrationData?.jobRole || '',
      schoolCompany: completeRegistrationData?.schoolCompany || '',
      isNyscCorpMember: completeRegistrationData?.isNyscCorpMember || false,
      interestLevel: completeRegistrationData?.interestLevel || '',
      interestAreas: completeRegistrationData?.interestAreas || [],
      ownStartup: selectedOption === 'yes',
      startupName: selectedOption === 'yes' ? startupName : '',
      hearAboutUs: finalHearAboutUs,
      ticketTier: apiTicketTier,
      paymentStatus: selectedTicketTier === 'basic' ? 'success' : 'success',
      paymentType: selectedTicketTier === 'basic' ? 'free' : 'paid',
      paymentTransactionId: transactionId ? String(transactionId) : ''
    };

    // console.log('Sending registration data:', registrationData);
    return apiService.attendees.register(registrationData);
  };

  // Function to handle payment success
  const handlePaymentSuccess = async (transactionId?: string | number) => {
    try {
      setIsSubmitting(true);

      await handleApiRegistration(transactionId);

      toast.success('Registration and payment successful!');
      onContinue({
        ownStartup: selectedOption === 'yes',
        startupName: selectedOption === 'yes' ? startupName : '',
        hearAboutUs:
          selectedReferralSource === 'others' ? otherReferralSource.trim() : selectedReferralSource
      });
    } catch (error: unknown) {
      console.log('Registration error after payment:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);

    if (errors.ownStartup) {
      setErrors((prev) => ({ ...prev, ownStartup: undefined }));
    }

    if (option === 'no') {
      setStartupName('');
      setErrors((prev) => ({ ...prev, startupName: undefined }));
    }
  };

  const handleReferralSourceChange = (value: string) => {
    setSelectedReferralSource(value);

    // Clear other referral source when switching away from "others"
    if (value !== 'others') {
      setOtherReferralSource('');
      setErrors((prev) => ({ ...prev, otherReferralSource: undefined }));
    }

    if (errors.hearAboutUs) {
      setErrors((prev) => ({ ...prev, hearAboutUs: undefined }));
    }
  };

  const handleStartupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartupName(value);

    if (errors.startupName && value.trim()) {
      setErrors((prev) => ({ ...prev, startupName: undefined }));
    }
  };

  const handleOtherReferralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtherReferralSource(value);

    if (errors.otherReferralSource && value.trim()) {
      setErrors((prev) => ({ ...prev, otherReferralSource: undefined }));
    }

    // Clear hearAboutUs error when user starts typing in other referral
    if (value.trim() && errors.hearAboutUs) {
      setErrors((prev) => ({ ...prev, hearAboutUs: undefined }));
    }
  };

  // Check if startup name field should be shown
  const shouldShowStartupName = selectedOption === 'yes';

  // Check if other referral input should be shown
  const shouldShowOtherReferral = selectedReferralSource === 'others';

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate business ownership selection
    if (!selectedOption) {
      newErrors.ownStartup = 'Please select whether you own a business/startup';
    }

    // Validate startup name if required
    if (shouldShowStartupName && !startupName.trim()) {
      newErrors.startupName = 'Startup name is required';
    } else if (shouldShowStartupName && startupName.trim().length < 2) {
      newErrors.startupName = 'Startup name must be at least 2 characters';
    }

    // Validate referral source
    if (!selectedReferralSource) {
      newErrors.hearAboutUs = 'Please select how you heard about us';
    }

    // Validate other referral source if "Others" is selected
    if (shouldShowOtherReferral && !otherReferralSource.trim()) {
      newErrors.otherReferralSource = 'Please specify how you heard about us';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // For basic tickets, register directly without payment
    if (selectedTicketTier === 'basic') {
      setIsSubmitting(true);

      try {
        await handleApiRegistration();

        toast.success('Registration successful!');
        onContinue({
          ownStartup: selectedOption === 'yes',
          startupName: selectedOption === 'yes' ? startupName : '',
          hearAboutUs:
            selectedReferralSource === 'others'
              ? otherReferralSource.trim()
              : selectedReferralSource
        });
      } catch (error) {
        console.log('Registration error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Registration failed. Please try again.';
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // For paid tickets, initiate Flutterwave payment
      handleFlutterPayment({
        callback: (response) => {
          if (response.status === 'completed') {
            handlePaymentSuccess(response.transaction_id);
          } else {
            toast.error('Payment was not successful. Please try again.');
          }
          closePaymentModal();
        },
        onClose: () => {
          toast.info('Payment cancelled');
        }
      });
    }
  };

  // Determine button text based on ticket tier
  const getButtonText = () => {
    if (isSubmitting) return 'Processing...';

    if (selectedTicketTier === 'basic') {
      return 'Register';
    } else {
      return `Pay ${ticketDetails?.currency}${ticketPrice.toLocaleString()}`;
    }
  };

  return (
    <div className='w-full'>
      <form className='space-y-6' onSubmit={handleSubmit}>
        <div>
          <label htmlFor={startupBusinessId} className='text-sm mb-3 text-gray-1 block font-medium'>
            Do you own a business/startup?
          </label>
          <div className='flex flex-wrap gap-3'>
            {STARTUP_BUSINESS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => handleOptionChange(option.value)}
                className='transition-transform hover:scale-105 active:scale-95'
              >
                <Badge
                  variant='outline'
                  className={cn(
                    'cursor-pointer !border h-[42px] transition-all py-3 pl-3 pr-4 duration-200 rounded-full text-sm font-normal items-center gap-3',
                    selectedOption === option.value
                      ? '!border-gray-0 bg-gray-50 text-gray-0 shadow-sm'
                      : 'border-gray-2 text-gray-1 hover:text-gray-0 hover:border-gray-1',
                    errors.ownStartup && 'border-red-500'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center size-5 rounded-full border transition-colors',
                      selectedOption === option.value ? 'border-gray-0 bg-gray-0' : 'border-gray-1'
                    )}
                  >
                    <Check
                      isChecked={selectedOption === option.value}
                      className={cn(
                        'size-3 transition-colors',
                        selectedOption === option.value ? 'text-white' : 'text-transparent'
                      )}
                    />
                  </div>
                  {option.label}
                </Badge>
              </button>
            ))}
          </div>
          {errors.ownStartup && (
            <p className='text-red-500 text-xs mt-2 font-medium'>{errors.ownStartup}</p>
          )}
        </div>

        {/* Conditional Startup Name field */}
        {shouldShowStartupName && (
          <div className='animate-in fade-in duration-300'>
            <label htmlFor={startupNameId} className='text-sm mb-3 text-gray-1 block font-medium'>
              What&apos;s your business/startup name?
            </label>
            <Input
              id={startupNameId}
              name='startup-name'
              placeholder='Enter your startup name'
              value={startupName}
              onChange={handleStartupNameChange}
              className={cn(
                'w-full transition-colors duration-200',
                errors.startupName && 'border-red-500 focus:border-red-500'
              )}
            />
            {errors.startupName && (
              <p className='text-red-500 text-xs mt-2 font-medium'>{errors.startupName}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor='referral-source' className='text-sm mb-3 text-gray-1 block font-medium'>
            How did you hear about us?
          </label>
          <Select value={selectedReferralSource} onValueChange={handleReferralSourceChange}>
            <SelectTrigger
              className={cn(
                'w-full transition-colors duration-200',
                errors.hearAboutUs && !shouldShowOtherReferral && 'border-red-500'
              )}
            >
              <SelectValue placeholder='Select how you heard about us' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[...REFERRAL_SOURCE_OPTIONS, 'Others'].map((option) => (
                  <SelectItem
                    key={option}
                    value={option.toLowerCase().replace(/\s+/g, '-')}
                    className='transition-colors duration-150'
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Other Referral Source Input */}
          {shouldShowOtherReferral && (
            <div className='mt-4 animate-in fade-in duration-300'>
              <label htmlFor={otherReferralId} className='text-sm mb-2 text-gray-1 block'>
                Please specify
              </label>
              <Input
                id={otherReferralId}
                name='other-referral'
                placeholder='Tell us how you heard about us...'
                value={otherReferralSource}
                onChange={handleOtherReferralChange}
                className={cn(
                  'w-full transition-colors duration-200',
                  errors.otherReferralSource && 'border-red-500 focus:border-red-500'
                )}
              />
              {errors.otherReferralSource && (
                <p className='text-red-500 text-xs mt-2 font-medium'>
                  {errors.otherReferralSource}
                </p>
              )}
              <p className='text-xs text-gray-1 mt-2'>
                Let us know where you discovered Ogun Digital Summit
              </p>
            </div>
          )}

          {errors.hearAboutUs && !shouldShowOtherReferral && (
            <p className='text-red-500 text-xs mt-2 font-medium'>{errors.hearAboutUs}</p>
          )}
        </div>

        <div className='flex justify-between pt-6'>
          <Button
            type='submit'
            className='w-fit px-8 py-3 text-base font-medium transition-all duration-200 hover:scale-105 active:scale-95'
            disabled={isSubmitting}
          >
            {getButtonText()}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StartupBusiness;
