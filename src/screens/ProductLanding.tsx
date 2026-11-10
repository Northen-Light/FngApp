import { FlashList } from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { fetchProductList } from '../network/fetchProductList';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { RadioGroupFilter } from '../components/RadioGroupFilter';
import { AccordianMultiSelectFilter } from '../components/AccordianMultiSelectFilter';
import type {
  FilterSelect,
  Filter,
} from '../components/AccordianMultiSelectFilter';

export type Product = {
  id: number;
  name: string;
  price: number;
  type: 'fruit' | 'vegetable';
  imageURL: string;
};

export type ListItem = { type: 'Product'; data: Product } | { type: 'Filter' };

const UA = 'FngApp/1.0 (contact: prateekpatnaik823@gmail.com)';
const PAGE_ITEMS = 100;
const PRICE_FILTER_ITEMS = [
  { id: 1, text: 'Low : (₹0-150)' },
  { id: 2, text: 'Medium : (₹150-275)' },
  { id: 3, text: 'High : (₹275+)' },
];
const RADIO_GROUP_FILTER_HEADER_TEXT = 'Select price range';

const FILTERS: Filter[] = [
  {
    id: 1,
    type: 'Product',
    params: [
      { id: 11, name: 'fruit' },
      { id: 12, name: 'vegetable' },
    ],
  },
];

export function ProductLanding() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [listData, setListData] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const pageNumber = useRef(0);
  const isInitialLoad = useRef(true);
  const isLoading = useRef(false);
  const hasMore = useRef(true);

  const loadMore = useCallback(async () => {
    setLoading(true);
    isLoading.current = true;

    try {
      const response = await fetchProductList(pageNumber.current, PAGE_ITEMS);
      setProductList(data => [...data, ...response.data]);
      hasMore.current = !response.pageEnd;
    } finally {
      isLoading.current = false;
      isInitialLoad.current = false;
      pageNumber.current += 1;
      setLoading(false);
    }
  }, []);

  const onEndReachedCallback = async () => {
    if (isInitialLoad.current || isLoading.current || !hasMore.current) return;

    loadMore();
  };

  useEffect(() => {
    setListData([
      { type: 'Filter' },
      ...productList.map(
        (product): ListItem => ({
          type: 'Product',
          data: product,
        }),
      ),
    ]);
  }, [productList]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  const [priceFilterSelected, setPriceFilterSelected] = useState(0);
  const [accordianOpenedList, setAccordianOpenedList] = useState<boolean[]>(
    new Array(FILTERS.length).fill(false),
  );
  const [filterSelectedList, setFilterSelectedList] = useState(
    FILTERS.map(
      (filter): FilterSelect => ({
        id: filter.id,
        selected: new Array(filter.params.length).fill(false),
      }),
    ),
  );
  const [filterType, setFilterType] = useState<
    'PRICE_FILTER' | 'MULTI_SELECT_FILTER' | null
  >(null);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const closeBottomSheet = () => {
    setFilterType(null);
    bottomSheetRef.current?.close();
  };

  const onAccordianOpenedListChange = useCallback(
    (index: number) => {
      const list = [...accordianOpenedList];
      list[index] = !list[index];
      setAccordianOpenedList(list);
    },
    [accordianOpenedList],
  );

  const onFilterSelectedListChange = useCallback(
    (outerIndex: number, innerIndex: number) => {
      const list = [...filterSelectedList];
      list[outerIndex].selected[innerIndex] =
        !list[outerIndex].selected[innerIndex];
      setFilterSelectedList(list);
    },
    [filterSelectedList],
  );

  const handleBottomSheetChange = (index: number) => {
    if (index === -1) {
      setFilterType(null);
    }
  };

  useEffect(() => {
    if (filterType !== null) {
      bottomSheetRef.current?.expand();
    }
  }, [filterType]);

  const FilterCell = useCallback(() => {
    return (
      <View style={styles.filterCellContainer}>
        <Pressable
          style={styles.boxContainer}
          onPress={() => setFilterType('MULTI_SELECT_FILTER')}
        >
          <FastImage
            style={styles.filterIcon}
            source={require('@assets/filter.png')}
          />
          <Text style={styles.font16}>Filter</Text>
        </Pressable>
        <Pressable
          style={styles.boxContainer}
          onPress={() => setFilterType('PRICE_FILTER')}
        >
          <Text style={styles.font16}>Price</Text>
          <FastImage
            style={styles.downArrow}
            source={require('@assets/arrow-down.png')}
          />
        </Pressable>
        {FILTERS.map(filter => (
          <Pressable
            key={filter.id}
            style={styles.boxContainer}
            onPress={() => {
              const list = [...accordianOpenedList];
              list[0] = true;
              setAccordianOpenedList(list);
              setFilterType('MULTI_SELECT_FILTER');
            }}
          >
            <Text style={styles.font16}>{filter.type}</Text>
            <FastImage
              style={styles.downArrow}
              source={require('@assets/arrow-down.png')}
            />
          </Pressable>
        ))}
      </View>
    );
  }, [accordianOpenedList]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      switch (item.type) {
        case 'Filter':
          return <FilterCell />;
        case 'Product':
          return <ListItem item={item.data} />;
      }
    },
    [FilterCell],
  );

  const RenderFilterView = useCallback(() => {
    switch (filterType) {
      case 'PRICE_FILTER': {
        return (
          <RadioGroupFilter
            items={PRICE_FILTER_ITEMS}
            selected={priceFilterSelected}
            headerText={RADIO_GROUP_FILTER_HEADER_TEXT}
            onSelect={index => {
              setPriceFilterSelected(index);
              closeBottomSheet();
            }}
            onClose={closeBottomSheet}
          />
        );
      }

      case 'MULTI_SELECT_FILTER': {
        return (
          <AccordianMultiSelectFilter
            filters={FILTERS}
            filterSelectedList={filterSelectedList}
            accordianOpenedList={accordianOpenedList}
            onAccordianOpenedListChange={onAccordianOpenedListChange}
            onFilterSelectedListChange={onFilterSelectedListChange}
            handleClose={closeBottomSheet}
          />
        );
      }

      case null: {
        return null;
      }
    }
  }, [
    accordianOpenedList,
    filterSelectedList,
    filterType,
    onAccordianOpenedListChange,
    onFilterSelectedListChange,
    priceFilterSelected,
  ]);

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
        renderItem={renderItem}
        style={styles.flashList}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReachedCallback}
        ListFooterComponent={
          <ActivityIndicator size="large" color="blue" animating={loading} />
        }
      />
      <BottomSheet
        onChange={handleBottomSheetChange}
        ref={bottomSheetRef}
        enableDynamicSizing
        enablePanDownToClose
        index={-1}
      >
        <BottomSheetScrollView>
          <BottomSheetView style={styles.bottomSheetView}>
            {RenderFilterView()}
          </BottomSheetView>
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const ListItem = memo(({ item }: { item: Product }) => {
  return (
    <View style={styles.m16}>
      <FastImage
        recyclingKey={item.id.toString()}
        transition
        objectFit="cover"
        style={styles.image}
        source={{
          uri: item.imageURL,
          headers: { 'User-Agent': UA },
        }}
        onError={({ nativeEvent }) => {
          console.log(item.name, nativeEvent.error);
        }}
      />
      <View style={styles.mt8}>
        <Text style={styles.productNameText}>{item.name}</Text>
        <Text style={styles.productPriceText}>₹{item.price}</Text>
      </View>
    </View>
  );
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
  image: {
    height: 200,
    flex: 1,
    borderRadius: 16,
    borderColor: 'grey',
    borderWidth: 1,
  },
  productNameText: {
    fontWeight: 'black',
    fontSize: 16,
  },
  productPriceText: {
    fontWeight: 'bold',
  },
  m16: {
    margin: 16,
  },
  mt8: {
    marginTop: 8,
  },
  bottomSheetView: {
    paddingVertical: 32,
  },
  filterCellContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
  },
  boxContainer: {
    flexDirection: 'row',
    marginRight: 16,
    alignItems: 'center',
  },
  filterIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  font16: {
    fontSize: 16,
  },
  downArrow: {
    width: 24,
    height: 24,
  },
});
