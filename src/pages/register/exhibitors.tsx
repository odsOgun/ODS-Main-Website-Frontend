import RegisterLayout from '@/components/layouts/registerLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Exhibitors = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    organisation: '',
    email: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState({
    fullName: '',
    organisation: '',
    email: '',
    phoneNumber: ''
  });

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      fullName: '',
      organisation: '',
      email: '',
      phoneNumber: ''
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

    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d+$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const submitPromise = fetch('https://ods2025.onrender.com/api/v1/exhibitor/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    toast.promise(submitPromise, {
      loading: 'Submitting your application...',
      success: async (response) => {
        if (response.ok) {
          setFormData({ fullName: '', organisation: '', email: '', phoneNumber: '' });
          setTimeout(() => navigate('/'), 1500);
          setLoading(false);
          return 'Application submitted successfully! Redirecting to home...';
        } else {
          const errorData = await response.json();
          setLoading(false);
          throw new Error(errorData.message || 'Submission failed');
        }
      },
      error: (error) => {
        setLoading(false);
        return error.message || 'Failed to submit application. Please try again.';
      }
    });
  };

  return (
    <RegisterLayout>
      <div className='max-w-[516px] mx-auto p-6 pt-20'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>
          Exhibit at this year's Ogun Digital Summit
        </h1>
        <p className='text-sm text-gray-500 mb-10'>
          Fill out the form below and our team will reach out to you in less than 24 hours.
        </p>

        <form className='space-y-10' onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div>
              <label htmlFor='name' className='block text-sm text-[#67706D] mb-2'>
                What's your name
              </label>
              <Input
                id='name'
                name='name'
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
                Your email address
              </label>
              <Input
                id='email'
                name='email'
                placeholder='email@example.com'
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
            </div>

            <div>
              <label htmlFor='organization' className='block text-sm text-[#67706D] mb-2'>
                Organization
              </label>
              <Input
                id='organization'
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
              <label htmlFor='mobile' className='block text-sm text-[#67706D] mb-2'>
                Mobile No
              </label>
              <Input
                id='mobile'
                name='phoneNumber'
                placeholder='+234 000 0000 000'
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

          <Button type='submit' className='rounded-full h-11' disabled={loading}>
            {loading ? 'Submitting...' : 'Register'}
          </Button>
        </form>
      </div>
    </RegisterLayout>
  );
};

export default Exhibitors;
