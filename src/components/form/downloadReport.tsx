import { FilePlus } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { apiService } from '@/api/apiService';
import { toast } from 'sonner';

interface DownloadReportModalProps {
  onClose: () => void;
}

function DownloadReportModal({ onClose }: DownloadReportModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiService.attendees.requestImpactReport({ name, email });
      const blob = new Blob([response.data], { type: response.data.type || 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ODS-Impact-Report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Your report is downloading now.');
      onClose();
    } catch (error) {
      console.error('Download report submission error:', error);
      toast.error('Unable to download report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='w-[90%] max-w-[560px] rounded-[16px] bg-white p-6 md:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.08)] relative'>
      <button
        type='button'
        onClick={onClose}
        className='absolute right-5 top-5 text-[#94A3B8] hover:text-[#475569] text-[22px] font-bold '
        aria-label='Close modal'
      >
        ×
      </button>

      <div className='mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#E6F8EE] text-[#178A2D]'>
        <FilePlus />
      </div>

      <h2 className='text-center text-2xl font-semibold text-[#0F172A] sm:text-[28px]'>
        Get the 2025 Impact Report
      </h2>
      <p className='mt-3 text-center text-sm leading-6 text-[#6B7280]'>
        Enter your details below to get exclusive access to our impact report for Ogun Digital
        Summit 2025.
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
          {isSubmitting ? 'Downloading...' : 'Download the report'}
        </button>
      </form>
    </div>
  );
}

export default DownloadReportModal;
