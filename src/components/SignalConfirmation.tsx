import { useState, useEffect, useCallback } from 'react';
import { SignalType } from './SignalSelection';
import { SIGNAL_MAP } from '@/lib/signals';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface SignalConfirmationProps {
  signal: SignalType;
  user: User;
  onComplete: () => void;
  onCancel: () => void;
}

const SignalConfirmation = ({ signal, user, onComplete, onCancel }: SignalConfirmationProps) => {
  const config = SIGNAL_MAP[signal];
  const [status, setStatus] = useState<'sending' | 'sent' | 'error'>('sending');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sendSignal = useCallback(async () => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    // Try to get geolocation
    let latitude: number | null = null;
    let longitude: number | null = null;

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 });
      });
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    } catch {
      // Geolocation not available or denied — still send the signal
    }

    const { error } = await supabase.from('signals').insert({
      sender_id: user.id,
      type: signal,
      latitude,
      longitude,
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
    } else {
      setStatus('sent');
      setTimeout(() => onComplete(), 1500);
    }
  }, [signal, user.id, onComplete]);

  useEffect(() => {
    sendSignal();
  }, [sendSignal]);

  return (
    <div
      className={`
        min-h-screen 
        ${config.bgClass} 
        flex flex-col items-center justify-center
        animate-color-wash
        relative
      `}
    >
      {/* Cancel button */}
      <button
        id="cancel-signal-button"
        onClick={onCancel}
        aria-label="Cancel signal"
        className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white rounded-full px-4 py-2 text-sm font-medium active:opacity-75 transition-opacity"
      >
        Cancel
      </button>

      <div className={status === 'sending' ? 'animate-breathing' : ''}>
        <span className="text-[120px] select-none animate-emoji-pulse">
          {config.emoji}
        </span>
      </div>

      <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
        {status === 'sending' && (
          <p className="text-white text-lg font-medium">Sending alert…</p>
        )}
        {status === 'sent' && (
          <p className="text-white text-lg font-medium">Your alert has been sent ✓</p>
        )}
        {status === 'error' && (
          <div className="text-center space-y-2">
            <p className="text-white text-sm">Failed to send: {errorMsg}</p>
            <button
              onClick={sendSignal}
              className="text-white underline text-sm"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Ripple rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div
          className="w-64 h-64 rounded-full border border-white/10 animate-breathing"
          style={{ animationDelay: '0.5s' }}
        />
        <div
          className="absolute w-96 h-96 rounded-full border border-white/5 animate-breathing"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full border border-white/5 animate-breathing"
          style={{ animationDelay: '1.5s' }}
        />
      </div>
    </div>
  );
};

export default SignalConfirmation;
