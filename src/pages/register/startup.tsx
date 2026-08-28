import RegisterLayout from '@/components/layouts/registerLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, type ApiError } from '@/api/apiService';
import SuccessModal from '@/components/shared/SuccessModal';
import ErrorModal from '@/components/shared/ErrorModal';

interface FormData {
  founderFullName: string;
  founderPhoneNumber: string;
  founderEmail: string;
  startupName: string;
  sector: string;
  website: string;
  linkedinUrl: string;
  twitterUrl: string;
  startupStage: string;
}

interface FormErrors {
  founderFullName: string;
  founderPhoneNumber: string;
  founderEmail: string;
  startupName: string;
  sector: string;
  website: string;
  linkedinUrl: string;
  twitterUrl: string;
  startupStage: string;
}

const SECTORS = ['Healthtech', 'Fintech', 'Proptech', 'Edutech', 'SaaS', 'Biotech', 'Others'];
const STARTUP_STAGES = ['MVP', 'Preseed', 'Series A'];

const Startup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    founderFullName: '',
    founderPhoneNumber: '',
    founderEmail: '',
    startupName: '',
    sector: '',
    website: '',
    linkedinUrl: '',
    twitterUrl: '',
    startupStage: ''
  });

  const [errors, setErrors] = useState<FormErrors>({
    founderFullName: '',
    founderPhoneNumber: '',
    founderEmail: '',
    startupName: '',
    sector: '',
    website: '',
    linkedinUrl: '',
    twitterUrl: '',
    startupStage: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
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
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      founderFullName: '',
      founderPhoneNumber: '',
      founderEmail: '',
      startupName: '',
      sector: '',
      website: '',
      linkedinUrl: '',
      twitterUrl: '',
      startupStage: ''
    };

    if (!formData.founderFullName.trim()) {
      newErrors.founderFullName = 'Founder full name is required';
    }

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

    if (!formData.sector) {
      newErrors.sector = 'Sector is required';
    }

    if (formData.website.trim() && !validateUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL (e.g., https://example.com)';
    }

    if (formData.linkedinUrl.trim() && !validateUrl(formData.linkedinUrl)) {
      newErrors.linkedinUrl =
        'Please enter a valid LinkedIn URL (e.g., https://linkedin.com/company/example)';
    }

    if (formData.twitterUrl.trim() && !validateUrl(formData.twitterUrl)) {
      newErrors.twitterUrl =
        'Please enter a valid Twitter URL (e.g., https://twitter.com/username)';
    }

    if (!formData.startupStage) {
      newErrors.startupStage = 'Startup stage is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
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
      await apiService.startup.create(formData);

      setFormData({
        founderFullName: '',
        founderPhoneNumber: '',
        founderEmail: '',
        startupName: '',
        sector: '',
        website: '',
        linkedinUrl: '',
        twitterUrl: '',
        startupStage: ''
      });
      setShowSuccessModal(true);
    } catch (error: unknown) {
      const errorMessage =
        (error as ApiError)?.message || 'Failed to submit startup registration. Please try again.';
      setErrorMessage(errorMessage);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterLayout>
      <div className='max-w-[516px] mx-auto p-6 pt-20'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>Register Your Startup</h1>
        <p className='text-sm text-gray-500 mb-10'>
          Fill out the form below to register your startup for Ogun Digital Summit 2026.
        </p>

        <form className='space-y-10' onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div>
              <label htmlFor='founderFullName' className='block text-sm text-[#67706D] mb-2'>
                Founder Full Name
              </label>
              <Input
                id='founderFullName'
                name='founderFullName'
                placeholder='Enter founder full name'
                value={formData.founderFullName}
                onChange={handleInputChange}
                className={errors.founderFullName ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.founderFullName && (
                <p className='text-red-500 text-xs mt-1'>{errors.founderFullName}</p>
              )}
            </div>

            <div>
              <label htmlFor='founderPhoneNumber' className='block text-sm text-[#67706D] mb-2'>
                Founder Phone Number
              </label>
              <Input
                id='founderPhoneNumber'
                name='founderPhoneNumber'
                type='tel'
                placeholder='+234 803 123 4567'
                value={formData.founderPhoneNumber}
                onChange={handleInputChange}
                className={errors.founderPhoneNumber ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.founderPhoneNumber && (
                <p className='text-red-500 text-xs mt-1'>{errors.founderPhoneNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor='founderEmail' className='block text-sm text-[#67706D] mb-2'>
                Founder Email
              </label>
              <Input
                id='founderEmail'
                name='founderEmail'
                type='email'
                placeholder='email@example.com'
                value={formData.founderEmail}
                onChange={handleInputChange}
                className={errors.founderEmail ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.founderEmail && (
                <p className='text-red-500 text-xs mt-1'>{errors.founderEmail}</p>
              )}
            </div>

            <div>
              <label htmlFor='startupName' className='block text-sm text-[#67706D] mb-2'>
                Startup Name
              </label>
              <Input
                id='startupName'
                name='startupName'
                placeholder='Enter startup name'
                value={formData.startupName}
                onChange={handleInputChange}
                className={errors.startupName ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.startupName && (
                <p className='text-red-500 text-xs mt-1'>{errors.startupName}</p>
              )}
            </div>

            <div>
              <label htmlFor='sector' className='block text-sm text-[#67706D] mb-2'>
                Sector
              </label>
              <select
                id='sector'
                name='sector'
                value={formData.sector}
                onChange={handleSelectChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.sector ? 'border-red-500' : 'border-gray-300'}`}
                disabled={loading}
              >
                <option value=''>Select sector</option>
                {SECTORS.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
              {errors.sector && <p className='text-red-500 text-xs mt-1'>{errors.sector}</p>}
            </div>

            <div>
              <label htmlFor='website' className='block text-sm text-[#67706D] mb-2'>
                Website
              </label>
              <Input
                id='website'
                name='website'
                type='url'
                placeholder='https://example.com'
                value={formData.website}
                onChange={handleInputChange}
                className={errors.website ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.website && <p className='text-red-500 text-xs mt-1'>{errors.website}</p>}
            </div>

            <div>
              <label htmlFor='linkedinUrl' className='block text-sm text-[#67706D] mb-2'>
                LinkedIn URL
              </label>
              <Input
                id='linkedinUrl'
                name='linkedinUrl'
                type='url'
                placeholder='https://linkedin.com/company/example'
                value={formData.linkedinUrl}
                onChange={handleInputChange}
                className={errors.linkedinUrl ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.linkedinUrl && (
                <p className='text-red-500 text-xs mt-1'>{errors.linkedinUrl}</p>
              )}
            </div>

            <div>
              <label htmlFor='twitterUrl' className='block text-sm text-[#67706D] mb-2'>
                Twitter URL
              </label>
              <Input
                id='twitterUrl'
                name='twitterUrl'
                type='url'
                placeholder='https://twitter.com/username'
                value={formData.twitterUrl}
                onChange={handleInputChange}
                className={errors.twitterUrl ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.twitterUrl && (
                <p className='text-red-500 text-xs mt-1'>{errors.twitterUrl}</p>
              )}
            </div>

            <div>
              <label htmlFor='startupStage' className='block text-sm text-[#67706D] mb-2'>
                Startup Stage
              </label>
              <select
                id='startupStage'
                name='startupStage'
                value={formData.startupStage}
                onChange={handleSelectChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.startupStage ? 'border-red-500' : 'border-gray-300'}`}
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
          </div>

          <Button type='submit' className='rounded-full h-11' disabled={loading}>
            {loading ? 'Submitting...' : 'Register Startup'}
          </Button>
        </form>
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
