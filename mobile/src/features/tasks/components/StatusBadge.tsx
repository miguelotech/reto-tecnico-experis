import React from 'react';
import { statusTone } from '../../../shared/theme';
import { CatalogItem } from '../types/task.types';
import { Badge } from './Badge';

type StatusBadgeProps = {
  status: CatalogItem;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <Badge label={status.name} tone={statusTone(status.code)} accessibilityLabel={`Estado ${status.name}`} />
);
