export type Tone = {
  solid: string;
  soft: string;
  border: string;
  text: string;
};

export const colors = {
  ink: '#151B3D',
  inkSoft: '#26305C',
  inkMuted: '#8E96BC',
  onInk: '#FFFFFF',
  background: '#F2F4F8',
  surface: '#FFFFFF',
  surfaceMuted: '#E9EDF4',
  border: '#DFE4EE',
  borderStrong: '#C3CBDB',
  textPrimary: '#151B3D',
  textSecondary: '#5A6484',
  textMuted: '#98A1B9',
  primary: '#2F6BFF',
  primaryDark: '#1B49C4',
  primarySoft: '#E6EDFF',
  onPrimary: '#FFFFFF',
  danger: '#C4362B',
  dangerSoft: '#FCEBE9',
} as const;

const neutralTone: Tone = {
  solid: colors.inkMuted,
  soft: colors.surfaceMuted,
  border: colors.border,
  text: colors.textSecondary,
};

const priorityTones: Record<string, Tone> = {
  HIGH: { solid: '#E4483C', soft: '#FDECEA', border: '#F4C6C1', text: '#9E2F25' },
  MEDIUM: { solid: '#E8A020', soft: '#FDF4E2', border: '#EFDCA9', text: '#8A5C05' },
  LOW: { solid: '#17A05E', soft: '#E7F6EE', border: '#B6E0C9', text: '#0F6B3F' },
};

const statusTones: Record<string, Tone> = {
  PENDING: { solid: '#6B7A99', soft: '#EFF2F8', border: '#D2DAE8', text: '#4A5877' },
  IN_PROGRESS: { solid: '#2F6BFF', soft: '#E6EDFF', border: '#C2D3FF', text: '#1B49C4' },
  COMPLETED: { solid: '#17A05E', soft: '#E7F6EE', border: '#B6E0C9', text: '#0F6B3F' },
};

export const priorityTone = (code: string): Tone => priorityTones[code] ?? neutralTone;

export const statusTone = (code: string): Tone => statusTones[code] ?? neutralTone;
