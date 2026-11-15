import CheckInConsole from '../../components/checkin/CheckInConsole';
import { PageHeader } from '../../components/ui';

export default function CheckIn() {
  return (
    <div className='mx-auto max-w-3xl'>
      <PageHeader
        title='Check-in'
        description='Scan participant QR tickets or look them up manually. Every check-in is validated on the server.'
      />
      <CheckInConsole />
    </div>
  );
}
