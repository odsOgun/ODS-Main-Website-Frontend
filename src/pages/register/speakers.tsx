import RegisterLayout from '@/components/layouts/registerLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { apiService, AxiosError } from '@/api/apiService';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  role: string;
  website: string;
  country: string;
  industry: string;
  contentTrack: string;
  topicProposal: string;
}

interface FormErrors {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  role: string;
  website: string;
  country: string;
  industry: string;
  contentTrack: string;
  topicProposal: string;
}

const Speakers: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    role: '',
    website: '',
    country: '',
    industry: '',
    contentTrack: '',
    topicProposal: ''
  });

  const [errors, setErrors] = useState<FormErrors>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    role: '',
    website: '',
    country: '',
    industry: '',
    contentTrack: '',
    topicProposal: ''
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
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      companyName: '',
      role: '',
      website: '',
      country: '',
      industry: '',
      contentTrack: '',
      topicProposal: ''
    };

    // Full Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation with Nigerian format
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validateNigerianPhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber =
        'Please enter a valid Nigerian phone number (e.g., +234 803 123 4567 or 0803 123 4567)';
    }

    // Organization validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    // Role validation
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    // Website validation (required)
    if (!formData.website.trim()) {
      newErrors.website = 'Website URL is required';
    } else if (!validateUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL (e.g., https://example.com)';
    }

    // Country validation
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    // Industry validation
    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }

    // Content track validation
    if (!formData.contentTrack.trim()) {
      newErrors.contentTrack = 'Content track is required';
    }

    // Topic proposal validation
    if (!formData.topicProposal.trim()) {
      newErrors.topicProposal = 'Topic and idea is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
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

  const handleContentTrackChange = (value: string): void => {
    setFormData((prev) => ({
      ...prev,
      contentTrack: value
    }));

    // Clear error when user selects an option
    if (errors.contentTrack) {
      setErrors((prev) => ({
        ...prev,
        contentTrack: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await apiService.speakers.create(formData);

      // Success
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        companyName: '',
        role: '',
        website: '',
        country: '',
        industry: '',
        contentTrack: '',
        topicProposal: ''
      });
      toast.success('Speaker application submitted successfully! Redirecting to home...');
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
        toast.error('Failed to submit speaker application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterLayout>
      <div className='max-w-[600px] mx-auto p-6 pt-20'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>Speaker details</h1>
        <p className='text-sm text-gray-500 mb-10'>All fields are required</p>

        <form className='space-y-10' onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div className='flex flex-col gap-4 md:flex-row '>
              <div className='flex-1'>
                <label htmlFor='fullName' className='block text-sm text-[#67706D] mb-2 font-bold'>
                  First Name
                </label>
                <Input
                  id='firstName'
                  name='firstName'
                  placeholder=''
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.firstName && (
                  <p className='text-red-500 text-xs mt-1'>{errors.firstName}</p>
                )}
              </div>

              <div className='flex-1'>
                <label htmlFor='lastName' className='block text-sm text-[#67706D] mb-2 font-bold'>
                  Last Name
                </label>
                <Input
                  id='lastName'
                  name='lastName'
                  placeholder=''
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.lastName && <p className='text-red-500 text-xs mt-1'>{errors.lastName}</p>}
              </div>
            </div>

            <div className='flex flex-col gap-4 md:flex-row'>
              <div className='flex-1'>
                <label htmlFor='email' className='block text-sm text-[#67706D] mb-2 font-bold'>
                  Email Address
                </label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder=''
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
              </div>
              <div className='flex-1'>
                <label
                  htmlFor='phoneNumber'
                  className='block text-sm text-[#67706D] mb-2 font-bold'
                >
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
            </div>

            <div className='flex flex-col gap-4 md:flex-row'>
              <div className='flex-1'>
                <label
                  htmlFor='companyName'
                  className='block text-sm text-[#67706D] mb-2 font-bold'
                >
                  Company Name
                </label>
                <Input
                  id='companyName'
                  name='companyName'
                  placeholder=''
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={errors.companyName ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.companyName && (
                  <p className='text-red-500 text-xs mt-1'>{errors.companyName}</p>
                )}
              </div>

              <div className='flex-1'>
                <label htmlFor='role' className='block text-sm text-[#67706D] mb-2 font-bold'>
                  Role
                </label>
                <Input
                  id='role'
                  name='role'
                  placeholder='e.g Head of Growth'
                  value={formData.role}
                  onChange={handleInputChange}
                  className={errors.role ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.role && <p className='text-red-500 text-xs mt-1'>{errors.role}</p>}
              </div>
            </div>

            <div className='flex flex-col gap-4 md:flex-row'>
              <div className='flex-1'>
                <label htmlFor='website' className='block text-sm text-[#67706D] mb-2 font-bold'>
                  Website URL
                </label>
                <Input
                  id='website'
                  name='website'
                  type='url'
                  placeholder='https://'
                  value={formData.website}
                  onChange={handleInputChange}
                  className={errors.website ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.website && <p className='text-red-500 text-xs mt-1'>{errors.website}</p>}
              </div>

              <div className='flex-1'>
                <label htmlFor='country' className='block text-sm text-[#67706D] mb-2 font-bold'>
                  Country
                </label>
                <Input
                  id='country'
                  name='country'
                  placeholder=''
                  value={formData.country}
                  onChange={handleInputChange}
                  className={errors.country ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.country && <p className='text-red-500 text-xs mt-1'>{errors.country}</p>}
              </div>
            </div>

            <div className='flex flex-col gap-4 md:flex-row'>
              <div className='flex-1'>
                <label htmlFor='industry' className='block text-sm text-[#67706D] mb-2 font-bold'>
                  Industry
                </label>
                <Input
                  id='industry'
                  name='industry'
                  placeholder='e.g. Fintech'
                  value={formData.industry}
                  onChange={handleInputChange}
                  className={errors.industry ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.industry && <p className='text-red-500 text-xs mt-1'>{errors.industry}</p>}
              </div>
              <div className='flex-1'>
                <label
                  htmlFor='contentTrack'
                  className='block text-sm text-[#67706D] mb-2 font-bold '
                >
                  Content track you'd like to speak on
                </label>
                <Select
                  value={formData.contentTrack}
                  onValueChange={handleContentTrackChange}
                  disabled={loading}
                >
                  <SelectTrigger error={!!errors.contentTrack}>
                    <SelectValue placeholder='Select content track' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Creative Economy'>Creative Economy</SelectItem>
                    <SelectItem value='AI & Innovation'>AI & Innovation</SelectItem>
                    <SelectItem value='Emerging Tech and Digital Transformation'>
                      Emerging Tech and Digital Transformation
                    </SelectItem>
                    <SelectItem value='Policy and Governance'>Policy and Governance</SelectItem>
                    <SelectItem value='AgriTech'>AgriTech</SelectItem>
                    <SelectItem value='Sustainability and Green Tech'>
                      Sustainability and Green Tech
                    </SelectItem>
                    <SelectItem value='Future of Work'>Future of Work</SelectItem>
                    <SelectItem value='Startups'>Startups</SelectItem>
                  </SelectContent>
                </Select>
                {errors.contentTrack && (
                  <p className='text-red-500 text-xs mt-1'>{errors.contentTrack}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor='topicProposal'
                className='block text-sm text-[#67706D] mb-2 font-bold'
              >
                Topic and idea for the session you'd like to propose
              </label>
              <textarea
                id='topicProposal'
                name='topicProposal'
                placeholder='Give us a wroking title and a short outline of what attendees will learn.'
                value={formData.topicProposal}
                onChange={handleInputChange}
                className={`w-full p-3 rounded border ${errors.topicProposal ? 'border-red-500' : 'border-[#000000]'} min-h-[150px]`}
                disabled={loading}
              />
              {errors.topicProposal && (
                <p className='text-red-500 text-xs mt-1'>{errors.topicProposal}</p>
              )}
            </div>
          </div>

          <div className='flex flex-col items-center md:flex-row justify-between gap-4'>
            <p>We review every application and reply by email.</p>

            <Button type='submit' className='rounded-lg h-11' disabled={loading}>
              {loading ? 'Submitting...' : 'Submit application'}
            </Button>
          </div>
        </form>
      </div>
    </RegisterLayout>
  );
};

export default Speakers;
