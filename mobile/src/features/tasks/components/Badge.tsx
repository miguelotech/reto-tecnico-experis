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
    <View style={[styles.dot, { backgroundColor: tone.accent }]} />
    <Text style={[styles.label, { color: tone.text }]} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs + 1,
    paddingHorizontal: spacing.sm + spacing.xs / 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    marginRight: spacing.xs + 2,
  },
  label: {
    ...typography.captionStrong,
  },
});
