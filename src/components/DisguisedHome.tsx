import { useState, useEffect, useRef, useCallback } from "react";
import { Cloud, Sun, Droplets, Wind, MapPin, Loader } from "lucide-react";

interface DisguisedHomeProps {
  onActivateSignal: () => void;
}

interface WeatherData {
  temp: number;
  high: number;
  low: number;
  description: string;
  humidity: number;
  windKph: number;
  uvIndex: number;
  city: string;
  isDay: boolean;
}

const LONG_PRESS_DURATION = 800;
const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;

const DisguisedHome = ({ onActivateSignal }: DisguisedHomeProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPressed, setIsPressed] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real weather via wttr.in
  useEffect(() => {
    const fetchWeather = async (lat?: number, lon?: number) => {
      try {
        const query = lat && lon ? `${lat},${lon}` : 'auto';
        const res = await fetch(`https://wttr.in/${query}?format=j1`);
        if (!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();

        const current = data.current_condition[0];
        const today = data.weather[0];
        const area = data.nearest_area[0];
        const cityName =
          area.areaName?.[0]?.value ||
          area.region?.[0]?.value ||
          area.country?.[0]?.value ||
          'Your location';

        setWeather({
          temp: Math.round(Number(current.temp_F)),
          high: Math.round(Number(today.maxtempF)),
          low: Math.round(Number(today.mintempF)),
          description: current.weatherDesc?.[0]?.value ?? 'Clear',
          humidity: Number(current.humidity),
          windKph: Math.round(Number(current.windspeedKmph) * 0.621),
          uvIndex: Number(current.uvIndex),
          city: cityName,
          isDay: Number(current.isdaytime) === 1,
        });
      } catch {
        // Silently fall back to minimal placeholder
        setWeather(null);
      } finally {
        setWeatherLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(), // permission denied → use IP-based lookup
        { timeout: 5000 }
      );
    } else {
      fetchWeather();
    }
  }, []);

  const handlePressStart = useCallback(() => {
    setIsPressed(true);
    longPressTimeoutRef.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(50);
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

  useEffect(() => {
    return () => {
      if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
    };
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  // Touch vs mouse handlers — avoid double-firing on touch devices
  const pressHandlers = isTouchDevice
    ? {
        onTouchStart: handlePressStart,
        onTouchEnd: handlePressEnd,
        onTouchCancel: handlePressEnd,
      }
    : {
        onMouseDown: handlePressStart,
        onMouseUp: handlePressEnd,
        onMouseLeave: handlePressEnd,
      };

  const temp = weather ? `${weather.temp}°` : weatherLoading ? '—' : '--°';
  const condition = weather?.description ?? (weatherLoading ? 'Loading…' : 'Partly Cloudy');
  const cityName = weather?.city ?? 'Your Location';

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 select-none" {...pressHandlers}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{cityName}</span>
        </div>
        <div className="text-sm text-muted-foreground">{formatTime(currentTime)}</div>
      </div>

      {/* Main weather display */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-16">
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center animate-soft-pulse">
            {weatherLoading
              ? <Loader className="w-10 h-10 text-primary/50 animate-spin" />
              : <Sun className="w-16 h-16 text-primary" />}
          </div>
          <Cloud className="absolute -right-2 top-4 w-10 h-10 text-muted-foreground/60" />
        </div>

        <div className="text-7xl font-extralight text-foreground mb-2">{temp}</div>
        <div className="text-lg text-muted-foreground mb-1">{condition}</div>
        <div className="text-sm text-muted-foreground/70">{formatDate(currentTime)}</div>

        {weather && (
          <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
            <span>H: {weather.high}°</span>
            <span>L: {weather.low}°</span>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mt-auto">
        <div className="bg-card rounded-2xl p-4 flex flex-col items-center">
          <Droplets className="w-5 h-5 text-primary/70 mb-2" />
          <span className="text-lg font-light text-foreground">
            {weather ? `${weather.humidity}%` : '—'}
          </span>
          <span className="text-xs text-muted-foreground">Humidity</span>
        </div>
        <div className="bg-card rounded-2xl p-4 flex flex-col items-center">
          <Wind className="w-5 h-5 text-primary/70 mb-2" />
          <span className="text-lg font-light text-foreground">
            {weather ? `${weather.windKph} mph` : '—'}
          </span>
          <span className="text-xs text-muted-foreground">Wind</span>
        </div>
        <div className="bg-card rounded-2xl p-4 flex flex-col items-center">
          <Sun className="w-5 h-5 text-primary/70 mb-2" />
          <span className="text-lg font-light text-foreground">
            {weather ? `${weather.uvIndex}` : '—'}
          </span>
          <span className="text-xs text-muted-foreground">UV Index</span>
        </div>
      </div>

      {isPressed && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 opacity-30 text-xs text-muted-foreground">
          Hold…
        </div>
      )}
    </div>
  );
};

export default DisguisedHome;
