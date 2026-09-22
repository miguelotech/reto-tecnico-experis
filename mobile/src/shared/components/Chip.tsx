import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing, typography, Tone } from '../theme';

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
  const selectedColor = tone?.solid ?? colors.primary;

  const chipStyle = selected
    ? { backgroundColor: selectedColor, borderColor: selectedColor }
    : tone
    ? { backgroundColor: tone.soft, borderColor: tone.border }
    : { backgroundColor: colors.surface, borderColor: colors.border };

  const labelColor = selected ? colors.onPrimary : tone ? tone.text : colors.textSecondary;

  const content = (
    <View style={[styles.chip, chipStyle]}>
      {!selected && tone ? <View style={[styles.dot, { backgroundColor: tone.solid }]} /> : null}
      {selected ? <Text style={styles.check}>✓</Text> : null}
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
    minHeight: 42,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    marginRight: spacing.xs + 2,
  },
  check: {
    ...typography.captionStrong,
    color: colors.onPrimary,
    marginRight: spacing.xs + 2,
  },
  label: {
    ...typography.captionStrong,
  },
  remove: {
    marginLeft: spacing.xs + 2,
  },
  removeIcon: {
    fontFamily: fonts.medium,
    fontSize: 18,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.75,
  },
});
