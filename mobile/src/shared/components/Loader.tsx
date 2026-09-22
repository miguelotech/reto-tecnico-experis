import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

type LoaderProps = {
  message?: string;
};

export const Loader = ({ message = 'Cargando…' }: LoaderProps) => (
  <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={message}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  message: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
});
