import { TextStyle } from 'react-native';

export const fonts = {
  regular: 'DMSans-Regular',
  medium: 'DMSans-Medium',
  bold: 'DMSans-Bold',
} as const;

export const typography = {
  display: { fontFamily: fonts.bold, fontSize: 30, lineHeight: 36, letterSpacing: -1 },
  displaySmall: { fontFamily: fonts.bold, fontSize: 25, lineHeight: 31, letterSpacing: -0.7 },
  count: {
    fontFamily: fonts.bold,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -1.6,
    fontVariant: ['tabular-nums'] as const,
  },
  heading: { fontFamily: fonts.medium, fontSize: 18, lineHeight: 24, letterSpacing: -0.4 },
  cardTitle: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 23, letterSpacing: -0.3 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23, letterSpacing: -0.1 },
  bodyStrong: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 23, letterSpacing: -0.1 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  captionStrong: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, letterSpacing: -0.1 },
  overline: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 14, letterSpacing: 1.2 },
} satisfies Record<string, TextStyle>;
