export type Tone = {
  background: string;
  border: string;
  text: string;
};

export const colors = {
  background: '#F4F6FA',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF2F8',
  border: '#DCE3ED',
  borderStrong: '#C3CEDD',
  textPrimary: '#12203A',
  textSecondary: '#5A6B86',
  textMuted: '#8B9AB1',
  primary: '#2F5BEA',
  primaryDark: '#1E3FB0',
  primarySoft: '#E6ECFE',
  onPrimary: '#FFFFFF',
  danger: '#C2312B',
  dangerSoft: '#FBEAE9',
  overlay: 'rgba(18, 32, 58, 0.45)',
} as const;

const neutralTone: Tone = {
  background: colors.surfaceMuted,
  border: colors.border,
  text: colors.textSecondary,
};

const priorityTones: Record<string, Tone> = {
  HIGH: { background: '#FBE9E7', border: '#F3C2BC', text: '#A32A22' },
  MEDIUM: { background: '#FDF2DC', border: '#EFD6A2', text: '#8A5A08' },
  LOW: { background: '#E6F4EC', border: '#B7DEC7', text: '#1F6B42' },
};

const statusTones: Record<string, Tone> = {
  PENDING: { background: '#EEF2F8', border: '#CFDAE9', text: '#42546F' },
  IN_PROGRESS: { background: '#E6ECFE', border: '#C0CDFA', text: '#22409C' },
  COMPLETED: { background: '#E9F1E9', border: '#C4DCC4', text: '#2C6134' },
};

export const priorityTone = (code: string): Tone => priorityTones[code] ?? neutralTone;

export const statusTone = (code: string): Tone => statusTones[code] ?? neutralTone;
