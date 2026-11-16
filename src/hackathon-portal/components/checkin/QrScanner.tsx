import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
  type CameraDevice,
  type Html5QrcodeCameraScanConfig
} from 'html5-qrcode';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';
import { Button, Select } from '../ui';

const ELEMENT_ID = 'qr-reader';

function describeCameraError(err: unknown) {
  const s = String((err as Error)?.message || err || '');
  if (!window.isSecureContext)
    return 'Camera access requires HTTPS. Open this page over https:// (or localhost).';
  if (/NotAllowed|Permission|denied/i.test(s))
    return 'Camera permission was denied. Allow camera access for this site in your browser settings, then tap "Start camera". You can still use manual lookup.';
  if (/NotFound|no camera|Requested device not found|DevicesNotFound|OverconstrainedError/i.test(s))
    return 'No usable camera was found on this device. Use manual lookup or a hardware scanner.';
  if (/NotReadable|TrackStart|in use/i.test(s))
    return 'The camera is in use by another app or tab. Close it and try again.';
  return `Could not start the camera: ${s || 'unknown error'}`;
}

/**
 * Camera QR scanner. Calls onScan(text) for each decode; the parent controls pausing via `paused`.
 */
interface Props {
  onScan: (text: string) => void;
  paused?: boolean;
}

type ScanState = 'idle' | 'starting' | 'running' | 'error';

export default function QrScanner({ onScan, paused }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const startingRef = useRef<Promise<void>>(Promise.resolve());
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [cameraId, setCameraId] = useState(() => {
    try {
      return localStorage.getItem('portal.cameraId') || '';
    } catch {
      return '';
    }
  });
  const [state, setState] = useState<ScanState>('idle');
  const [error, setError] = useState('');

  const stop = useCallback(async () => {
    const s = scannerRef.current;
    scannerRef.current = null;
    if (!s) return;
    try {
      if (s.isScanning) await s.stop();
    } catch {
      /* ignore */
    }
    try {
      s.clear();
    } catch {
      /* ignore */
    }
  }, []);

  const start = useCallback(
    (id: string) => {
      // serialise start/stop so StrictMode double-mounts and camera switches don't collide
      startingRef.current = startingRef.current.then(async () => {
        await stop();
        setState('starting');
        setError('');
        try {
          if (!window.isSecureContext) throw new Error('insecure context');
          const s = new Html5Qrcode(ELEMENT_ID, {
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
            verbose: false
          });
          scannerRef.current = s;
          const config: Html5QrcodeCameraScanConfig = {
            fps: 12,
            qrbox: (w: number, h: number) => {
              const m = Math.floor(Math.min(w, h) * 0.72);
              return { width: m, height: m };
            },
            aspectRatio: 1
          };
          await s.start(
            id ? { deviceId: { exact: id } } : { facingMode: 'environment' },
            config,
            (text) => onScanRef.current?.(text),
            () => {}
          );
          setState('running');
          Html5Qrcode.getCameras()
            .then(setCameras)
            .catch(() => {});
        } catch (err) {
          await stop();
          setState('error');
          setError(describeCameraError(err));
        }
      });
      return startingRef.current;
    },
    [stop]
  );

  useEffect(() => {
    start(cameraId);
    return () => {
      startingRef.current = startingRef.current.then(stop);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const s = scannerRef.current;
    if (!s || state !== 'running') return;
    try {
      if (paused) s.pause(true);
      else s.resume();
    } catch {
      /* already in that state */
    }
  }, [paused, state]);

  return (
    <div>
      <div className='relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-[#101612]'>
        <div id={ELEMENT_ID} className='size-full' />
        {state !== 'running' && (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-[#EAECF0]'>
            {state === 'error' ? (
              <CameraOff className='size-10 text-red-400' />
            ) : (
              <Camera className='size-10 animate-pulse text-[#99DBB9]' />
            )}
            <p className='text-sm'>
              {state === 'error'
                ? error
                : state === 'starting'
                  ? 'Starting camera… allow camera access if prompted.'
                  : 'Camera is off'}
            </p>
            {state !== 'starting' && (
              <Button
                variant='secondary'
                size='sm'
                icon={RefreshCw}
                onClick={() => start(cameraId)}
              >
                Start camera
              </Button>
            )}
          </div>
        )}
        {state === 'running' && paused && (
          <div className='pointer-events-none absolute inset-0 bg-[#101828]/50' />
        )}
      </div>
      {cameras.length > 1 && (
        <div className='mx-auto mt-2 max-w-md'>
          <Select
            value={cameraId}
            onChange={(e) => {
              const id = e.target.value;
              setCameraId(id);
              try {
                localStorage.setItem('portal.cameraId', id);
              } catch {
                /* ignore */
              }
              start(id);
            }}
            options={[
              { value: '', label: 'Rear camera (default)' },
              ...cameras.map((c) => ({ value: c.id, label: c.label || c.id }))
            ]}
          />
        </div>
      )}
    </div>
  );
}
