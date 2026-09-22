import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../../app/navigation/types';
import { ErrorState, Loader, Screen } from '../../../shared/components';
import { colors, elevation, priorityTone, radius, spacing, typography } from '../../../shared/theme';
import { formatLongDate } from '../../../shared/utils';
import { StatusBadge } from '../components';
import { useTaskDetail } from '../hooks/useTaskDetail';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

type MetaRowProps = {
  label: string;
  value: string;
  last?: boolean;
};

const MetaRow = ({ label, value, last = false }: MetaRowProps) => (
  <View style={[styles.metaRow, last ? styles.metaRowLast : null]}>
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

  const tone = priorityTone(task.priority.code);
  const dueDate = formatLongDate(task.dueDate);
  const createdAt = formatLongDate(task.createdAt);

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: tone.solid }]}>
          <Text style={styles.heroLabel}>Prioridad {task.priority.name}</Text>
          <Text style={styles.heroTitle}>{task.title}</Text>
          <View style={styles.heroBadge}>
            <StatusBadge status={task.status} />
          </View>
        </View>

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
          <MetaRow label="Vence" value={dueDate ?? 'Sin fecha de vencimiento'} last />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  hero: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  heroLabel: {
    ...typography.overline,
    color: colors.onPrimary,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  heroTitle: {
    ...typography.displaySmall,
    color: colors.onPrimary,
    marginTop: spacing.sm,
  },
  heroBadge: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
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
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  metaRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
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
