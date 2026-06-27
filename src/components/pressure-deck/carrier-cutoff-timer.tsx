'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

export function CarrierCutoffTimer({ minutes }: { minutes: number }) {
  const [remaining, setRemaining] = useState(minutes * 60);

  useEffect(() => {
    setRemaining(minutes * 60);
    const interval = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [minutes]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isCritical = mins < 30;
  const isUrgent = mins < 60 && !isCritical;

  return (
    <div className={cn(
      'flex items-center gap-2 rounded-md px-3 py-2 border font-mono',
      isCritical ? 'border-critical-red/50 bg-critical-red/10 glow-red' :
      isUrgent ? 'border-signal-amber/50 bg-signal-amber/10 glow-amber' :
      'border-border-line bg-deep-console',
    )}>
      <Clock className={cn('w-4 h-4', isCritical ? 'text-critical-red' : isUrgent ? 'text-signal-amber' : 'text-electric-blue')} />
      <span className={cn(
        'text-lg font-bold tabular-nums',
        isCritical ? 'text-critical-red' : isUrgent ? 'text-signal-amber' : 'text-text-primary',
      )}>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    </div>
  );
}
