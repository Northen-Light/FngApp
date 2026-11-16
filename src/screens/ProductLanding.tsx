import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, ActivityIndicator, BackHandler } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import type {
  FilterOptions,
  ListData,
  Operation,
  Product,
  SortOptions,
} from '../types';

import { fetchProductList } from '../network/fetchProductList';
import { ListItem } from '../components/ListItem';
import { ListHeaderTabBar } from '../components/ListHeaderTabBar';
import {
  FILTER_HEADER_TEXT,
  FILTERS,
  PAGE_ITEMS,
  SORTING_HEADER_TEXT,
  SORTING_VALUES,
} from '../constants/constants';
import { AccordianMultiSelectView } from '../components/AccordianMultiSelectView';
import { RadioGroupView } from '../components/RadioGroupView';
import { useCart } from '../contextProviders/CartProvider';
import { useProductData } from '../contextProviders/ProductDataProvider';

export function ProductLanding() {
  const [listData, setListData] = useState<ListData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSortValue, setSelectedSortValue] = useState<number>(0);
  const [accordianExpanded, setAccordianExpanded] = useState<boolean[]>(
    new Array(FILTERS.length).fill(false),
  );
  const [selectedFilterValues, setSelectedFilterValues] = useState<boolean[][]>(
    [...FILTERS.map(filter => new Array(filter.values.length).fill(false))],
  );

  const [filterOptions, setFilterOptions] = useState<FilterOptions[]>(
    FILTERS.map(filter => ({ filterId: filter.id, filterValueIds: [] })),
  );
  const [sortOptions, setSortOptions] = useState<SortOptions[]>([]);
  const [operation, setOperation] = useState<Operation>('FILTER');
  const sheetIndexRef = useRef(-1);

  const pageNumber = useRef(0);
  const isInitialLoad = useRef(true);
  const isLoading = useRef(false);
  const hasMore = useRef(true);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const { cartState, dispatch } = useCart();
  const { productData, setProductData } = useProductData();

  const loadMore = useCallback(
    async (
      options?: { filterOptions: FilterOptions[]; sortOptions: SortOptions[] },
      controller?: AbortController,
    ) => {
      setLoading(true);
      isLoading.current = true;

      try {
        const response = await fetchProductList(
          pageNumber.current,
          PAGE_ITEMS,
          options?.filterOptions,
          options?.sortOptions,
          controller,
        );
        console.log(response);

        setProductData(current => {
          const next = new Map<number, Product>(current);
          for (let i = 0; i < response.data.length; i++) {
            next.set(response.data[i].id, response.data[i]);
          }
          return next;
        });

        hasMore.current = !response.pageEnd;
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        } else {
          console.log('unexpected error', e);
        }
      } finally {
        isLoading.current = false;
        isInitialLoad.current = false;
        pageNumber.current += 1;
        setLoading(false);
      }
    },
    [setProductData],
  );

  const onEndReachedCallback = useCallback(async () => {
    if (isInitialLoad.current || isLoading.current || !hasMore.current) return;

    loadMore({ filterOptions, sortOptions });
  }, [filterOptions, loadMore, sortOptions]);

  const expandBottomSheet = useCallback(
    () => bottomSheetRef.current?.expand(),
    [],
  );

  const closeBottomSheet = useCallback(
    () => bottomSheetRef.current?.close(),
    [],
  );

  const onSelectedAccordiansChange = useCallback((index: number) => {
    setAccordianExpanded(current => {
      const next = [...current];
      next[index] = !next[index];
      return next;
    });
  }, []);

  const onAccordianExpandedChangeSetTrue = useCallback((index: number) => {
    setAccordianExpanded(current => {
      const next = [...current];
      next[index] = true;
      return next;
    });
  }, []);

  const onFilterTabPress = useCallback(
    (operationArg: Operation, index?: number) => {
      switch (operationArg) {
        case 'SORT':
          setOperation(operationArg);
          break;
        case 'FILTER':
          setOperation(operationArg);
          if (index !== undefined) onAccordianExpandedChangeSetTrue(index);
          break;
      }
      expandBottomSheet();
    },
    [expandBottomSheet, onAccordianExpandedChangeSetTrue],
  );

  const onSelectedFilterValuesChange = useCallback(
    (outerIndex: number, innerIndex: number) => {
      setFilterOptions(current => {
        const next = [...current];
        if (!selectedFilterValues[outerIndex][innerIndex]) {
          if (FILTERS[outerIndex].type === 'SINGLE_SELECT') {
            next[outerIndex].filterValueIds.pop();
          }

          next[outerIndex].filterValueIds.push(
            FILTERS[outerIndex].values[innerIndex].id,
          );
        } else {
          const removeIndex = next[outerIndex].filterValueIds.indexOf(
            FILTERS[outerIndex].values[innerIndex].id,
          );
          next[outerIndex].filterValueIds.splice(removeIndex, 1);
        }
        return next;
      });

      setSelectedFilterValues(current => {
        const next = [...current];

        if (FILTERS[outerIndex].type === 'SINGLE_SELECT') {
          for (let i = 0; i < next[outerIndex].length; i++) {
            if (i !== innerIndex && next[outerIndex][i]) {
              next[outerIndex][i] = false;
            }
          }
        }

        next[outerIndex][innerIndex] = !next[outerIndex][innerIndex];
        return next;
      });
    },
    [selectedFilterValues],
  );

  const onSelectedSortValueChange = useCallback((index: number) => {
    setSortOptions([{ sortId: SORTING_VALUES[index].id }]);
    setSelectedSortValue(index);
    bottomSheetRef.current?.close();
  }, []);

  const FilterSorting = useCallback(() => {
    switch (operation) {
      case 'FILTER':
        return (
          <AccordianMultiSelectView
            items={FILTERS}
            selectedAccordians={accordianExpanded}
            onSelectedAccordiansChange={onSelectedAccordiansChange}
            selectedValues={selectedFilterValues}
            onSelectedValuesChange={onSelectedFilterValuesChange}
            headerText={FILTER_HEADER_TEXT}
            handleClose={closeBottomSheet}
          />
        );
      case 'SORT':
        return (
          <RadioGroupView
            items={SORTING_VALUES}
            selectedValue={selectedSortValue}
            onSelectedValueChange={onSelectedSortValueChange}
            headerText={SORTING_HEADER_TEXT}
            handleClose={closeBottomSheet}
          />
        );
    }
  }, [
    operation,
    accordianExpanded,
    onSelectedAccordiansChange,
    selectedFilterValues,
    onSelectedFilterValuesChange,
    closeBottomSheet,
    selectedSortValue,
    onSelectedSortValueChange,
  ]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  useEffect(() => {
    setListData(() => {
      const next: ListData[] = [{ type: 'Filter' }];

      productData.forEach(value => {
        next.push({
          type: 'Product',
          data: value,
        });
      });

      return next;
    });
  }, [productData]);

  useEffect(() => {
    const controller = new AbortController();

    pageNumber.current = 0;
    isInitialLoad.current = false;
    isLoading.current = false;
    hasMore.current = true;

    setProductData(new Map());
    loadMore({ filterOptions, sortOptions }, controller);

    return () => controller.abort();
  }, [filterOptions, sortOptions, loadMore, setProductData]);

  useEffect(() => {
    const onBackPress = () => {
      if (sheetIndexRef.current >= 0) {
        bottomSheetRef.current?.close();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => subscription.remove();
  }, []);

  const onPlusButtonPress = useCallback(
    (data: Product) => {
      dispatch({
        type: 'INCREMENT',
        payload: { id: data.id, price: data.price },
      });
    },
    [dispatch],
  );

  const onMinusButtonPress = useCallback(
    (data: Product) => {
      dispatch({
        type: 'DECREMENT',
        payload: { id: data.id, price: data.price },
      });
    },
    [dispatch],
  );

  const onAddButtonPress = useCallback(
    (data: Product) => {
      dispatch({
        type: 'INCREMENT',
        payload: { id: data.id, price: data.price },
      });
    },
    [dispatch],
  );

  return (
    <GestureHandlerRootView style={styles.profileContainer}>
      <FlashList
        numColumns={2}
        stickyHeaderIndices={[0]}
        data={listData}
        overrideItemLayout={(layout, item) => {
          if (item.type === 'Filter') {
            layout.span = 2;
          }
        }}
        renderItem={({ item }) => {
          switch (item.type) {
            case 'Filter':
              return (
                <ListHeaderTabBar
                  items={FILTERS}
                  onTabPress={onFilterTabPress}
                />
              );
            case 'Product':
              return (
                <ListItem
                  data={item.data}
                  count={cartState.items[item.data.id]?.quantity ?? 0}
                  onPlusButtonPress={onPlusButtonPress}
                  onMinusButtonPress={onMinusButtonPress}
                  onAddButtonPress={onAddButtonPress}
                />
              );
          }
        }}
        style={styles.flashList}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReachedCallback}
        ListFooterComponent={
          <ActivityIndicator size="large" color="blue" animating={loading} />
        }
      />

      <BottomSheet
        ref={bottomSheetRef}
        enableDynamicSizing
        enablePanDownToClose
        index={-1}
        backdropComponent={renderBackdrop}
        onChange={index => (sheetIndexRef.current = index)}
      >
        <BottomSheetScrollView>
          <BottomSheetView style={styles.bottomSheetView}>
            <FilterSorting />
          </BottomSheetView>
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashList: {
    flex: 1,
    width: '100%',
  },
  bottomSheetView: {
    paddingVertical: 32,
  },
});
