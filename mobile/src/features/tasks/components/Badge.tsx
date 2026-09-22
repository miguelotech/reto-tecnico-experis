import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { radius, spacing, typography, Tone } from '../../../shared/theme';

type BadgeProps = {
  label: string;
  tone: Tone;
  accessibilityLabel?: string;
};

export const Badge = ({ label, tone, accessibilityLabel }: BadgeProps) => (
  <View
    accessible
    accessibilityLabel={accessibilityLabel ?? label}
    style={[styles.badge, { backgroundColor: tone.background, borderColor: tone.border }]}
  >
    <Text style={[styles.label, { color: tone.text }]} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + spacing.xs / 2,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  label: {
    ...typography.overline,
    textTransform: 'uppercase',
  },
});
