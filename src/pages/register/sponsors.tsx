import RegisterLayout from '@/components/layouts/registerLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Sponsors = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    organisation: '',
    email: '',
    phoneNumber: '',
    website: '',
    linkedinLink: '',
    twitterLink: ''
  });

  const [errors, setErrors] = useState({
    fullName: '',
    organisation: '',
    email: '',
    phoneNumber: '',
    website: '',
    linkedinLink: '',
    twitterLink: ''
  });

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
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

    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d+$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Website validation (optional but if provided, should be valid)
    if (formData.website.trim() && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    // LinkedIn validation (optional but if provided, should be valid)
    if (formData.linkedinLink.trim() && !/^https?:\/\/.+/.test(formData.linkedinLink)) {
      newErrors.linkedinLink = 'Please enter a valid LinkedIn URL';
    }

    // Twitter validation (optional but if provided, should be valid)
    if (formData.twitterLink.trim() && !/^https?:\/\/.+/.test(formData.twitterLink)) {
      newErrors.twitterLink = 'Please enter a valid Twitter URL';
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

    const submitPromise = fetch('https://ods2025.onrender.com/api/v1/sponsor/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    toast.promise(submitPromise, {
      loading: 'Submitting your sponsorship application...',
      success: async (response) => {
        if (response.ok) {
          setFormData({
            fullName: '',
            organisation: '',
            email: '',
            phoneNumber: '',
            website: '',
            linkedinLink: '',
            twitterLink: ''
          });
          setTimeout(() => navigate('/'), 1500);
          setLoading(false);
          return 'Sponsorship application submitted successfully! Redirecting to home...';
        } else {
          const errorData = await response.json();
          setLoading(false);
          throw new Error(errorData.message || 'Submission failed');
        }
      },
      error: (error) => {
        setLoading(false);
        return error.message || 'Failed to submit sponsorship application. Please try again.';
      }
    });
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

        {/* Removed successMsg and errorMsg divs as they are replaced by toast */}

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

            <div>
              <label htmlFor='website' className='block text-sm text-[#67706D] mb-2'>
                Company's website
              </label>
              <Input
                id='website'
                name='website'
                placeholder='https//:'
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
                placeholder='https//:www.linkedin.com'
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
