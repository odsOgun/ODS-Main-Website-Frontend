import RegisterLayout from '@/components/layouts/registerLayout';
import { FormEvent, useState } from 'react';
import { apiService } from '@/api/apiService';
import { toast } from 'sonner';

const Reports = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await apiService.attendees.requestImpactReport({ name, email });
      toast.success('Impact report sent to your email');
      setName('');
      setEmail('');
    } catch {
      toast.error('Unable to Submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <RegisterLayout>
      <div className='max-w-[516px] mx-auto p-6 pt-20'>
        <h2 className='text-center text-2xl font-semibold text-[#0F172A] sm:text-[28px]'>
          Get the Impact Report
        </h2>
        <p className='mt-3 text-center text-sm leading-6 text-[#6B7280]'>
          Enter your details below to get exclusive access to our impact report for Ogun Digital
          Summit.
        </p>

        <form onSubmit={handleSubmit} className='mt-8 space-y-5'>
          <label className='block text-sm font-semibold text-[#475569]'>
            Full Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder='E.g. Jane Doe'
              className='mt-2 w-full rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#178A2D] focus:ring-2 focus:ring-[#D1FAE5]'
              required
            />
          </label>

          <label className='block text-sm font-semibold text-[#475569]'>
            Email Address
            <input
              type='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder='jane@example.com'
              className='mt-2 w-full rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#178A2D] focus:ring-2 focus:ring-[#D1FAE5]'
              required
            />
          </label>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full rounded-[8px] bg-[#178A2D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166f27] disabled:cursor-not-allowed disabled:bg-[#94A3B8]'
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </RegisterLayout>
  );
};

export default Reports;
