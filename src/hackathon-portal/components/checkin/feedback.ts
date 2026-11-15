type Kind = 'ok' | 'warn' | 'err';

let ctx: AudioContext | undefined;
function tone(freq: number, ms: number, type: OscillatorType = 'sine') {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = ctx || new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + ms / 1000);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + ms / 1000);
  } catch {
    /* audio not available */
  }
}
export function feedback(kind: Kind | string, enabled = true) {
  if (!enabled) return;
  if (kind === 'ok') {
    tone(880, 120);
    setTimeout(() => tone(1320, 160), 130);
    navigator.vibrate?.(80);
  } else if (kind === 'warn') {
    tone(520, 250, 'triangle');
    navigator.vibrate?.([60, 60, 60]);
  } else {
    tone(220, 400, 'square');
    navigator.vibrate?.([200, 80, 200]);
  }
}
