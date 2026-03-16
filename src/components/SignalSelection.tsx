import { useEffect } from 'react';
import { SIGNALS } from '@/lib/signals';

export type SignalType = 'danger' | 'scared' | 'distress' | 'safe';

interface SignalSelectionProps {
  onSelectSignal: (signal: SignalType) => void;
  onBack: () => void;
}

const SignalSelection = ({ onSelectSignal, onBack }: SignalSelectionProps) => {
  useEffect(() => {

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, []);

  const handleSignalSelect = (signal: SignalType) => {

    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
    onSelectSignal(signal);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 animate-fade-in-up">
      <button 
        onClick={onBack}
        className="self-start p-3 -ml-1 text-muted-foreground/50 text-2xl touch-target"
        aria-label="Back"
      >
        ←
      </button>

      <div className="flex-1 grid grid-cols-2 gap-4 py-8">
        {SIGNALS.map((signal, index) => (
          <button
            key={signal.type}
            onClick={() => handleSignalSelect(signal.type)}
            className={`
              ${signal.bgClass} 
              ${signal.hoverClass}
              rounded-3xl 
              flex items-center justify-center 
              touch-target-xl
              transition-all duration-300 ease-out
              active:scale-95
              animate-fade-in-up
            `}
            style={{ 
              animationDelay: `${index * 0.05}s`,
              minHeight: '160px'
            }}
            aria-label={signal.ariaLabel}
          >
            <span 
              className="text-7xl select-none animate-soft-pulse"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {signal.emoji}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SignalSelection;
