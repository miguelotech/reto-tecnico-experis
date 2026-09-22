import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography, Tone } from '../../../shared/theme';

type BadgeProps = {
  label: string;
  tone: Tone;
  variant?: 'solid' | 'outline';
  accessibilityLabel?: string;
};

export const Badge = ({ label, tone, variant = 'solid', accessibilityLabel }: BadgeProps) => {
  const isSolid = variant === 'solid';

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel ?? label}
      style={[
        styles.badge,
        isSolid
          ? { backgroundColor: tone.solid, borderColor: tone.solid }
          : { backgroundColor: colors.surface, borderColor: tone.border },
      ]}
    >
      {isSolid ? null : <View style={[styles.dot, { backgroundColor: tone.solid }]} />}
      <Text style={[styles.label, { color: isSolid ? colors.onPrimary : tone.text }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs + 1,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radius.sm,
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
