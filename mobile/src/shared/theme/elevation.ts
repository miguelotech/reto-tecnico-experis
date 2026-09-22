import { ViewStyle } from 'react-native';

export const elevation = {
  card: {
    shadowColor: '#0E1726',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  bar: {
    shadowColor: '#0E1726',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
} satisfies Record<string, ViewStyle>;
