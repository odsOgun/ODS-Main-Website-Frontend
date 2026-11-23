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
  if (/no-media-devices/.test(s))
    return 'This browser can’t open the camera. If you opened the link inside WhatsApp, Instagram or another app, open it in Safari or Chrome instead.';
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
          if (!navigator.mediaDevices?.getUserMedia) throw new Error('no-media-devices');
          // No aspectRatio: html5-qrcode applies it with track.applyConstraints() after the camera
          // opens, which on iPhone Safari can fail, black out the feed or flip to the front camera.
          const config: Html5QrcodeCameraScanConfig = {
            fps: 12,
            qrbox: (w: number, h: number) => {
              const m = Math.floor(Math.min(w, h) * 0.72);
              return { width: m, height: m };
            }
          };
          const onDecode = (text: string) => onScanRef.current?.(text);
          type Constraint = Parameters<Html5Qrcode['start']>[0];
          // Phones often ignore a soft facingMode hint and stored deviceIds go stale between
          // sessions, so try progressively looser ways of getting the rear camera.
          const attempts: (() => Promise<Constraint>)[] = [];
          if (id) attempts.push(async () => ({ deviceId: { exact: id } }));
          attempts.push(async () => ({ facingMode: { exact: 'environment' } }));
          attempts.push(async () => {
            const list = await Html5Qrcode.getCameras();
            const back = list.filter((c) => /back|rear|environment|trás|arrière/i.test(c.label));
            // iPhones list "Back Ultra Wide Camera" etc. too; those can't focus close enough for QR codes
            const rear =
              back.find((c) => !/ultra|wide|tele|dual|triple/i.test(c.label)) ||
              back[back.length - 1] ||
              (list.length > 1 ? list[list.length - 1] : undefined);
            if (!rear) throw new Error('No rear camera label found');
            return { deviceId: { exact: rear.id } };
          });
          attempts.push(async () => ({ facingMode: 'environment' }));

          let lastErr: unknown;
          let started = false;
          for (const attempt of attempts) {
            // a fresh instance per try, so a failed start can't leave the scanner mid-transition
            const s = new Html5Qrcode(ELEMENT_ID, {
              formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
              verbose: false
            });
            scannerRef.current = s;
            try {
              await s.start(await attempt(), config, onDecode, () => {});
              started = true;
              break;
            } catch (e) {
              lastErr = e;
              await stop();
              const el = document.getElementById(ELEMENT_ID);
              if (el) el.innerHTML = '';
              // permission denial won't be fixed by a different constraint
              if (/NotAllowed|Permission|denied/i.test(String((e as Error)?.message || e))) break;
            }
          }
          if (!started) {
            if (id) {
              try {
                localStorage.removeItem('portal.cameraId');
              } catch {
                /* ignore */
              }
            }
            throw lastErr;
          }
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
      {/* Square frame; the feed keeps the camera's own aspect ratio and is centred inside it
          (portrait phone feeds are cropped top and bottom). Stretching it with CSS would misalign
          html5-qrcode's scan box, which it maps onto the video by its on-screen size. */}
      <div className='relative mx-auto flex aspect-square w-full max-w-md items-center overflow-hidden rounded-2xl bg-[#101612]'>
        <div id={ELEMENT_ID} className='w-full' />
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
