import { useEffect } from 'react';
import { SignalType } from './SignalSelection';

interface SignalConfirmationProps {
  signal: SignalType;
  onComplete: () => void;
}

const signalConfig = {
  danger: { emoji: '🆘', bgClass: 'bg-signal-danger' },
  scared: { emoji: '😨', bgClass: 'bg-signal-fear' },
  distress: { emoji: '💔', bgClass: 'bg-signal-help' },
  safe: { emoji: '❤️', bgClass: 'bg-signal-safe' },
};

const SignalConfirmation = ({ signal, onComplete }: SignalConfirmationProps) => {
  const config = signalConfig[signal];

  useEffect(() => {

    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }


    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`
        min-h-screen 
        ${config.bgClass} 
        flex items-center justify-center
        animate-color-wash
      `}
    >
      <div className="animate-breathing">
        <span className="text-[120px] select-none animate-emoji-pulse">
          {config.emoji}
        </span>
      </div>

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
