import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../../app/navigation/types';
import { ErrorState, Loader, Screen } from '../../../shared/components';
import { colors, elevation, radius, spacing, typography } from '../../../shared/theme';
import { formatLongDate } from '../../../shared/utils';
import { PriorityBadge, StatusBadge } from '../components';
import { useTaskDetail } from '../hooks/useTaskDetail';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

type MetaRowProps = {
  label: string;
  value: string;
};

const MetaRow = ({ label, value }: MetaRowProps) => (
  <View style={styles.metaRow}>
    <Text style={styles.metaLabel}>{label}</Text>
    <Text style={styles.metaValue}>{value}</Text>
  </View>
);

export const TaskDetailScreen = ({ route }: Props) => {
  const { taskId } = route.params;
  const { data: task, isPending, error, refetch } = useTaskDetail(taskId);

  if (isPending) {
    return (
      <Screen>
        <Loader message="Cargando la tarea…" />
      </Screen>
    );
  }

  if (error || !task) {
    return (
      <Screen>
        <ErrorState
          error={
            error ?? {
              kind: 'unknown',
              title: 'No pudimos mostrar la tarea',
              message: 'Vuelve al listado e inténtalo nuevamente.',
              retryable: true,
            }
          }
          onRetry={refetch}
        />
      </Screen>
    );
  }

  const dueDate = formatLongDate(task.dueDate);
  const createdAt = formatLongDate(task.createdAt);

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.badges}>
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </View>
        <Text style={styles.title}>{task.title}</Text>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={[styles.description, !task.description ? styles.descriptionEmpty : null]}>
            {task.description ?? 'Esta tarea no tiene descripción.'}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Datos</Text>
          <MetaRow label="Prioridad" value={task.priority.name} />
          <MetaRow label="Estado" value={task.status.name} />
          <MetaRow label="Creada" value={createdAt ?? 'Sin registro'} />
          <MetaRow label="Vence" value={dueDate ?? 'Sin fecha de vencimiento'} />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...elevation.card,
  },
  sectionTitle: {
    ...typography.overline,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textPrimary,
  },
  descriptionEmpty: {
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  metaLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  metaValue: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    flexShrink: 1,
    textAlign: 'right',
  },
});
