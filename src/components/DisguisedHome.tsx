import { useState, useEffect, useRef, useCallback } from "react";
import { Cloud, Sun, Droplets, Wind, MapPin } from "lucide-react";

interface DisguisedHomeProps {
  onActivateSignal: () => void;
}

const LONG_PRESS_DURATION = 800;

const DisguisedHome = ({ onActivateSignal }: DisguisedHomeProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPressed, setIsPressed] = useState(false);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handlePressStart = useCallback(() => {
    setIsPressed(true);
    longPressTimeoutRef.current = setTimeout(() => {
    
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      onActivateSignal();
      setIsPressed(false);
    }, LONG_PRESS_DURATION);
  }, [onActivateSignal]);

  const handlePressEnd = useCallback(() => {
    setIsPressed(false);
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col p-6 select-none"
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressEnd}
    >
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">San Francisco</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {formatTime(currentTime)}
        </div>
      </div>

      
      <div className="flex-1 flex flex-col items-center justify-center -mt-16">
        {/* Weather Icon */}
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center animate-soft-pulse">
            <Sun className="w-16 h-16 text-primary" />
          </div>
          <Cloud className="absolute -right-2 top-4 w-10 h-10 text-muted-foreground/60" />
        </div>


        <div className="text-7xl font-extralight text-foreground mb-2">68°</div>


        <div className="text-lg text-muted-foreground mb-1">Partly Cloudy</div>

        <div className="text-sm text-muted-foreground/70">
          {formatDate(currentTime)}
        </div>

       
        <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
          <span>H: 72°</span>
          <span>L: 54°</span>
        </div>
      </div>

      
      <div className="grid grid-cols-3 gap-4 mt-auto">
        <div className="bg-card rounded-2xl p-4 flex flex-col items-center">
          <Droplets className="w-5 h-5 text-primary/70 mb-2" />
          <span className="text-lg font-light text-foreground">62%</span>
          <span className="text-xs text-muted-foreground">Humidity</span>
        </div>
        <div className="bg-card rounded-2xl p-4 flex flex-col items-center">
          <Wind className="w-5 h-5 text-primary/70 mb-2" />
          <span className="text-lg font-light text-foreground">8 mph</span>
          <span className="text-xs text-muted-foreground">Wind</span>
        </div>
        <div className="bg-card rounded-2xl p-4 flex flex-col items-center">
          <Sun className="w-5 h-5 text-primary/70 mb-2" />
          <span className="text-lg font-light text-foreground">6</span>
          <span className="text-xs text-muted-foreground">UV Index</span>
        </div>
      </div>

     
      {isPressed && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 opacity-30 text-xs text-muted-foreground">
          Hold...
        </div>
      )}
    </div>
  );
};

export default DisguisedHome;
