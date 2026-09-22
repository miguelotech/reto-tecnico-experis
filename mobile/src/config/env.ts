import { Platform } from 'react-native';

const ANDROID_EMULATOR_HOST = 'http://10.0.2.2:5080';
const IOS_SIMULATOR_HOST = 'http://localhost:5080';

export const env = {
  apiBaseUrl: Platform.select({
    android: ANDROID_EMULATOR_HOST,
    default: IOS_SIMULATOR_HOST,
  }),
  requestTimeoutMs: 10_000,
} as const;
