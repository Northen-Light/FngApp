import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, ActivityIndicator, BackHandler, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { produce } from 'immer';

import type {
  FilterOptions,
  ListData,
  Operation,
  Product,
  SearchOptions,
  SortOptions,
} from '../types';

import { fetchProductList } from '../network/fetchProductList';
import { ListItem } from '../components/ListItem';
import { TabBarFilter } from '../components/TabBarFilter';
import {
  FILTER_HEADER_TEXT,
  FILTERS,
  PAGE_ITEMS,
  SORTING_HEADER_TEXT,
  SORTING_VALUES,
} from '../constants/constants';
import { AccordianMultiSelectView } from '../components/AccordianMultiSelectView';
import { RadioGroupView } from '../components/RadioGroupView';
import { useProductData } from '../store/productData';
import { decrement, increment, reset, useCartData } from '../store/cartData';
import { SearchBar } from '../components/SearchBar';
import { useDebounce } from '../hooks/useDebounce';

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
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText);
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    text: '',
  });
  const sheetIndexRef = useRef(-1);

  const pageNumber = useRef(0);
  const isInitialLoad = useRef(true);
  const isLoading = useRef(false);
  const hasMore = useRef(true);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const cartItems = useCartData(state => state.items);

  const { productData, setProductData } = useProductData();

  const loadMore = useCallback(
    async (
      options?: {
        filterOptions: FilterOptions[];
        sortOptions: SortOptions[];
        searchOptions: SearchOptions;
      },
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
          options?.searchOptions,
          controller,
        );
        console.log(response);

        setProductData(response.data);

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

    loadMore({ filterOptions, sortOptions, searchOptions });
  }, [filterOptions, loadMore, sortOptions, searchOptions]);

  const expandBottomSheet = useCallback(
    () => bottomSheetRef.current?.expand(),
    [],
  );

  const closeBottomSheet = useCallback(
    () => bottomSheetRef.current?.close(),
    [],
  );

  const onSelectedAccordiansChange = useCallback((index: number) => {
    setAccordianExpanded(
      produce(draft => {
        draft[index] = !draft[index];
      }),
    );
  }, []);

  const onAccordianExpandedChangeSetTrue = useCallback((index: number) => {
    setAccordianExpanded(
      produce(draft => {
        draft[index] = true;
      }),
    );
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
      setFilterOptions(
        produce(draft => {
          if (!selectedFilterValues[outerIndex][innerIndex]) {
            if (FILTERS[outerIndex].type === 'SINGLE_SELECT') {
              draft[outerIndex].filterValueIds.pop();
            }

            draft[outerIndex].filterValueIds.push(
              FILTERS[outerIndex].values[innerIndex].id,
            );
          } else {
            const removeIndex = draft[outerIndex].filterValueIds.indexOf(
              FILTERS[outerIndex].values[innerIndex].id,
            );
            draft[outerIndex].filterValueIds.splice(removeIndex, 1);
          }
          return draft;
        }),
      );

      setSelectedFilterValues(
        produce(draft => {
          if (FILTERS[outerIndex].type === 'SINGLE_SELECT') {
            for (let i = 0; i < draft[outerIndex].length; i++) {
              if (i !== innerIndex && draft[outerIndex][i]) {
                draft[outerIndex][i] = false;
              }
            }
          }

          draft[outerIndex][innerIndex] = !draft[outerIndex][innerIndex];
          return draft;
        }),
      );
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
      const next: ListData[] = [{ type: 'Controls' }];

      productData.forEach(value => {
        next.push({
          type: 'Product',
          product: value,
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

    setProductData([]);
    reset();
    loadMore({ filterOptions, sortOptions, searchOptions }, controller);

    return () => controller.abort();
  }, [filterOptions, sortOptions, loadMore, setProductData, searchOptions]);

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

  useEffect(() => {
    setSearchOptions({ text: debouncedSearchText });
  }, [debouncedSearchText]);

  const onPlusButtonPress = useCallback((product: Product) => {
    increment(product.id, product.price);
  }, []);

  const onMinusButtonPress = useCallback((product: Product) => {
    decrement(product.id, product.price);
  }, []);

  const onChangeText = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const onClose = useCallback(() => {
    setSearchText('');
  }, []);

  return (
    <GestureHandlerRootView style={styles.profileContainer}>
      <FlashList
        numColumns={2}
        stickyHeaderIndices={[0]}
        data={listData}
        keyboardShouldPersistTaps="handled"
        overrideItemLayout={(layout, item) => {
          if (item.type === 'Controls') {
            layout.span = 2;
          }
        }}
        renderItem={({ item }) => {
          switch (item.type) {
            case 'Controls':
              return (
                <View>
                  <SearchBar
                    onChangeText={onChangeText}
                    searchText={searchText}
                    onClose={onClose}
                  />
                  <TabBarFilter items={FILTERS} onTabPress={onFilterTabPress} />
                </View>
              );
            case 'Product':
              return (
                <ListItem
                  product={item.product}
                  count={cartItems[item.product.id]?.quantity ?? 0}
                  onPlusButtonPress={onPlusButtonPress}
                  onMinusButtonPress={onMinusButtonPress}
                  onAddButtonPress={onPlusButtonPress}
                />
              );
          }
        }}
        style={styles.flashList}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReachedCallback}
        ListFooterComponent={
          <ActivityIndicator size="large" color="black" animating={loading} />
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
  },
  flashList: {
    flex: 1,
    width: '100%',
  },
  bottomSheetView: {
    paddingVertical: 32,
  },
});
