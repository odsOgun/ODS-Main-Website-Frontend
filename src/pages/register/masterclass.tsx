import RegisterLayout from '@/components/layouts/registerLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  country: string;
  industry: string;
  topic: string;
}

interface FormErrors {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  role: string;
  country: string;
  industry: string;
  topic: string;
}

const MasterClass: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    role: '',
    country: '',
    industry: '',
    topic: ''
  });

  const [errors, setErrors] = useState<FormErrors>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    role: '',
    country: '',
    industry: '',
    topic: ''
  });

  const [loading, setLoading] = useState<boolean>(false);

  const validateNigerianPhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[\s\-()]/g, '');

    const patterns = [/^\+234[789][01]\d{8}$/, /^234[789][01]\d{8}$/, /^0[789][01]\d{8}$/];

    return patterns.some((pattern) => pattern.test(cleanPhone));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      companyName: '',
      role: '',
      country: '',
      industry: '',
      topic: ''
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validateNigerianPhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber =
        'Please enter a valid Nigerian phone number (e.g., +234 803 123 4567 or 0803 123 4567)';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }

    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic and idea is required';
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
      await apiService.masterClass.create(formData);

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        companyName: '',
        role: '',
        country: '',
        industry: '',
        topic: ''
      });
      toast.success('Master class application submitted successfully! Redirecting to home...');
      setTimeout(() => navigate('/'), 1500);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError;

        const errorMessage =
          (axiosError.response?.data as { error?: string })?.error ||
          (axiosError.response?.data as { message?: string })?.message ||
          `Submission failed (${axiosError.response?.status})`;
        toast.error(errorMessage);
      } else if (error && typeof error === 'object' && 'request' in error) {
        toast.error('No response from server. Please check your connection.');
      } else {
        toast.error('Failed to submit master class application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterLayout>
      <div className='max-w-[600px] mx-auto p-6 pt-20'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>Master Class details</h1>
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
              {/* <div className='flex-1'>
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
              </div> */}

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
            </div>

            <div>
              <label htmlFor='topic' className='block text-sm text-[#67706D] mb-2 font-bold'>
                Topic and idea for the session you'd like to propose
              </label>
              <textarea
                id='topic'
                name='topic'
                placeholder='Give us a working title and a short outline of what attendees will learn.'
                value={formData.topic}
                onChange={handleInputChange}
                className={`w-full p-3 rounded border ${errors.topic ? 'border-red-500' : 'border-[#000000]'} min-h-[150px]`}
                disabled={loading}
              />
              {errors.topic && <p className='text-red-500 text-xs mt-1'>{errors.topic}</p>}
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

export default MasterClass;
