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
    <View style={styles.badges}>
      <PriorityBadge priority={task.priority} />
      <StatusBadge status={task.status} />
    </View>
    <Text style={styles.title} numberOfLines={2}>
      {task.title}
    </Text>
    <Text
      style={[styles.description, !task.description ? styles.descriptionEmpty : null]}
      numberOfLines={2}
    >
      {task.description ?? 'Sin descripción'}
    </Text>
    <View style={styles.footer}>
      <Text style={styles.footerAction}>Ver detalle</Text>
      <Text style={styles.chevron}>›</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...elevation.card,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
    transform: [{ scale: 0.99 }],
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.cardTitle,
    color: colors.textPrimary,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerAction: {
    ...typography.overline,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  chevron: {
    fontSize: 22,
    lineHeight: 22,
    color: colors.primary,
  },
});
