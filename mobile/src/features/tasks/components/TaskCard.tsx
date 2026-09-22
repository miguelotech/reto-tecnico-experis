import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, elevation, radius, spacing, typography } from '../../../shared/theme';
import { TaskSummary } from '../types/task.types';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';

type TaskCardProps = {
  task: TaskSummary;
  onPress: (task: TaskSummary) => void;
};

export const TaskCard = ({ task, onPress }: TaskCardProps) => (
  <Pressable
    testID={`task-card-${task.id}`}
    accessibilityRole="button"
    accessibilityLabel={`${task.title}. Prioridad ${task.priority.name}. Estado ${task.status.name}.`}
    onPress={() => onPress(task)}
    style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
  >
    <Text style={styles.title} numberOfLines={2}>
      {task.title}
    </Text>
    <Text style={[styles.description, !task.description ? styles.descriptionEmpty : null]} numberOfLines={2}>
      {task.description ?? 'Sin descripción'}
    </Text>
    <View style={styles.badges}>
      <PriorityBadge priority={task.priority} />
      <StatusBadge status={task.status} />
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...elevation.card,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  title: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  description: {
    ...typography.body,
    marginTop: spacing.xs,
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
