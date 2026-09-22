import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Chip } from '../../../shared/components';
import { colors, priorityTone, spacing, statusTone, typography } from '../../../shared/theme';
import { CatalogItem, TaskFilters } from '../types/task.types';

type ActiveFiltersBarProps = {
  filters: TaskFilters;
  statuses: CatalogItem[];
  priorities: CatalogItem[];
  onRemoveStatus: () => void;
  onRemovePriority: () => void;
};

const labelFor = (catalog: CatalogItem[], code: string): string =>
  catalog.find(item => item.code === code)?.name ?? code;

export const ActiveFiltersBar = ({
  filters,
  statuses,
  priorities,
  onRemoveStatus,
  onRemovePriority,
}: ActiveFiltersBarProps) => {
  if (!filters.status && !filters.priority) {
    return null;
  }

  return (
    <View style={styles.container} testID="active-filters-bar">
      <Text style={styles.label}>Filtros activos</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.md,
  },
  label: {
    ...typography.overline,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
