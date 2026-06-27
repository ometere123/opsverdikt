'use client';

import { cn } from '@/lib/utils';
import type { GlowVariant } from '@/lib/theme';

const glowClasses: Record<GlowVariant, string> = {
  amber: 'glow-amber border-signal-amber/40',
  blue: 'glow-blue border-electric-blue/40',
  red: 'glow-red border-critical-red/40',
  green: 'glow-green border-system-green/40',
  violet: 'glow-violet border-fatigue-violet/40',
  cyan: 'glow-cyan border-cold-chain-cyan/40',
};

export function GlowAlertFrame({
  variant,
  active = true,
  className,
  children,
}: {
  variant: GlowVariant;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-panel-steel/80 p-4 transition-all duration-300',
        active ? glowClasses[variant] : 'border-border-line',
        className,
      )}
    >
      {children}
    </div>
  );
}
