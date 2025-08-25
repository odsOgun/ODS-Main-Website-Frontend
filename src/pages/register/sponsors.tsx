import RegisterLayout from '@/components/layouts/registerLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Sponsors = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    mobile: '',
    website: '',
    linkedin: '',
    twitter: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    organization: '',
    mobile: '',
    website: '',
    linkedin: '',
    twitter: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      organization: '',
      mobile: '',
      website: '',
      linkedin: '',
      twitter: ''
    };

    if (!formData.name.trim()) newErrors.name = 'Name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.organization.trim()) newErrors.organization = 'Organization is required';

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\+234\s\d{3}\s\d{4}\s\d{4}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid Nigerian mobile number (+234 XXX XXXX XXXX)';
    }

    if (formData.website.trim() && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    if (formData.linkedin.trim() && !/^https?:\/\/.+/.test(formData.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
    }

    if (formData.twitter.trim() && !/^@\w+$/.test(formData.twitter)) {
      newErrors.twitter = 'Please enter a valid Twitter username (@username)';
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
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccessMsg('Form submitted successfully!');
        setFormData({
          name: '',
          email: '',
          organization: '',
          mobile: '',
          website: '',
          linkedin: '',
          twitter: ''
        });
      } else {
        const { error } = await res.json();
        setErrorMsg(error || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to submit form. Please try again later.');
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
            {['name', 'email', 'organization', 'mobile', 'website', 'linkedin', 'twitter'].map(
              (field) => (
                <div key={field}>
                  <label htmlFor={field} className='block text-sm text-[#67706D] mb-2'>
                    {field === 'name' && "What's your name"}
                    {field === 'email' && 'Your email address'}
                    {field === 'organization' && 'Organization'}
                    {field === 'mobile' && 'Mobile No'}
                    {field === 'website' && "Company's website"}
                    {field === 'linkedin' && "Company's LinkedIn"}
                    {field === 'twitter' && "Company's X (Twitter)"}
                  </label>
                  <Input
                    id={field}
                    name={field}
                    placeholder={
                      field === 'email'
                        ? 'email@example.com'
                        : field === 'mobile'
                          ? '+234 000 0000 000'
                          : field === 'website'
                            ? 'https://company.com'
                            : field === 'linkedin'
                              ? 'https://linkedin.com/company'
                              : field === 'twitter'
                                ? '@username'
                                : ''
                    }
                    value={formData[field as keyof typeof formData]}
                    onChange={handleInputChange}
                    className={errors[field as keyof typeof errors] ? 'border-red-500' : ''}
                  />
                  {errors[field as keyof typeof errors] && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors[field as keyof typeof errors]}
                    </p>
                  )}
                </div>
              )
            )}
          </div>

          {successMsg && <p className='text-green-600 text-sm'>{successMsg}</p>}
          {errorMsg && <p className='text-red-600 text-sm'>{errorMsg}</p>}

          <Button
            type='submit'
            disabled={loading}
            className='rounded-full h-11 w-full bg-black text-white'
          >
            {loading ? 'Submitting...' : 'Register'}
          </Button>
        </form>
      </div>
    </RegisterLayout>
  );
};

export default Sponsors;
