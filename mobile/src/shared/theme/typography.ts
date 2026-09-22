import { Platform, TextStyle } from 'react-native';

const displayFamily = Platform.select({ ios: 'Georgia', default: 'serif' });

export const typography = {
  display: {
    fontFamily: displayFamily,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  displaySmall: {
    fontFamily: displayFamily,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  count: { fontSize: 34, lineHeight: 38, fontWeight: '800', letterSpacing: -1 },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '700', letterSpacing: -0.2 },
  cardTitle: { fontSize: 16, lineHeight: 22, fontWeight: '600', letterSpacing: -0.2 },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
  captionStrong: { fontSize: 13, lineHeight: 18, fontWeight: '700' },
  overline: { fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 1 },
} satisfies Record<string, TextStyle>;
