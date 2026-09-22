import React, { useCallback, useLayoutEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../../app/navigation/types';
import { EmptyState, ErrorState, Loader, Screen } from '../../../shared/components';
import { colors, radius, spacing, typography } from '../../../shared/theme';
import { ActiveFiltersBar, TaskCard } from '../components';
import { useCatalogs } from '../hooks/useCatalogs';
import { useTasks } from '../hooks/useTasks';
import { countActiveFilters, EMPTY_FILTERS, TaskFilters, TaskSummary } from '../types/task.types';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

type FiltersHeaderButtonProps = {
  activeCount: number;
  onPress: () => void;
};

const FiltersHeaderButton = ({ activeCount, onPress }: FiltersHeaderButtonProps) => (
  <Pressable
    testID="open-filters-button"
    accessibilityRole="button"
    accessibilityLabel={activeCount > 0 ? `Filtros, ${activeCount} activos` : 'Filtros'}
    onPress={onPress}
    style={({ pressed }) => [styles.headerButton, pressed ? styles.headerButtonPressed : null]}
  >
    <Text style={styles.headerButtonLabel}>Filtros</Text>
    {activeCount > 0 ? (
      <View style={styles.headerBadge}>
        <Text style={styles.headerBadgeLabel}>{activeCount}</Text>
      </View>
    ) : null}
  </Pressable>
);

const TaskSeparator = () => <View style={styles.separator} />;

export const TaskListScreen = ({ navigation, route }: Props) => {
  const filters = route.params?.filters ?? EMPTY_FILTERS;
  const activeCount = countActiveFilters(filters);

  const { data, isPending, isRefetching, error, refetch } = useTasks(filters);
  const { priorities, statuses } = useCatalogs();

  const applyFilters = useCallback(
    (next: TaskFilters) => {
      navigation.setParams({ filters: next });
    },
    [navigation],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <FiltersHeaderButton
          activeCount={activeCount}
          onPress={() => navigation.navigate('TaskFilter', { filters })}
        />
      ),
    });
  }, [activeCount, filters, navigation]);

  const openDetail = useCallback(
    (task: TaskSummary) => navigation.navigate('TaskDetail', { taskId: task.id }),
    [navigation],
  );

  if (isPending) {
    return (
      <Screen>
        <Loader message="Cargando tus tareas…" />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <ErrorState error={error} onRetry={refetch} />
      </Screen>
    );
  }

  const tasks = data ?? [];

  return (
    <Screen>
      <FlatList
        testID="task-list"
        data={tasks}
        keyExtractor={task => task.id}
        renderItem={({ item }) => <TaskCard task={item} onPress={openDetail} />}
        ListHeaderComponent={
          <ActiveFiltersBar
            filters={filters}
            statuses={statuses}
            priorities={priorities}
            onRemoveStatus={() => applyFilters({ ...filters, status: null })}
            onRemovePriority={() => applyFilters({ ...filters, priority: null })}
          />
        }
        ListEmptyComponent={
          activeCount > 0 ? (
            <EmptyState
              title="Ningún resultado con estos filtros"
              message="Prueba con otra combinación de estado y prioridad, o limpia los filtros para ver todas tus tareas."
              actionLabel="Limpiar filtros"
              onAction={() => applyFilters(EMPTY_FILTERS)}
            />
          ) : (
            <EmptyState
              title="Todavía no tienes tareas"
              message="Cuando se registren tareas las verás listadas aquí."
            />
          )
        }
        ItemSeparatorComponent={TaskSeparator}
        contentContainerStyle={[styles.content, tasks.length === 0 ? styles.contentEmpty : null]}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} tintColor={colors.primary} />
        }
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  contentEmpty: {
    flexGrow: 1,
  },
  separator: {
    height: spacing.md,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  headerButtonPressed: {
    backgroundColor: colors.primarySoft,
  },
  headerButtonLabel: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
  headerBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeLabel: {
    ...typography.overline,
    color: colors.onPrimary,
  },
});
