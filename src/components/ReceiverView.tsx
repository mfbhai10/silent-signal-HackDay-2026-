import { useEffect } from "react";
import { SignalType } from "./SignalSelection";
import { SIGNAL_MAP } from "@/lib/signals";

interface ReceiverViewProps {
  signal: SignalType;
  onDismiss: () => void;
}

const ReceiverView = ({ signal, onDismiss }: ReceiverViewProps) => {
  const config = SIGNAL_MAP[signal];

  useEffect(() => {
    if (navigator.vibrate) {
      navigator.vibrate(config.vibrationPattern);

      if (signal === "danger") {
        const interval = setInterval(() => {
          navigator.vibrate(config.vibrationPattern);
        }, 2000);
        return () => clearInterval(interval);
      }
    }
  }, [signal, config.vibrationPattern]);

  return (
    <div
      className={`
        min-h-screen 
        ${config.bgClass} 
        flex flex-col items-center justify-center
        animate-color-wash
        cursor-pointer
      `}
      onClick={onDismiss}
      role="button"
      aria-label="Tap to dismiss alert"
    >
      <div className="animate-breathing">
        <span className="text-[140px] select-none animate-emoji-pulse drop-shadow-2xl">
          {config.emoji}
        </span>
      </div>

      <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
        <p className="text-white text-lg font-medium">Your alert has been sent</p>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div
          className="w-72 h-72 rounded-full border-2 border-white/20 animate-breathing"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full border border-white/10 animate-breathing"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute w-[550px] h-[550px] rounded-full border border-white/5 animate-breathing"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="absolute bottom-12 text-white/40 text-sm animate-soft-pulse">
        Tap anywhere to dismiss
      </div>
    </div>
  );
};

export default ReceiverView;
