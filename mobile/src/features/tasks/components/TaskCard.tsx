import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, elevation, priorityTone, radius, spacing, typography } from '../../../shared/theme';
import { TaskSummary } from '../types/task.types';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';

type TaskCardProps = {
  task: TaskSummary;
  onPress: (task: TaskSummary) => void;
};

export const TaskCard = ({ task, onPress }: TaskCardProps) => {
  const accent = priorityTone(task.priority.code).accent;

  return (
    <Pressable
      testID={`task-card-${task.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${task.title}. Prioridad ${task.priority.name}. Estado ${task.status.name}.`}
      onPress={() => onPress(task)}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {task.title}
          </Text>
          <Text style={styles.chevron}>›</Text>
        </View>
        <Text
          style={[styles.description, !task.description ? styles.descriptionEmpty : null]}
          numberOfLines={2}
        >
          {task.description ?? 'Sin descripción'}
        </Text>
        <View style={styles.badges}>
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...elevation.card,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
    transform: [{ scale: 0.99 }],
  },
  accent: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  title: {
    ...typography.cardTitle,
    flex: 1,
    color: colors.textPrimary,
  },
  chevron: {
    fontSize: 22,
    lineHeight: 24,
    color: colors.textMuted,
  },
  description: {
    ...typography.body,
    marginTop: spacing.xs + 2,
    color: colors.textSecondary,
  },
  descriptionEmpty: {
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
