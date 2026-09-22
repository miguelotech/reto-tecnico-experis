import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { AppError } from '../http';
import { Button } from './Button';

type ErrorStateProps = {
  error: AppError;
  onRetry?: () => void;
};

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <View style={styles.container}>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>Algo salió mal</Text>
    </View>
    <Text style={styles.title}>{error.title}</Text>
    <Text style={styles.message}>{error.message}</Text>
    {onRetry ? <Button label="Reintentar" onPress={onRetry} style={styles.action} /> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  badge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.dangerSoft,
  },
  badgeText: {
    ...typography.overline,
    color: colors.danger,
    textTransform: 'uppercase',
  },
  title: {
    ...typography.heading,
    marginTop: spacing.md,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    marginTop: spacing.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.lg,
    minWidth: 180,
  },
});
