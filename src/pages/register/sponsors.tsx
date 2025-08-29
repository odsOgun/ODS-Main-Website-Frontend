import RegisterLayout from '@/components/layouts/registerLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { apiService, AxiosError } from '@/api/apiService';

interface FormData {
  fullName: string;
  organisation: string;
  email: string;
  phoneNumber: string;
  website: string;
  linkedinLink: string;
  twitterLink: string;
}

interface FormErrors {
  fullName: string;
  organisation: string;
  email: string;
  phoneNumber: string;
  website: string;
  linkedinLink: string;
  twitterLink: string;
}

const Sponsors: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    organisation: '',
    email: '',
    phoneNumber: '',
    website: '',
    linkedinLink: '',
    twitterLink: ''
  });

  const [errors, setErrors] = useState<FormErrors>({
    fullName: '',
    organisation: '',
    email: '',
    phoneNumber: '',
    website: '',
    linkedinLink: '',
    twitterLink: ''
  });

  const [loading, setLoading] = useState<boolean>(false);

  const validateNigerianPhoneNumber = (phone: string): boolean => {
    // Remove all spaces and special characters except +
    const cleanPhone = phone.replace(/[\s\-()]/g, '');

    // Nigerian phone number patterns:
    // +234XXXXXXXXXX (13 digits total)
    // 234XXXXXXXXXX (12 digits total)
    // 0XXXXXXXXXX (11 digits total)

    const patterns = [
      /^\+234[789][01]\d{8}$/, // +234 followed by 7,8,9 then 0,1 then 8 digits
      /^234[789][01]\d{8}$/, // 234 followed by 7,8,9 then 0,1 then 8 digits
      /^0[789][01]\d{8}$/ // 0 followed by 7,8,9 then 0,1 then 8 digits
    ];

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
      fullName: '',
      organisation: '',
      email: '',
      phoneNumber: '',
      website: '',
      linkedinLink: '',
      twitterLink: ''
    };

    // Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Organization validation
    if (!formData.organisation.trim()) {
      newErrors.organisation = 'Organisation is required';
    }

    // Phone validation with Nigerian format
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validateNigerianPhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber =
        'Please enter a valid Nigerian phone number (e.g., +234 803 123 4567 or 0803 123 4567)';
    }

    // Website validation (optional but if provided, should be valid)
    if (formData.website.trim() && !validateUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL (e.g., https://example.com)';
    }

    // LinkedIn validation (optional but if provided, should be valid)
    if (formData.linkedinLink.trim() && !validateUrl(formData.linkedinLink)) {
      newErrors.linkedinLink =
        'Please enter a valid LinkedIn URL (e.g., https://linkedin.com/company/example)';
    }

    // Twitter validation (optional but if provided, should be valid)
    if (formData.twitterLink.trim() && !validateUrl(formData.twitterLink)) {
      newErrors.twitterLink =
        'Please enter a valid Twitter/X URL (e.g., https://twitter.com/username)';
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

    // Clear error when user starts typing
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
      await apiService.sponsors.create(formData);

      // Success
      setFormData({
        fullName: '',
        organisation: '',
        email: '',
        phoneNumber: '',
        website: '',
        linkedinLink: '',
        twitterLink: ''
      });
      toast.success('Sponsorship application submitted successfully! Redirecting to home...');
      setTimeout(() => navigate('/'), 1500);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError;

        const errorMessage =
          (axiosError.response?.data as { message?: string })?.message ||
          `Submission failed (${axiosError.response?.status})`;
        toast.error(errorMessage);
      } else if (error && typeof error === 'object' && 'request' in error) {
        toast.error('No response from server. Please check your connection.');
      } else {
        toast.error('Failed to submit sponsorship application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterLayout>
      <div className='max-w-[516px] mx-auto p-6 pt-20'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>
          Sponsor this year's Ogun Digital Summit
        </h1>
        <p className='text-sm text-gray-500 mb-10'>
          Fill out the form below and our team will reach out to you in less than 24 hours.
        </p>

        <form className='space-y-10' onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div>
              <label htmlFor='fullName' className='block text-sm text-[#67706D] mb-2'>
                Full Name
              </label>
              <Input
                id='fullName'
                name='fullName'
                placeholder='Enter full name'
                value={formData.fullName}
                onChange={handleInputChange}
                className={errors.fullName ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.fullName && <p className='text-red-500 text-xs mt-1'>{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor='email' className='block text-sm text-[#67706D] mb-2'>
                Email Address
              </label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='email@example.com'
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
            </div>

            <div>
              <label htmlFor='organisation' className='block text-sm text-[#67706D] mb-2'>
                Organisation
              </label>
              <Input
                id='organisation'
                name='organisation'
                placeholder="What's your organisation"
                value={formData.organisation}
                onChange={handleInputChange}
                className={errors.organisation ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.organisation && (
                <p className='text-red-500 text-xs mt-1'>{errors.organisation}</p>
              )}
            </div>

            <div>
              <label htmlFor='phoneNumber' className='block text-sm text-[#67706D] mb-2'>
                Phone Number
              </label>
              <Input
                id='phoneNumber'
                name='phoneNumber'
                type='tel'
                placeholder='+234 803 123 4567'
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={errors.phoneNumber ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.phoneNumber && (
                <p className='text-red-500 text-xs mt-1'>{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor='website' className='block text-sm text-[#67706D] mb-2'>
                Company's website
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
              <label htmlFor='linkedinLink' className='block text-sm text-[#67706D] mb-2'>
                Company's LinkedIn
              </label>
              <Input
                id='linkedinLink'
                name='linkedinLink'
                type='url'
                placeholder='https://linkedin.com/company/example'
                value={formData.linkedinLink}
                onChange={handleInputChange}
                className={errors.linkedinLink ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.linkedinLink && (
                <p className='text-red-500 text-xs mt-1'>{errors.linkedinLink}</p>
              )}
            </div>

            <div>
              <label htmlFor='twitterLink' className='block text-sm text-[#67706D] mb-2'>
                Company's X (Twitter)
              </label>
              <Input
                id='twitterLink'
                name='twitterLink'
                type='url'
                placeholder='https://twitter.com/username'
                value={formData.twitterLink}
                onChange={handleInputChange}
                className={errors.twitterLink ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.twitterLink && (
                <p className='text-red-500 text-xs mt-1'>{errors.twitterLink}</p>
              )}
            </div>
          </div>

          <Button type='submit' className='rounded-full h-11' disabled={loading}>
            {loading ? 'Submitting...' : 'Register'}
          </Button>
        </form>
      </div>
    </RegisterLayout>
  );
};

export default Sponsors;
