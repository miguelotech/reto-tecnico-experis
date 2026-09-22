import { ViewStyle } from 'react-native';

export const elevation = {
  card: {
    shadowColor: '#151B3D',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  bar: {
    shadowColor: '#151B3D',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -6 },
    elevation: 14,
  },
} satisfies Record<string, ViewStyle>;
