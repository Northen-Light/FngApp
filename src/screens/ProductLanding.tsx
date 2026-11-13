import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {
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
import { FilterAndSorting } from '../components/FilterSorting';
import { ListItem } from '../components/ListItem';
import { FilterCell } from '../components/FilterCell';
import { FILTERS, PAGE_ITEMS } from '../constants/constants';

export function ProductLanding() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [listData, setListData] = useState<ListData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<boolean[]>(
    new Array(FILTERS.length).fill(false),
  );
  const [filterOptions, setFilterOptions] = useState<FilterOptions[]>(
    FILTERS.map(filter => ({ filterId: filter.id, filterValueIds: [] })),
  );
  const [sortOptions, setSortOptions] = useState<SortOptions[]>([]);
  const [operation, setOperation] = useState<Operation>('FILTER');

  const pageNumber = useRef(0);
  const isInitialLoad = useRef(true);
  const isLoading = useRef(false);
  const hasMore = useRef(true);
  const bottomSheetRef = useRef<BottomSheet>(null);

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
        setProductList(data => [...data, ...response.data]);
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
    [],
  );

  const onEndReachedCallback = async () => {
    if (isInitialLoad.current || isLoading.current || !hasMore.current) return;

    loadMore({ filterOptions, sortOptions });
  };

  const expandBottomSheet = useCallback(
    () => bottomSheetRef.current?.expand(),
    [],
  );

  const closeBottomSheet = useCallback(
    () => bottomSheetRef.current?.close(),
    [],
  );

  const onSelectedFiltersChange = (index: number) => {
    setSelectedFilters(current => {
      const next = [...current];
      next[index] = !next[index];
      return next;
    });
  };

  const onSelectedFiltersSetTrue = (index: number) => {
    setSelectedFilters(current => {
      const next = [...current];
      next[index] = true;
      return next;
    });
  };

  useEffect(() => {
    setListData([
      { type: 'Filter' },
      ...productList.map(
        (product): ListData => ({
          type: 'Product',
          data: product,
        }),
      ),
    ]);
  }, [productList]);

  useEffect(() => {
    const controller = new AbortController();

    pageNumber.current = 0;
    isInitialLoad.current = false;
    isLoading.current = false;
    hasMore.current = true;

    setProductList([]);
    loadMore({ filterOptions, sortOptions }, controller);

    return () => controller.abort();
  }, [filterOptions, sortOptions, loadMore]);

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
                <FilterCell
                  filters={FILTERS}
                  onPressHandler={expandBottomSheet}
                  onSelectedFiltersSetTrue={onSelectedFiltersSetTrue}
                  setOperation={setOperation}
                />
              );
            case 'Product':
              return <ListItem item={item.data} />;
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
      >
        <BottomSheetScrollView>
          <BottomSheetView style={styles.bottomSheetView}>
            <FilterAndSorting
              filters={FILTERS}
              handleClose={closeBottomSheet}
              setFilterOptions={setFilterOptions}
              selectedFilters={selectedFilters}
              onSelectedFiltersChange={onSelectedFiltersChange}
              operation={operation}
              setSortOptions={setSortOptions}
            />
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
