import { useState } from 'react';

export const usePersistentSelection = () => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleSelection = (id: number) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const selectMultiple = (ids: number[]) => {
    const newSelection = new Set(selectedIds);
    ids.forEach(id => newSelection.add(id));
    setSelectedIds(newSelection);
  };

  const deselectMultiple = (ids: number[]) => {
    const newSelection = new Set(selectedIds);
    ids.forEach(id => newSelection.delete(id));
    setSelectedIds(newSelection);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const selectAll = (ids: number[]) => {
    setSelectedIds(new Set(ids));
  };

  const replaceSelection = (ids: number[]) => {
    setSelectedIds(new Set(ids));
  };

  const isSelected = (id: number) => {
    return selectedIds.has(id);
  };

  const getSelectedArray = () => {
    return Array.from(selectedIds);
  };

  return {
    selectedIds,
    toggleSelection,
    selectMultiple,
    deselectMultiple,
    clearSelection,
    selectAll,
    replaceSelection,
    isSelected,
    getSelectedArray,
    selectedCount: selectedIds.size
  };
};