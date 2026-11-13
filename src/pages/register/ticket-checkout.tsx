import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  Download,
  ShieldCheck,
  X
} from 'lucide-react';
import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { apiBaseUrl, apiRequest } from './_components/ticketing-api';
import odsLogo from '@/assets/img/ODSlogo.png';
import {
  Select as CustomSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type TicketId = 'regular' | 'silver' | 'experience' | 'founders';
type Step = 'tickets' | 'contact' | 'payment' | 'confirmation';

interface TicketType {
  id: TicketId;
  name: string;
  price: number;
  fee: number;
  description: string;
  perks: string;
}

interface Attendee {
  id: string;
  ticketId: TicketId;
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  phone: string;
  companyName: string;
  schoolName: string;
  jobRole: string;
  attendingPhysically: string;
  attendeeCategory: string;
  stateOfResidence: string;
  otherCountry: string;
  referralSource: string;
  careerPath: string;
  otherCareerPath: string;
  techSkillLevel: string;
  isNyscMember: string;
}

interface Order {
  id: string;
  email: string;
  type: string;
  qty: number;
  attendees: Attendee[];
  attendedBefore: string;
  tickets: { id: TicketId; name: string; qty: number }[];
  total: number;
  issuedAt: string;
}

interface Pass {
  id: string;
  ticketId: string;
  ticketName: string;
  name: string;
  email: string;
}

interface ConfirmedOrder {
  passes: Pass[];
  paymentReference?: string;
}

type ConfirmedTicket = Order & ConfirmedOrder;

type FieldChange = { target: { name: string; value: string } };

const ticketTypes: TicketType[] = [
  {
    id: 'regular',
    name: 'Regular Pass',
    price: 0,
    fee: 0,
    description:
      "For the curious, the builders, and the just-getting-started. This pass is for anyone interested in the ideas, people, and opportunities shaping Nigeria's digital future.",
    perks: 'Access to main event | Keynotes, panels, exhibitions'
  },
  {
    id: 'silver',
    name: 'Silver Pass',
    price: 15000,
    fee: 1300,
    description:
      'With over 2,000 participants expected, skip the long queue and experience a more personal focused experience just for you.',
    perks: 'Access to ODS 2026 main event | Reserved Seat | Event Merch | Refreshment'
  },
  {
    id: 'experience',
    name: 'ODS Experience Pass',
    price: 35000,
    fee: 2900,
    description:
      'For those who want to experience ODS in full and take a piece of the experience home.',
    perks:
      'Access to main event | Priority Check in | VIP Front Row Reserved Seat | Exclusive ODS Packaged Box | Lunch'
  },
  {
    id: 'founders',
    name: 'Founders & Investors Pass',
    price: 100000,
    fee: 8100,
    description:
      'Reserved for founders, entrepreneurs, investors, executives, and ecosystem leaders building across technology and business.',
    perks:
      'Access to main event | Priority Check in | VIP Front Row Reserved Seat | Exclusive ODS Packaged Box | Connection room | Builders dinner'
  }
];

const referralOptions = [
  'Instagram',
  'Facebook',
  'TikTok',
  'LinkedIn',
  'WhatsApp',
  'X (Twitter)',
  'Friends',
  'Community or Partner Organisation',
  'Flyer, Poster or Radio',
  'ODS Website'
];
const yesNoOptions = ['Yes', 'No'];
const attendedBeforeOptions = ['Yes', 'No, this is my first time'];
const attendeeCategoryOptions = [
  'Experienced Professional (employed)',
  'Freelancer',
  'SME Owner',
  'Startup Founder or Entrepreneur',
  'Working Student',
  'Aspiring Student',
  'Tech Enthusiast',
  'Creative or Content Creator',
  'Investor, Executive or Ecosystem Stakeholder',
  'Government Stakeholder'
];
const nigerianStates = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
  'FCT - Abuja'
];
const residenceOptions = [...nigerianStates, 'Outside Nigeria'];
const careerPathOptions = [
  'Product Management',
  'Digital Marketing',
  'Data Analytics',
  'Product Design',
  'Mobile Application Development',
  'Blockchain',
  'Cybersecurity',
  'AI & Machine Learning',
  'Web Development',
  'Others',
  'None'
];
const skillLevelOptions = [
  'Not Interested',
  'Curious, Just Starting Out',
  'Actively Building Skills',
  'Expert'
];

const currency = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0
});

function formatPrice(value: number) {
  return value === 0 ? 'Free' : currency.format(value);
}

function buildTicketId() {
  const now = new Date();
  return `ODS-${now.getFullYear().toString().slice(-2)}${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function createAttendee(ticketId: TicketId): Attendee {
  return {
    id: `${ticketId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ticketId,
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    phone: '',
    companyName: '',
    schoolName: '',
    jobRole: '',
    attendingPhysically: '',
    attendeeCategory: '',
    stateOfResidence: '',
    otherCountry: '',
    referralSource: '',
    careerPath: '',
    otherCareerPath: '',
    techSkillLevel: '',
    isNyscMember: ''
  };
}

function toApiOrder(order: Order) {
  return {
    orderId: order.id,
    email: order.email,
    tickets: order.tickets,
    attendees: order.attendees,
    attendedBefore: order.attendedBefore
  };
}

export default function TicketCheckout() {
  const navigate = useNavigate();
  const goHome = () => navigate('/');

  const [step, setStep] = useState<Step>('tickets');
  const [quantities, setQuantities] = useState<Record<TicketId, number>>({
    regular: 0,
    silver: 0,
    experience: 0,
    founders: 0
  });
  const [attendedBefore, setAttendedBefore] = useState('');
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [confirmedTicket, setConfirmedTicket] = useState<ConfirmedTicket | null>(null);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState('');

  const selectedItems = useMemo(
    () =>
      ticketTypes
        .map((ticket) => ({ ...ticket, qty: quantities[ticket.id] || 0 }))
        .filter((ticket) => ticket.qty > 0),
    [quantities]
  );

  const ticketTotal = selectedItems.reduce((sum, ticket) => sum + ticket.price * ticket.qty, 0);
  const serviceFees = selectedItems.reduce((sum, ticket) => sum + ticket.fee * ticket.qty, 0);
  const subtotal = ticketTotal + serviceFees;
  const totalQty = selectedItems.reduce((sum, ticket) => sum + ticket.qty, 0);
  const orderedAttendees = useMemo(
    () =>
      ticketTypes.flatMap((ticket) =>
        attendees.filter((attendee) => attendee.ticketId === ticket.id)
      ),
    [attendees]
  );
  const contactValid =
    !!attendedBefore &&
    orderedAttendees.length === totalQty &&
    orderedAttendees.length > 0 &&
    orderedAttendees.every(
      (attendee) =>
        attendee.firstName &&
        attendee.lastName &&
        attendee.email &&
        attendee.confirmEmail &&
        attendee.email === attendee.confirmEmail &&
        attendee.phone &&
        attendee.attendingPhysically &&
        attendee.attendeeCategory &&
        attendee.stateOfResidence &&
        (attendee.stateOfResidence !== 'Outside Nigeria' || attendee.otherCountry) &&
        attendee.referralSource &&
        (attendee.careerPath !== 'Others' || attendee.otherCareerPath) &&
        attendee.techSkillLevel &&
        attendee.isNyscMember
    );

  function updateQuantity(id: TicketId, value: string) {
    const nextQuantity = Number(value);
    setQuantities((current) => ({ ...current, [id]: nextQuantity }));
    setAttendees((current) => {
      const matching = current.filter((attendee) => attendee.ticketId === id);
      const otherAttendees = current.filter((attendee) => attendee.ticketId !== id);

      if (matching.length >= nextQuantity) {
        return [...otherAttendees, ...matching.slice(0, nextQuantity)];
      }

      const additions = Array.from({ length: nextQuantity - matching.length }, () =>
        createAttendee(id)
      );
      return [...otherAttendees, ...matching, ...additions];
    });
  }

  function handleAttendeeChange(attendeeId: string, event: FieldChange) {
    const { name, value } = event.target;
    setAttendees((current) =>
      current.map((attendee) =>
        attendee.id === attendeeId ? { ...attendee, [name]: value } : attendee
      )
    );
  }

  function removeAttendee(attendeeId: string) {
    const attendee = attendees.find((item) => item.id === attendeeId);
    if (!attendee) return;

    setAttendees((current) => current.filter((item) => item.id !== attendeeId));
    setQuantities((current) => ({
      ...current,
      [attendee.ticketId]: Math.max(0, current[attendee.ticketId] - 1)
    }));

    if (attendees.length === 1) setStep('tickets');
  }

  async function completeRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contactValid || selectedItems.length === 0) return;
    setRegistrationError('');

    const order: Order = {
      id: buildTicketId(),
      email: orderedAttendees[0].email,
      type: selectedItems.map((item) => `${item.qty} x ${item.name}`).join(', '),
      qty: totalQty,
      attendees: orderedAttendees,
      attendedBefore,
      tickets: selectedItems.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.qty
      })),
      total: subtotal,
      issuedAt: new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(new Date())
    };

    setPendingOrder(order);
    if (subtotal > 0) {
      setStep('payment');
    } else {
      setRegistrationLoading(true);
      try {
        const result = await apiRequest<{ order: ConfirmedOrder }>('/orders', {
          method: 'POST',
          body: JSON.stringify(toApiOrder(order))
        });
        showConfirmedOrder(order, result.order);
      } catch (error) {
        setRegistrationError((error as Error).message || 'Registration could not be completed.');
      } finally {
        setRegistrationLoading(false);
      }
    }
  }

  function showConfirmedOrder(order: Order, confirmedOrder: ConfirmedOrder) {
    setConfirmedTicket({
      ...order,
      passes: confirmedOrder.passes,
      paymentReference: confirmedOrder.paymentReference
    });
    setStep('confirmation');
  }

  return (
    <main className='min-h-screen bg-[#f7f9f8] text-ods-black print:min-h-0 print:bg-white'>
      <header className='sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur print:hidden'>
        <div className='mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8'>
          <div className='flex items-center gap-5'>
            <a href='/' aria-label='Ogun Digital Summit home'>
              <img src={odsLogo} alt='Ogun Digital Summit' className='h-9 w-auto' />
            </a>
            <span className='hidden h-7 w-px bg-slate-200 sm:block' />
            <span className='hidden text-sm font-semibold text-slate-600 sm:block'>
              Ticket checkout
            </span>
          </div>
          <button
            aria-label='Close checkout'
            onClick={goHome}
            className='grid h-10 w-10 place-items-center text-slate-500 hover:bg-slate-100 hover:text-ods-black'
          >
            <X size={22} />
          </button>
        </div>
      </header>

      <section className='mx-auto grid max-w-6xl gap-10 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14 print:block print:max-w-none print:gap-0 print:p-0'>
        <div className='min-w-0'>
          <Stepper step={step} />
          {step === 'tickets' && (
            <TicketStep
              quantities={quantities}
              onQuantityChange={updateQuantity}
              onBack={goHome}
              onContinue={() => setStep('contact')}
            />
          )}
          {step === 'contact' && (
            <ContactStep
              attendees={orderedAttendees}
              attendedBefore={attendedBefore}
              onAttendedBeforeChange={(event) => setAttendedBefore(event.target.value)}
              onAttendeeChange={handleAttendeeChange}
              onRemoveAttendee={removeAttendee}
              onBack={() => setStep('tickets')}
              onSubmit={completeRegistration}
              contactValid={contactValid}
              requiresPayment={subtotal > 0}
              loading={registrationLoading}
              error={registrationError}
            />
          )}
          {step === 'payment' && pendingOrder && (
            <PaymentStep
              order={pendingOrder}
              onBack={() => setStep('contact')}
              onVerified={(confirmedOrder) => showConfirmedOrder(pendingOrder, confirmedOrder)}
            />
          )}
          {step === 'confirmation' && confirmedTicket && (
            <Confirmation order={confirmedTicket} onBack={goHome} />
          )}
        </div>

        <SummaryCard
          selectedItems={selectedItems}
          ticketTotal={ticketTotal}
          serviceFees={serviceFees}
          subtotal={subtotal}
          step={step}
        />
      </section>
    </main>
  );
}

function TicketStep({
  quantities,
  onQuantityChange,
  onBack,
  onContinue
}: {
  quantities: Record<TicketId, number>;
  onQuantityChange: (id: TicketId, value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <section>
      <div className='mb-7 flex items-start gap-4'>
        <button
          aria-label='Back to home'
          onClick={onBack}
          className='mt-1 grid h-9 w-9 shrink-0 place-items-center border border-slate-300 bg-white text-slate-600 hover:border-ods-green hover:text-ods-green'
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className='text-2xl font-bold sm:text-3xl'>Choose your tickets</h1>
          <p className='mt-2 text-sm text-slate-500'>
            Select up to five tickets from each pass type.
          </p>
        </div>
      </div>

      <div className='space-y-4'>
        {ticketTypes.map((ticket) => {
          const quantity = quantities[ticket.id] || 0;
          const selected = quantity > 0;
          const toggle = () => onQuantityChange(ticket.id, selected ? '0' : '1');

          return (
            <article
              key={ticket.id}
              role='button'
              tabIndex={0}
              aria-pressed={selected}
              onClick={toggle}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  toggle();
                }
              }}
              className={`grid cursor-pointer gap-5 border bg-white p-5 transition hover:border-ods-green sm:grid-cols-[minmax(0,1fr)_108px] sm:p-6 ${
                selected ? 'border-ods-green ring-1 ring-ods-green' : 'border-slate-200'
              }`}
            >
              <div>
                <div className='flex flex-wrap items-baseline justify-between gap-3'>
                  <h2 className='flex items-center gap-2 text-lg font-bold'>
                    {selected && <CheckCircle2 size={20} className='text-ods-green' />}
                    {ticket.name}
                  </h2>
                  <p className='text-lg font-bold text-ods-green'>{formatPrice(ticket.price)}</p>
                </div>
                <p className='mt-3 text-sm leading-6 text-slate-600'>{ticket.description}</p>
                <p className='mt-3 text-sm leading-6 text-slate-500'>
                  <span className='font-semibold text-slate-700'>Includes:</span> {ticket.perks}
                </p>
              </div>
              <label
                className='block cursor-default sm:text-right'
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                <span className='text-xs font-semibold uppercase text-slate-400'>Quantity</span>
                <CustomSelect
                  value={String(quantity)}
                  onValueChange={(value) => onQuantityChange(ticket.id, value)}
                >
                  <SelectTrigger className='mt-2 h-11 justify-center rounded-none border-slate-300 px-3 text-center font-semibold'>
                    <SelectValue aria-label={`${ticket.name} quantity`} />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map((count) => (
                      <SelectItem key={count} value={String(count)}>
                        {count}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </CustomSelect>
              </label>
            </article>
          );
        })}
      </div>

      <div className='mt-7 flex justify-end'>
        <button
          onClick={onContinue}
          className='h-12 w-full bg-ods-green px-8 text-base font-bold text-white transition hover:bg-[#008c45] disabled:bg-slate-200 disabled:text-slate-400 sm:w-auto'
          disabled={!Object.values(quantities).some(Boolean)}
        >
          Continue to details
        </button>
      </div>
    </section>
  );
}

function ContactStep({
  attendees,
  attendedBefore,
  onAttendedBeforeChange,
  onAttendeeChange,
  onRemoveAttendee,
  onBack,
  onSubmit,
  contactValid,
  requiresPayment,
  loading,
  error
}: {
  attendees: Attendee[];
  attendedBefore: string;
  onAttendedBeforeChange: (event: FieldChange) => void;
  onAttendeeChange: (attendeeId: string, event: FieldChange) => void;
  onRemoveAttendee: (attendeeId: string) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  contactValid: boolean;
  requiresPayment: boolean;
  loading: boolean;
  error: string;
}) {
  return (
    <form onSubmit={onSubmit}>
      <div className='mb-7 flex items-start gap-4'>
        <button
          type='button'
          onClick={onBack}
          aria-label='Back to tickets'
          className='mt-1 grid h-9 w-9 shrink-0 place-items-center border border-slate-300 bg-white text-slate-600 hover:border-ods-green hover:text-ods-green'
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className='text-2xl font-bold sm:text-3xl'>Attendee details</h1>
          <p className='mt-2 text-sm text-slate-500'>Tell us who the tickets are for.</p>
        </div>
      </div>

      <div className='mb-8 border-l-4 border-ods-green bg-emerald-50 px-4 py-3 text-sm leading-6 text-slate-600'>
        Complete one attendee form for each selected ticket. Removing a form also removes that
        ticket from your order.
      </div>

      <section className='border border-slate-200 bg-white p-5 sm:p-6'>
        <p className='text-xs font-semibold uppercase text-ods-green'>Asked once per order</p>
        <div className='mt-4'>
          <RadioGroup
            label='Have you attended ODS before?'
            name='attendedBefore'
            value={attendedBefore}
            onChange={onAttendedBeforeChange}
            options={attendedBeforeOptions}
            required
          />
        </div>
      </section>

      <div className='mt-5 space-y-5'>
        {attendees.map((attendee, index) => (
          <AttendeeDetailsCard
            key={attendee.id}
            attendee={attendee}
            number={index + 1}
            onChange={(event) => onAttendeeChange(attendee.id, event)}
            onRemove={() => onRemoveAttendee(attendee.id)}
          />
        ))}
      </div>

      {error && (
        <p
          role='alert'
          className='mt-7 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700'
        >
          {error}
        </p>
      )}
      <div className='mt-7 flex justify-end'>
        <button
          type='submit'
          disabled={!contactValid || loading}
          className='h-12 w-full bg-ods-green px-8 text-base font-bold text-white transition hover:bg-[#008c45] disabled:bg-slate-200 disabled:text-slate-400 sm:w-auto'
        >
          {loading
            ? 'Creating passes...'
            : requiresPayment
              ? 'Continue to payment'
              : 'Complete registration'}
        </button>
      </div>
    </form>
  );
}

function AttendeeDetailsCard({
  attendee,
  number,
  onChange,
  onRemove
}: {
  attendee: Attendee;
  number: number;
  onChange: (event: FieldChange) => void;
  onRemove: () => void;
}) {
  const ticket = ticketTypes.find((item) => item.id === attendee.ticketId);
  const changeRadioField = (field: string) => (event: FieldChange) =>
    onChange({ target: { name: field, value: event.target.value } });
  const isStudent = ['Working Student', 'Aspiring Student'].includes(attendee.attendeeCategory);
  const handleFieldChange = (event: FieldChange) => {
    if (
      event.target.name === 'attendeeCategory' &&
      ['Working Student', 'Aspiring Student'].includes(event.target.value)
    ) {
      onChange({ target: { name: 'companyName', value: '' } });
      onChange({ target: { name: 'jobRole', value: '' } });
    }
    if (event.target.name === 'stateOfResidence' && event.target.value !== 'Outside Nigeria') {
      onChange({ target: { name: 'otherCountry', value: '' } });
    }
    if (event.target.name === 'careerPath' && event.target.value !== 'Others') {
      onChange({ target: { name: 'otherCareerPath', value: '' } });
    }
    onChange(event);
  };

  return (
    <section className='border border-slate-200 bg-white'>
      <div className='flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6'>
        <div>
          <p className='text-xs font-semibold uppercase text-ods-green'>Attendee {number}</p>
          <h2 className='mt-1 text-lg font-bold'>{ticket?.name}</h2>
        </div>
        <button
          type='button'
          onClick={onRemove}
          aria-label={`Remove attendee ${number}`}
          title='Remove attendee and ticket'
          className='grid h-9 w-9 shrink-0 place-items-center border border-slate-300 text-slate-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600'
        >
          <X size={18} />
        </button>
      </div>

      <div className='grid gap-8 p-5 sm:p-6'>
        <div className='grid gap-5 sm:grid-cols-2'>
          <Input
            label='First name'
            name='firstName'
            value={attendee.firstName}
            onChange={onChange}
            required
          />
          <Input
            label='Last name'
            name='lastName'
            value={attendee.lastName}
            onChange={onChange}
            required
          />
          <Input
            label='Email address'
            name='email'
            type='email'
            value={attendee.email}
            onChange={onChange}
            required
          />
          <Input
            label='Confirm email address'
            name='confirmEmail'
            type='email'
            value={attendee.confirmEmail}
            onChange={onChange}
            required
          />
          {attendee.confirmEmail && attendee.email !== attendee.confirmEmail && (
            <p className='-mt-3 text-sm text-red-600 sm:col-span-2'>
              Email addresses do not match.
            </p>
          )}
          <div className='sm:col-span-2'>
            <span className='text-sm font-medium text-slate-700'>
              <span className='text-ods-green'>*</span> Phone number
            </span>
            <div className='mt-2 grid grid-cols-[100px_minmax(0,1fr)] gap-2'>
              <CustomSelect defaultValue='+234'>
                <SelectTrigger className='h-12 rounded-none border-slate-300 px-3'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='+234'>+234</SelectItem>
                </SelectContent>
              </CustomSelect>
              <input
                name='phone'
                value={attendee.phone}
                onChange={onChange}
                required
                placeholder='Phone number'
                className='h-12 min-w-0 border border-slate-300 px-4 focus:border-ods-green'
              />
            </div>
          </div>
        </div>

        <div className='h-px bg-slate-200' />

        <div className='grid gap-8'>
          <RadioGroup
            label='Will you be attending this event physically?'
            name={`attendingPhysically-${attendee.id}`}
            value={attendee.attendingPhysically}
            onChange={changeRadioField('attendingPhysically')}
            options={yesNoOptions}
            required
          />
          <Select
            label='Which of these best describes you?'
            name='attendeeCategory'
            value={attendee.attendeeCategory}
            onChange={handleFieldChange}
            options={attendeeCategoryOptions}
            required
          />
          <Select
            label='Where do you reside?'
            name='stateOfResidence'
            value={attendee.stateOfResidence}
            onChange={onChange}
            options={residenceOptions}
            required
          />
          {attendee.stateOfResidence === 'Outside Nigeria' && (
            <Input
              label='Country'
              name='otherCountry'
              value={attendee.otherCountry}
              onChange={onChange}
              required
            />
          )}
          <Select
            label='How did you hear about us?'
            name='referralSource'
            value={attendee.referralSource}
            onChange={onChange}
            options={referralOptions}
            required
          />
          <RadioGroup
            label='Are you a NYSC corps member?'
            name={`isNyscMember-${attendee.id}`}
            value={attendee.isNyscMember}
            onChange={changeRadioField('isNyscMember')}
            options={yesNoOptions}
            required
          />
          <Select
            label='Are you interested in building a career in any of these paths?'
            name='careerPath'
            value={attendee.careerPath}
            onChange={handleFieldChange}
            options={careerPathOptions}
          />
          {attendee.careerPath === 'Others' && (
            <Input
              label='Other career path'
              name='otherCareerPath'
              value={attendee.otherCareerPath}
              onChange={onChange}
              required
            />
          )}
          <RadioGroup
            label='How would you describe your current tech skill level?'
            name={`techSkillLevel-${attendee.id}`}
            value={attendee.techSkillLevel}
            onChange={changeRadioField('techSkillLevel')}
            options={skillLevelOptions}
            required
          />
          <div className='grid gap-5 sm:grid-cols-2'>
            {!isStudent && (
              <Input
                label='Company Name'
                name='companyName'
                value={attendee.companyName}
                onChange={onChange}
              />
            )}
            <Input
              label='School Name'
              name='schoolName'
              value={attendee.schoolName}
              onChange={onChange}
            />
          </div>
          {!isStudent && (
            <Input
              label='Job Role/Title'
              name='jobRole'
              value={attendee.jobRole}
              onChange={onChange}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function PaymentStep({
  order,
  onBack,
  onVerified
}: {
  order: Order;
  onBack: () => void;
  onVerified: (order: ConfirmedOrder) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function startPayment() {
    if (!apiBaseUrl) {
      setError('Online payment is not configured yet. Please contact the event organiser.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const initialization = await apiRequest<{ accessCode?: string; message?: string }>(
        '/payments/initialize',
        {
          method: 'POST',
          body: JSON.stringify(toApiOrder(order))
        }
      );
      if (!initialization.accessCode) {
        throw new Error(initialization.message || 'Payment could not be initialized.');
      }

      const { default: Paystack } = await import('@paystack/inline-js');
      const popup = new Paystack();
      popup.resumeTransaction(initialization.accessCode, {
        onLoad: () => setLoading(false),
        onCancel: () => setLoading(false),
        onError: (paymentError: { message?: string }) => {
          setLoading(false);
          setError(paymentError?.message || 'Payment could not be completed. Please try again.');
        },
        onSuccess: async (transaction: { reference: string }) => {
          try {
            setLoading(true);
            const verification = await apiRequest<{
              verified?: boolean;
              amount?: number | string;
              order?: ConfirmedOrder;
            }>('/payments/verify', {
              method: 'POST',
              body: JSON.stringify({
                reference: transaction.reference,
                orderId: order.id
              })
            });
            const expectedAmount = order.total * 100;

            if (
              !verification.verified ||
              Number(verification.amount) !== expectedAmount ||
              !verification.order?.passes?.length
            ) {
              throw new Error('Payment could not be verified. No passes have been issued.');
            }

            onVerified(verification.order);
          } catch (verificationError) {
            setError((verificationError as Error).message || 'Payment verification failed.');
          } finally {
            setLoading(false);
          }
        }
      });
    } catch (paymentError) {
      setLoading(false);
      setError(
        (paymentError as Error).message || 'Payment could not be started. Please try again.'
      );
    }
  }

  return (
    <section>
      <div className='mb-7 flex items-start gap-4'>
        <button
          type='button'
          onClick={onBack}
          aria-label='Back to attendee details'
          className='mt-1 grid h-9 w-9 shrink-0 place-items-center border border-slate-300 bg-white text-slate-600 hover:border-ods-green hover:text-ods-green'
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className='text-2xl font-bold sm:text-3xl'>Payment</h1>
          <p className='mt-2 text-sm text-slate-500'>
            Complete payment before your passes are issued.
          </p>
        </div>
      </div>

      <div className='border border-slate-200 bg-white p-6 sm:p-8'>
        <div className='flex items-center gap-3 text-ods-green'>
          <CreditCard size={24} />
          <h2 className='text-lg font-bold text-ods-black'>Pay securely with Paystack</h2>
        </div>
        <p className='mt-4 max-w-xl text-sm leading-6 text-slate-600'>
          Pay with card, bank transfer, USSD, or another available Paystack payment channel. Your
          passes are created only after the transaction is verified.
        </p>

        <div className='my-7 border-y border-slate-200 py-5'>
          <div className='flex items-center justify-between gap-6'>
            <span className='text-sm text-slate-500'>Amount due</span>
            <span className='text-2xl font-bold'>{formatPrice(order.total)}</span>
          </div>
        </div>

        {error && (
          <p
            role='alert'
            className='mb-5 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700'
          >
            {error}
          </p>
        )}

        <button
          type='button'
          onClick={startPayment}
          disabled={loading}
          className='h-12 w-full bg-ods-green px-6 font-bold text-white transition hover:bg-[#008c45] disabled:bg-slate-300'
        >
          {loading ? 'Connecting to Paystack...' : `Pay ${formatPrice(order.total)}`}
        </button>

        <div className='mt-5 flex items-start gap-3 text-xs leading-5 text-slate-400'>
          <ShieldCheck className='mt-0.5 shrink-0' size={16} />
          Payment details are entered securely in Paystack. ODS does not store your card details.
        </div>
      </div>
    </section>
  );
}

function SummaryCard({
  selectedItems,
  ticketTotal,
  serviceFees,
  subtotal,
  step
}: {
  selectedItems: (TicketType & { qty: number })[];
  ticketTotal: number;
  serviceFees: number;
  subtotal: number;
  step: Step;
}) {
  return (
    <aside className='h-fit border border-slate-200 bg-white lg:sticky lg:top-28 print:hidden'>
      <div className='border-b border-slate-200 p-6'>
        <p className='text-xs font-semibold uppercase text-ods-green'>Order summary</p>
        <h2 className='mt-2 text-xl font-bold'>Ogun Digital Summit 2026</h2>
        <p className='mt-2 text-sm text-slate-500'>Thursday, November 26, 2026</p>
      </div>
      <div className='p-6'>
        <div className='space-y-4 text-slate-600'>
          {selectedItems.length === 0 ? (
            <p className='text-sm'>Choose a ticket to see your order total.</p>
          ) : (
            selectedItems.map((item) => (
              <SummaryRow
                key={item.id}
                label={`${item.qty} x ${item.name}`}
                value={formatPrice(item.price * item.qty)}
              />
            ))
          )}
        </div>

        <div className='my-6 h-px bg-slate-200' />
        <div className='space-y-3 text-sm text-slate-500'>
          <SummaryRow label='Tickets' value={formatPrice(ticketTotal)} compact />
          <SummaryRow label='Service fees' value={formatPrice(serviceFees)} compact />
        </div>

        <div className='mt-6 flex items-center justify-between border-t border-slate-200 pt-5 text-lg font-bold'>
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <p className='mt-5 text-xs leading-5 text-slate-400'>
          {step === 'tickets' && 'Your total updates as you change ticket quantities.'}
          {step === 'contact' && 'Review your order before continuing to payment.'}
          {step === 'payment' && 'Passes are issued only after payment is verified.'}
          {step === 'confirmation' && 'Registration complete.'}
        </p>
      </div>
    </aside>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps: Step[] = ['tickets', 'contact', 'payment'];
  const labels: Record<string, string> = {
    tickets: 'Tickets',
    contact: 'Details',
    payment: 'Payment'
  };
  const activeIndex = step === 'confirmation' ? steps.length : steps.indexOf(step);

  return (
    <nav
      aria-label='Checkout progress'
      className='mb-10 grid grid-cols-3 items-center gap-2 print:hidden'
    >
      {steps.map((item, index) => (
        <div key={item} className='flex min-w-0 items-center gap-2 sm:gap-3'>
          <span
            className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-bold ${
              index < activeIndex
                ? 'border-ods-green bg-ods-green text-white'
                : index === activeIndex
                  ? 'border-ods-green text-ods-green'
                  : 'border-slate-300 text-slate-400'
            }`}
          >
            {index < activeIndex ? <CheckCircle2 size={14} /> : index + 1}
          </span>
          <span
            className={`truncate text-xs font-semibold sm:text-sm ${index <= activeIndex ? 'text-slate-700' : 'text-slate-400'}`}
          >
            {labels[item]}
          </span>
          {index < steps.length - 1 && <span className='h-px flex-1 bg-slate-200' />}
        </div>
      ))}
    </nav>
  );
}

function Confirmation({ order, onBack }: { order: ConfirmedTicket; onBack: () => void }) {
  return (
    <section>
      <div className='border border-slate-200 border-t-4 border-t-ods-green bg-white p-6 sm:p-8 print:border-0 print:p-0'>
        <div className='print:hidden'>
          <BadgeCheck className='text-ods-green' size={34} />
          <h1 className='mt-5 text-2xl font-bold'>Registration confirmed</h1>
          <p className='mt-2 text-slate-600'>
            {order.passes.length} {order.passes.length === 1 ? 'pass has' : 'passes have'} been
            created. Each attendee must present their own QR code at check-in.
          </p>
          {order.paymentReference && (
            <p className='mt-3 text-xs text-slate-400'>
              Payment reference: <span className='font-mono'>{order.paymentReference}</span>
            </p>
          )}
        </div>

        <div className='mt-8 space-y-5 print:mt-0'>
          {order.passes.map((pass) => (
            <AttendeePass key={pass.id} pass={pass} />
          ))}
        </div>

        <div className='mt-7 flex flex-wrap gap-3 print:hidden'>
          <button
            onClick={() => window.print()}
            className='inline-flex items-center gap-2 bg-ods-navy px-4 py-3 text-sm font-bold text-white'
          >
            <Download size={17} /> Print or save passes
          </button>
          <button onClick={onBack} className='border border-slate-300 px-4 py-3 text-sm font-bold'>
            Back to Home
          </button>
        </div>
      </div>
    </section>
  );
}

function AttendeePass({ pass }: { pass: Pass }) {
  const qrValue = JSON.stringify({
    event: 'ODS2026',
    passId: pass.id,
    ticket: pass.ticketId
  });

  return (
    <article className='break-inside-avoid overflow-hidden border border-slate-300 bg-white'>
      <div aria-hidden='true' className='h-3 bg-ods-green' />
      <div className='grid gap-6 p-5 sm:grid-cols-[minmax(0,1fr)_170px] sm:items-center sm:p-6'>
        <div>
          <img src={odsLogo} alt='Ogun Digital Summit' className='h-8 w-auto' />
          <p className='mt-6 text-xs font-semibold uppercase text-ods-green'>{pass.ticketName}</p>
          <h2 className='mt-2 text-2xl font-bold'>{pass.name}</h2>
          <p className='mt-2 break-all text-sm text-slate-500'>{pass.email}</p>

          <dl className='mt-6 grid gap-3 text-sm sm:grid-cols-2'>
            <div>
              <dt className='text-xs uppercase text-slate-400'>Date</dt>
              <dd className='mt-1 font-semibold'>26 November 2026</dd>
            </div>
            <div>
              <dt className='text-xs uppercase text-slate-400'>Venue</dt>
              <dd className='mt-1 font-semibold'>June 12 Cultural Centre</dd>
            </div>
          </dl>
        </div>

        <div className='border border-slate-200 p-4 text-center'>
          <QRCodeSVG
            value={qrValue}
            size={136}
            level='H'
            marginSize={2}
            title={`Check-in QR code for ${pass.name}`}
            className='mx-auto h-auto max-w-full'
          />
          <p className='mt-3 break-all font-mono text-xs font-bold'>{pass.id}</p>
          <p className='mt-1 text-[11px] text-slate-400'>Scan at check-in</p>
        </div>
      </div>
    </article>
  );
}

function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <label className='block'>
      <span className='text-sm font-medium text-slate-700'>
        {required && <span className='text-ods-green'>*</span>} {label}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={label}
        className='mt-2 h-12 w-full border border-slate-300 bg-white px-4 text-base transition focus:border-ods-green'
      />
    </label>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
  required = false
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: FieldChange) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className='block'>
      <span className='text-sm font-medium text-slate-700'>
        {required && <span className='text-ods-green'>*</span>} {label}
      </span>
      <CustomSelect
        value={value}
        onValueChange={(selectedValue) => onChange({ target: { name, value: selectedValue } })}
      >
        <SelectTrigger className='mt-2 h-12 rounded-none border-slate-300 px-4'>
          <SelectValue placeholder='Select an option' />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={`${option}-${index}`} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </CustomSelect>
    </label>
  );
}

function RadioGroup({
  label,
  name,
  value,
  onChange,
  options,
  required = false
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <fieldset>
      <legend className='text-sm font-medium leading-6 text-slate-700'>
        {required && <span className='text-ods-green'>*</span>} {label}
      </legend>
      <div className='mt-3 flex flex-wrap gap-2'>
        {options.map((option, index) => (
          <label
            key={`${option}-${index}`}
            className={`flex cursor-pointer items-center gap-2 rounded border px-3 py-2 text-sm transition ${
              value === option
                ? 'border-ods-green bg-emerald-50 text-ods-green'
                : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
            }`}
          >
            <input
              type='radio'
              name={name}
              value={option}
              checked={value === option}
              onChange={onChange}
              required={required}
              className='h-4 w-4 accent-ods-green'
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function SummaryRow({
  label,
  value,
  compact = false
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between gap-6 ${compact ? 'text-sm' : 'text-base'}`}>
      <span>{label}</span>
      <span className='whitespace-nowrap font-semibold text-slate-700'>{value}</span>
    </div>
  );
}
