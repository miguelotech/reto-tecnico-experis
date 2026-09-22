import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/RootNavigator';
import { QueryProvider } from './providers/QueryProvider';

const App = () => (
  <SafeAreaProvider>
    <StatusBar barStyle="dark-content" />
    <QueryProvider>
      <RootNavigator />
    </QueryProvider>
  </SafeAreaProvider>
);

export default App;
