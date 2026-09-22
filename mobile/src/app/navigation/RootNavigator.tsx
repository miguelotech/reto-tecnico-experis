import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskDetailScreen } from '../../features/tasks/screens/TaskDetailScreen';
import { TaskFilterScreen } from '../../features/tasks/screens/TaskFilterScreen';
import { TaskListScreen } from '../../features/tasks/screens/TaskListScreen';
import { colors, typography } from '../../shared/theme';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
  },
};

export const RootNavigator = () => (
  <NavigationContainer theme={navigationTheme}>
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { ...typography.heading, color: colors.textPrimary },
        headerTintColor: colors.primary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Mis tareas' }} />
      <Stack.Screen
        name="TaskFilter"
        component={TaskFilterScreen}
        options={{ title: 'Filtros', presentation: 'modal' }}
      />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Detalle' }} />
    </Stack.Navigator>
  </NavigationContainer>
);
