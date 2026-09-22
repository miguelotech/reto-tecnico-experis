import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Chip } from '../../../shared/components';
import { colors, priorityTone, radius, spacing, statusTone, typography } from '../../../shared/theme';
import { CatalogItem, TaskFilters } from '../types/task.types';

type ListHeroProps = {
  count: number;
  filters: TaskFilters;
  statuses: CatalogItem[];
  priorities: CatalogItem[];
  activeCount: number;
  onOpenFilters: () => void;
  onRemoveStatus: () => void;
  onRemovePriority: () => void;
};

const labelFor = (catalog: CatalogItem[], code: string): string =>
  catalog.find(item => item.code === code)?.name ?? code;

export const ListHero = ({
  count,
  filters,
  statuses,
  priorities,
  activeCount,
  onOpenFilters,
  onRemoveStatus,
  onRemovePriority,
}: ListHeroProps) => {
  const filtered = activeCount > 0;
  const noun = count === 1 ? 'tarea' : 'tareas';

  return (
    <View style={styles.hero}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Mis tareas</Text>
        <Pressable
          testID="open-filters-button"
          accessibilityRole="button"
          accessibilityLabel={filtered ? `Filtros, ${activeCount} activos` : 'Filtros'}
          onPress={onOpenFilters}
          style={({ pressed }) => [styles.filterButton, pressed ? styles.pressed : null]}
        >
          <Text style={styles.filterLabel}>Filtros</Text>
          {filtered ? (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeLabel}>{activeCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <View style={styles.countRow}>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.countLabel}>{filtered ? `${noun} filtradas` : `${noun} en total`}</Text>
      </View>

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
  hero: {
    backgroundColor: colors.ink,
    borderRadius: radius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: {
    ...typography.display,
    color: colors.onInk,
    flexShrink: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    minHeight: 40,
    paddingHorizontal: spacing.md + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.onInk,
  },
  pressed: {
    opacity: 0.75,
  },
  filterLabel: {
    ...typography.captionStrong,
    color: colors.ink,
  },
  filterBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeLabel: {
    ...typography.overline,
    color: colors.onPrimary,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  count: {
    ...typography.count,
    color: colors.onInk,
  },
  countLabel: {
    ...typography.body,
    color: colors.inkMuted,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
