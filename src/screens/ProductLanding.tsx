import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import type { FilterOptions, ListData, Product } from '../types';

import { fetchProductList } from '../network/fetchProductList';
import { FilterAndSorting } from '../components/FilterSorting';
import { ListItem } from '../components/ListItem';
import { FilterCell } from '../components/FilterCell';
import { FILTERS, PAGE_ITEMS } from '../constants/constants';

export function ProductLanding() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [listData, setListData] = useState<ListData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions[]>(
    FILTERS.map(filter => ({ filterId: filter.id, filterValueIds: [] })),
  );

  const pageNumber = useRef(0);
  const isInitialLoad = useRef(true);
  const isLoading = useRef(false);
  const hasMore = useRef(true);

  const loadMore = useCallback(
    async (options?: FilterOptions[], controller?: AbortController) => {
      setLoading(true);
      isLoading.current = true;

      try {
        const response = await fetchProductList(
          pageNumber.current,
          PAGE_ITEMS,
          options,
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

    loadMore();
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

  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    const controller = new AbortController();

    pageNumber.current = 0;
    isInitialLoad.current = false;
    isLoading.current = false;
    hasMore.current = true;

    setProductList([]);
    loadMore(filterOptions, controller);

    return () => controller.abort();
  }, [filterOptions, loadMore]);

  const expandBottomSheet = useCallback(
    () => bottomSheetRef.current?.expand(),
    [],
  );

  const closeBottomSheet = useCallback(
    () => bottomSheetRef.current?.close(),
    [],
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
        renderItem={({ item }) => (
          <RenderItem item={item} onPressHandler={expandBottomSheet} />
        )}
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
            />
          </BottomSheetView>
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

type RenderItemProps = {
  item: ListData;
  onPressHandler: () => void;
};

const RenderItem = memo(({ item, onPressHandler }: RenderItemProps) => {
  switch (item.type) {
    case 'Filter':
      return <FilterCell onPressHandler={onPressHandler} />;
    case 'Product':
      return <ListItem item={item.data} />;
  }
});

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
