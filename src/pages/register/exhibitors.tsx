import RegisterLayout from '@/components/layouts/registerLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Exhibitors = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    mobile: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    organization: '',
    mobile: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    const newErrors = { name: '', email: '', organization: '', mobile: '' };

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.organization.trim()) newErrors.organization = 'Organization is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';

    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err !== '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSuccess('');

    try {
      const res = await fetch('/api/exhibitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Form submitted successfully!');
        setFormData({ name: '', email: '', organization: '', mobile: '' });
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterLayout>
      <div className='max-w-[516px] mx-auto p-6 pt-20'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>
          Exhibit at this year's Ogun Digital Summit
        </h1>
        <p className='text-sm text-gray-500 mb-10'>
          Fill out the form below and our team will reach out within 24 hours.
        </p>

        <form className='space-y-10' onSubmit={handleSubmit}>
          <div className='space-y-4'>
            {['name', 'email', 'organization', 'mobile'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className='block text-sm text-[#67706D] mb-2 capitalize'>
                  {field === 'mobile' ? 'Mobile No' : `Your ${field}`}
                </label>
                <Input
                  id={field}
                  name={field}
                  placeholder={field === 'mobile' ? '+234 000 0000 000' : ''}
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
            ))}
          </div>

          <Button type='submit' className='rounded-full h-11 w-full' disabled={loading}>
            {loading ? 'Submitting...' : 'Register'}
          </Button>

          {success && <p className='text-green-600 text-sm mt-2'>{success}</p>}
        </form>
      </div>
    </RegisterLayout>
  );
};

export default Exhibitors;
