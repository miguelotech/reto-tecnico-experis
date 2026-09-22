export type Tone = {
  background: string;
  border: string;
  text: string;
  accent: string;
};

export const colors = {
  background: '#F6F8FC',
  surface: '#FFFFFF',
  surfaceMuted: '#EFF3F9',
  border: '#E5EAF2',
  borderStrong: '#CBD5E3',
  textPrimary: '#0E1726',
  textSecondary: '#5A6A82',
  textMuted: '#93A1B5',
  primary: '#3A57E0',
  primaryDark: '#2440BE',
  primarySoft: '#EAEEFD',
  onPrimary: '#FFFFFF',
  danger: '#C43D34',
  dangerSoft: '#FCECEA',
  overlay: 'rgba(14, 23, 38, 0.45)',
} as const;

const neutralTone: Tone = {
  background: colors.surfaceMuted,
  border: colors.border,
  text: colors.textSecondary,
  accent: colors.textMuted,
};

const priorityTones: Record<string, Tone> = {
  HIGH: { background: '#FDEDEB', border: '#F6CFC9', text: '#A33A30', accent: '#DE5246' },
  MEDIUM: { background: '#FDF5E4', border: '#F0DDAF', text: '#8A5D0B', accent: '#E3A22B' },
  LOW: { background: '#EAF6EF', border: '#BFE0CC', text: '#1F6B42', accent: '#3EA46B' },
};

const statusTones: Record<string, Tone> = {
  PENDING: { background: '#F0F3F9', border: '#D5DEEB', text: '#4B5B74', accent: '#8494AC' },
  IN_PROGRESS: { background: '#E9EEFE', border: '#C6D2FA', text: '#2743A8', accent: '#3B63E8' },
  COMPLETED: { background: '#EAF6EF', border: '#BFE0CC', text: '#27613C', accent: '#3EA46B' },
};

export const priorityTone = (code: string): Tone => priorityTones[code] ?? neutralTone;

export const statusTone = (code: string): Tone => statusTones[code] ?? neutralTone;
