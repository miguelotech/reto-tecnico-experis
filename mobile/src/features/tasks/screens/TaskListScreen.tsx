import React, { useCallback } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { RootStackParamList } from '../../../app/navigation/types';
import { EmptyState, ErrorState, Loader, Screen } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';
import { ListHero, TaskCard } from '../components';
import { useCatalogs } from '../hooks/useCatalogs';
import { useTasks } from '../hooks/useTasks';
import { countActiveFilters, EMPTY_FILTERS, TaskFilters, TaskSummary } from '../types/task.types';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

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
          <ListHero
            count={tasks.length}
            filters={filters}
            statuses={statuses}
            priorities={priorities}
            activeCount={activeCount}
            onOpenFilters={() => navigation.navigate('TaskFilter', { filters })}
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
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetch();
            }}
            tintColor={colors.ink}
          />
        }
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  separator: {
    height: spacing.md,
  },
});
