import { useEffect } from 'react';

export type SignalType = 'danger' | 'scared' | 'distress' | 'safe';

interface Signal {
  type: SignalType;
  emoji: string;
  bgClass: string;
  hoverClass: string;
}

const signals: Signal[] = [
  { type: 'danger', emoji: '🆘', bgClass: 'bg-signal-danger', hoverClass: 'hover:shadow-[0_0_60px_hsl(0,72%,50%,0.5)]' },
  { type: 'scared', emoji: '😨', bgClass: 'bg-signal-fear', hoverClass: 'hover:shadow-[0_0_60px_hsl(210,80%,55%,0.5)]' },
  { type: 'distress', emoji: '💔', bgClass: 'bg-signal-help', hoverClass: 'hover:shadow-[0_0_60px_hsl(45,95%,55%,0.5)]' },
  { type: 'safe', emoji: '❤️', bgClass: 'bg-signal-safe', hoverClass: 'hover:shadow-[0_0_60px_hsl(145,65%,45%,0.5)]' },
];

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
        {signals.map((signal, index) => (
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
            aria-label={`Signal ${signal.type}`}
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
