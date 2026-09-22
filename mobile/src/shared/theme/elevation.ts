import { ViewStyle } from 'react-native';

export const elevation = {
  card: {
    shadowColor: '#12203A',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  bar: {
    shadowColor: '#12203A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
} satisfies Record<string, ViewStyle>;
