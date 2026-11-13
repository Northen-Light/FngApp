import { useState } from 'react';
import type { Filter, FilterOptions, Operation, SortOptions } from '../types';
import { FilterView } from './FilterView';
import { RadioGroupView } from './RadioGroupView';
import { SORTING_HEADER_TEXT, SORTING_VALUES } from '../constants/constants';

type FilterViewProps = {
  filters: Filter[];
  handleClose: () => void;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions[]>>;
  selectedFilters: boolean[];
  onSelectedFiltersChange: (index: number) => void;
  operation: Operation;
  setSortOptions: React.Dispatch<React.SetStateAction<SortOptions[]>>;
};

export function FilterAndSorting({
  filters,
  handleClose,
  setFilterOptions,
  selectedFilters,
  onSelectedFiltersChange,
  operation,
  setSortOptions,
}: FilterViewProps) {
  const [selectedFilterValues, setSelectedFilterValues] = useState<boolean[][]>(
    [...filters.map(filter => new Array(filter.values.length).fill(false))],
  );

  const [selectedSortValue, setSelectedSortValue] = useState<number>(0);

  const onSelectedFilterValuesChange = (
    outerIndex: number,
    innerIndex: number,
  ) => {
    setFilterOptions(current => {
      const next = [...current];
      if (!selectedFilterValues[outerIndex][innerIndex]) {
        if (filters[outerIndex].type === 'SINGLE_SELECT') {
          next[outerIndex].filterValueIds.pop();
        }

        next[outerIndex].filterValueIds.push(
          filters[outerIndex].values[innerIndex].id,
        );
      } else {
        const removeIndex = next[outerIndex].filterValueIds.indexOf(
          filters[outerIndex].values[innerIndex].id,
        );
        next[outerIndex].filterValueIds.splice(removeIndex, 1);
      }
      return next;
    });

    setSelectedFilterValues(current => {
      const next = [...current];

      if (filters[outerIndex].type === 'SINGLE_SELECT') {
        for (let i = 0; i < next[outerIndex].length; i++) {
          if (i !== innerIndex && next[outerIndex][i]) {
            next[outerIndex][i] = false;
          }
        }
      }

      next[outerIndex][innerIndex] = !next[outerIndex][innerIndex];
      return next;
    });
  };

  const onSelectedSortValueChange = (index: number) => {
    setSortOptions([{ sortId: SORTING_VALUES[index].id }]);
    setSelectedSortValue(index);
  };

  switch (operation) {
    case 'FILTER':
      return (
        <FilterView
          filters={filters}
          selectedFilters={selectedFilters}
          selectedFilterValues={selectedFilterValues}
          onSelectedFiltersChange={onSelectedFiltersChange}
          onSelectedFilterValuesChange={onSelectedFilterValuesChange}
          handleClose={handleClose}
        />
      );
    case 'SORT':
      return (
        <RadioGroupView
          items={SORTING_VALUES}
          selected={selectedSortValue}
          headerText={SORTING_HEADER_TEXT}
          onSelect={onSelectedSortValueChange}
          handleClose={handleClose}
        />
      );
  }
}
