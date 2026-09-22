import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography, Tone } from '../theme';

type ChipProps = {
  label: string;
  selected?: boolean;
  tone?: Tone;
  onPress?: () => void;
  onRemove?: () => void;
  removeAccessibilityLabel?: string;
  testID?: string;
};

export const Chip = ({
  label,
  selected = false,
  tone,
  onPress,
  onRemove,
  removeAccessibilityLabel,
  testID,
}: ChipProps) => {
  const toneStyle = tone
    ? { backgroundColor: tone.background, borderColor: tone.border }
    : selected
    ? { backgroundColor: colors.primarySoft, borderColor: colors.primary }
    : { backgroundColor: colors.surface, borderColor: colors.border };

  const labelColor = tone ? tone.text : selected ? colors.primaryDark : colors.textSecondary;

  const content = (
    <View style={[styles.chip, toneStyle]}>
      <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
        {label}
      </Text>
      {onRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={removeAccessibilityLabel ?? `Quitar ${label}`}
          onPress={onRemove}
          hitSlop={spacing.sm}
          style={styles.remove}
        >
          <Text style={[styles.removeIcon, { color: labelColor }]}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => (pressed ? styles.pressed : null)}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  label: {
    ...typography.caption,
  },
  remove: {
    marginLeft: spacing.xs,
  },
  removeIcon: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
