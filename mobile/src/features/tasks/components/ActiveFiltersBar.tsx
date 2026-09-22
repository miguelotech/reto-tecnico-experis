import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Chip } from '../../../shared/components';
import { colors, priorityTone, spacing, statusTone, typography } from '../../../shared/theme';
import { CatalogItem, TaskFilters } from '../types/task.types';

type ActiveFiltersBarProps = {
  filters: TaskFilters;
  statuses: CatalogItem[];
  priorities: CatalogItem[];
  resultCount: number;
  onRemoveStatus: () => void;
  onRemovePriority: () => void;
};

const labelFor = (catalog: CatalogItem[], code: string): string =>
  catalog.find(item => item.code === code)?.name ?? code;

const summaryFor = (count: number, filtered: boolean): string => {
  if (count === 0) {
    return filtered ? 'Sin resultados' : 'Sin tareas';
  }

  const noun = count === 1 ? 'tarea' : 'tareas';

  return filtered ? `${count} ${noun} filtradas` : `${count} ${noun}`;
};

export const ActiveFiltersBar = ({
  filters,
  statuses,
  priorities,
  resultCount,
  onRemoveStatus,
  onRemovePriority,
}: ActiveFiltersBarProps) => {
  const filtered = Boolean(filters.status || filters.priority);

  return (
    <View style={styles.container} testID="active-filters-bar">
      <Text style={styles.summary}>{summaryFor(resultCount, filtered)}</Text>
      {filtered ? (
        <View style={styles.chips}>
          {filters.status ? (
            <Chip
              label={labelFor(statuses, filters.status)}
              tone={statusTone(filters.status)}
              onRemove={onRemoveStatus}
              removeAccessibilityLabel="Quitar filtro de estado"
            />
          ) : null}
          {filters.priority ? (
            <Chip
              label={labelFor(priorities, filters.priority)}
              tone={priorityTone(filters.priority)}
              onRemove={onRemovePriority}
              removeAccessibilityLabel="Quitar filtro de prioridad"
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.lg,
  },
  summary: {
    ...typography.overline,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
