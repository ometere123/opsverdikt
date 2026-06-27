export const colors = {
  floorBlack: '#06080B',
  darkGraphite: '#0B0F14',
  panelSteel: '#111827',
  deepConsole: '#10151F',
  borderLine: '#1F2937',
  mutedSteel: '#64748B',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  signalAmber: '#F5A524',
  electricBlue: '#38BDF8',
  criticalRed: '#EF4444',
  systemGreen: '#22C55E',
  fatigueViolet: '#8B5CF6',
  coldChainCyan: '#67E8F9',
  evidenceWhite: '#E5E7EB',
} as const;

export const glowMap = {
  amber: { color: colors.signalAmber, meaning: 'urgent pressure' },
  blue: { color: colors.electricBlue, meaning: 'live signal / Worker feed' },
  red: { color: colors.criticalRed, meaning: 'critical risk' },
  green: { color: colors.systemGreen, meaning: 'stable / resolved' },
  violet: { color: colors.fatigueViolet, meaning: 'fatigue or human constraint risk' },
  cyan: { color: colors.coldChainCyan, meaning: 'cold-chain signal' },
} as const;

export type GlowVariant = keyof typeof glowMap;
