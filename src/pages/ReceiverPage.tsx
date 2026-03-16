import { useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { SIGNAL_MAP } from '@/lib/signals';
import { SignalType } from '@/components/SignalSelection';
import { Cloud, Sun } from 'lucide-react';

interface SignalRow {
  id: string;
  type: SignalType;
  sender_id: string;
  sent_at: string;
  latitude: number | null;
  longitude: number | null;
  acknowledged_at: string | null;
}

interface ReceiverPageProps {
  user: User;
}

const ReceiverPage = ({ user }: ReceiverPageProps) => {
  const [activeSignal, setActiveSignal] = useState<SignalRow | null>(null);
  const [listening, setListening] = useState(true);

  // Fetch any unacknowledged signals already in the DB for contacts of this user
  const fetchPendingSignals = useCallback(async () => {
    const { data } = await supabase
      .from('signals')
      .select('*')
      .is('acknowledged_at', null)
      .order('sent_at', { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      setActiveSignal(data[0] as SignalRow);
    }
  }, []);

  useEffect(() => {
    fetchPendingSignals();

    // Subscribe to new signals in realtime
    const channel = supabase
      .channel('receiver-signals')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'signals',
        },
        (payload) => {
          const newSignal = payload.new as SignalRow;
          setActiveSignal(newSignal);
          if (navigator.vibrate) {
            const config = SIGNAL_MAP[newSignal.type];
            navigator.vibrate(config.vibrationPattern);
            if (newSignal.type === 'danger') {
              const interval = setInterval(() => {
                navigator.vibrate(config.vibrationPattern);
              }, 2000);
              setTimeout(() => clearInterval(interval), 30000);
            }
          }
        }
      )
      .subscribe((status) => {
        setListening(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id, fetchPendingSignals]);

  const handleAcknowledge = async () => {
    if (!activeSignal) return;

    await supabase
      .from('signals')
      .update({ acknowledged_at: new Date().toISOString() })
      .eq('id', activeSignal.id);

    setActiveSignal(null);
  };

  const config = activeSignal ? SIGNAL_MAP[activeSignal.type] : null;

  if (activeSignal && config) {
    return (
      <div
        className={`
          min-h-screen 
          ${config.bgClass} 
          flex flex-col items-center justify-center
          animate-color-wash
          cursor-pointer
        `}
        onClick={handleAcknowledge}
        role="button"
        aria-label="Tap to acknowledge alert"
      >
        <div className="animate-breathing">
          <span className="text-[140px] select-none animate-emoji-pulse drop-shadow-2xl">
            {config.emoji}
          </span>
        </div>

        <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-center space-y-1">
          <p className="text-white text-xl font-semibold">{config.label} signal received</p>
          <p className="text-white/70 text-sm">
            {new Date(activeSignal.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          {activeSignal.latitude && activeSignal.longitude && (
            <a
              href={`https://maps.google.com/?q=${activeSignal.latitude},${activeSignal.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="block text-white underline text-sm mt-1"
            >
              View location on map
            </a>
          )}
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-72 h-72 rounded-full border-2 border-white/20 animate-breathing" style={{ animationDelay: '0s' }} />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-white/10 animate-breathing" style={{ animationDelay: '0.5s' }} />
          <div className="absolute w-[550px] h-[550px] rounded-full border border-white/5 animate-breathing" style={{ animationDelay: '1s' }} />
        </div>

        <div className="absolute bottom-12 text-white/40 text-sm animate-soft-pulse">
          Tap anywhere to acknowledge
        </div>
      </div>
    );
  }

  // Idle state — waiting for signals
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center animate-soft-pulse">
          <Sun className="w-10 h-10 text-primary" />
        </div>
        <Cloud className="absolute -right-2 top-2 w-7 h-7 text-muted-foreground/60" />
      </div>

      <div className="text-center space-y-2">
        <p className="text-foreground font-medium">Receiver active</p>
        <p className="text-sm text-muted-foreground">
          {listening ? '● Listening for alerts…' : '○ Connecting…'}
        </p>
      </div>

      <button
        onClick={() => supabase.auth.signOut()}
        className="text-sm text-muted-foreground/50 underline"
      >
        Sign out
      </button>
    </div>
  );
};

export default ReceiverPage;
