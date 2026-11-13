import { useState } from 'react';
import type { FILTER, FILTER_OPTIONS } from '../screens/ProductLanding';
import { FilterView } from './FilterView';

type FilterViewProps = {
  filters: FILTER[];
  handleClose: () => void;
  setFilterOptions: React.Dispatch<React.SetStateAction<FILTER_OPTIONS[]>>;
};

export function FilterAndSorting({
  filters,
  handleClose,
  setFilterOptions,
}: FilterViewProps) {
  const [selectedFilters, setSelectedFilters] = useState<boolean[]>(
    new Array(filters.length).fill(false),
  );

  const [selectedFilterValues, setSelectedFilterValues] = useState<boolean[][]>(
    [...filters.map(filter => new Array(filter.values.length).fill(false))],
  );

  const onSelectedFiltersChange = (index: number) => {
    setSelectedFilters(current => {
      const next = [...current];
      next[index] = !next[index];
      return next;
    });
  };

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
}
