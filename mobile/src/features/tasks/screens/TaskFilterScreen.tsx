import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../../app/navigation/types';
import { Button, Chip, ErrorState, Loader, Screen } from '../../../shared/components';
import { colors, elevation, priorityTone, radius, spacing, statusTone, typography, Tone } from '../../../shared/theme';
import { useCatalogs } from '../hooks/useCatalogs';
import { CatalogItem, EMPTY_FILTERS, TaskFilters } from '../types/task.types';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskFilter'>;

type FilterGroupProps = {
  title: string;
  options: CatalogItem[];
  selected: string | null;
  onSelect: (code: string | null) => void;
  toneFor: (code: string) => Tone;
  testIDPrefix: string;
};

const FilterGroup = ({ title, options, selected, onSelect, toneFor, testIDPrefix }: FilterGroupProps) => (
  <View style={styles.group}>
    <Text style={styles.groupTitle}>{title}</Text>
    <View style={styles.card}>
      <Chip
        testID={`${testIDPrefix}-all`}
        label="Todos"
        selected={selected === null}
        onPress={() => onSelect(null)}
      />
      {options.map(option => (
        <Chip
          key={option.code}
          testID={`${testIDPrefix}-${option.code}`}
          label={option.name}
          tone={toneFor(option.code)}
          selected={selected === option.code}
          onPress={() => onSelect(option.code)}
        />
      ))}
    </View>
  </View>
);

export const TaskFilterScreen = ({ navigation, route }: Props) => {
  const [draft, setDraft] = useState<TaskFilters>(route.params.filters);
  const { priorities, statuses, isLoading, error, refetch } = useCatalogs();

  if (isLoading) {
    return (
      <Screen>
        <Loader message="Cargando filtros…" />
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

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>
          Elige una opción por criterio. Se combinan entre sí para acotar el listado.
        </Text>
        <FilterGroup
          title="Estado"
          options={statuses}
          selected={draft.status}
          onSelect={status => setDraft(current => ({ ...current, status }))}
          toneFor={statusTone}
          testIDPrefix="status"
        />
        <FilterGroup
          title="Prioridad"
          options={priorities}
          selected={draft.priority}
          onSelect={priority => setDraft(current => ({ ...current, priority }))}
          toneFor={priorityTone}
          testIDPrefix="priority"
        />
      </ScrollView>
      <View style={styles.actions}>
        <Button
          testID="clear-filters-button"
          label="Limpiar"
          variant="secondary"
          onPress={() => setDraft(EMPTY_FILTERS)}
          style={styles.action}
        />
        <Button
          testID="apply-filters-button"
          label="Aplicar"
          onPress={() => navigation.navigate('TaskList', { filters: draft })}
          style={styles.action}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  intro: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  group: {
    marginBottom: spacing.xl,
  },
  groupTitle: {
    ...typography.overline,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...elevation.card,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...elevation.bar,
  },
  action: {
    flex: 1,
  },
});
