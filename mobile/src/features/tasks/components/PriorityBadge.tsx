import React from 'react';
import { priorityTone } from '../../../shared/theme';
import { CatalogItem } from '../types/task.types';
import { Badge } from './Badge';

type PriorityBadgeProps = {
  priority: CatalogItem;
};

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => (
  <Badge
    label={priority.name}
    tone={priorityTone(priority.code)}
    variant="solid"
    accessibilityLabel={`Prioridad ${priority.name}`}
  />
);
