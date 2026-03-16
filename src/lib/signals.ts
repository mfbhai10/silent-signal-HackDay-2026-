import { SignalType } from '@/components/SignalSelection';

export interface SignalConfig {
  type: SignalType;
  emoji: string;
  bgClass: string;
  hoverClass: string;
  vibrationPattern: number[];
  ariaLabel: string;
  label: string;
}

export const SIGNALS: SignalConfig[] = [
  {
    type: 'danger',
    emoji: '🆘',
    bgClass: 'bg-signal-danger',
    hoverClass: 'hover:shadow-[0_0_60px_hsl(0,72%,50%,0.5)]',
    vibrationPattern: [200, 100, 200, 100, 200],
    ariaLabel: 'Send SOS – I am in immediate danger',
    label: 'Danger',
  },
  {
    type: 'scared',
    emoji: '😨',
    bgClass: 'bg-signal-fear',
    hoverClass: 'hover:shadow-[0_0_60px_hsl(210,80%,55%,0.5)]',
    vibrationPattern: [150, 100, 150],
    ariaLabel: 'Send fear signal – I feel threatened or scared',
    label: 'Scared',
  },
  {
    type: 'distress',
    emoji: '💔',
    bgClass: 'bg-signal-help',
    hoverClass: 'hover:shadow-[0_0_60px_hsl(45,95%,55%,0.5)]',
    vibrationPattern: [100, 80, 100, 80, 100],
    ariaLabel: 'Send distress signal – I need emotional help',
    label: 'Distress',
  },
  {
    type: 'safe',
    emoji: '❤️',
    bgClass: 'bg-signal-safe',
    hoverClass: 'hover:shadow-[0_0_60px_hsl(145,65%,45%,0.5)]',
    vibrationPattern: [100, 50, 100],
    ariaLabel: 'Send safe signal – I am now safe',
    label: 'Safe',
  },
];

export const SIGNAL_MAP = Object.fromEntries(
  SIGNALS.map((s) => [s.type, s])
) as Record<SignalType, SignalConfig>;
