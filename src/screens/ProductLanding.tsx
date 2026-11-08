import { FlashList } from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Button,
} from 'react-native';
import { fetchProductList } from '../network/fetchProductList';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
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
    type: 'product',
    params: [
      { id: 11, name: 'fruit' },
      { id: 12, name: 'vegetable' },
    ],
  },
];

function ListItem({ item }: { item: Product }) {
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
}

export function ProductLanding() {
  const [productList, setProductList] = useState<Product[]>([]);
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

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  const onEndReachedCallback = async () => {
    if (isInitialLoad.current || isLoading.current || !hasMore.current) return;

    loadMore();
  };

  const [selected, setSelected] = useState(0);
  const [accordianOpenList, setAccordianOpenList] = useState<boolean[]>(
    new Array(FILTERS.length).fill(false),
  );
  const [filterSelectList, setFilterSelectList] = useState(
    FILTERS.map(
      (filter): FilterSelect => ({
        id: filter.id,
        selected: new Array(filter.params.length).fill(false),
      }),
    ),
  );

  const [filterType, setFilterType] = useState<
    'RADIO_GROUP' | 'MULTI_SELECT' | null
  >(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const closeBottomSheet = () => {
    setFilterType(null);
    bottomSheetRef.current?.close();
  };

  const onAccordianOpenListChange = (index: number) => {
    const opened = [...accordianOpenList];
    opened[index] = !opened[index];
    setAccordianOpenList(opened);
  };

  const onFilterSelectListChange = (outerIndex: number, innerIndex: number) => {
    const filterSelectedCopy = [...filterSelectList];
    filterSelectedCopy[outerIndex].selected[innerIndex] =
      !filterSelectedCopy[outerIndex].selected[innerIndex];
    setFilterSelectList(filterSelectedCopy);
  };

  useEffect(() => {
    if (filterType !== null) {
      bottomSheetRef.current?.expand();
    }
  }, [filterType]);

  return (
    <GestureHandlerRootView style={styles.profileContainer}>
      <Button title="price" onPress={() => setFilterType('RADIO_GROUP')} />
      <Button title="filter" onPress={() => setFilterType('MULTI_SELECT')} />
      <FlashList
        numColumns={2}
        data={productList}
        renderItem={ListItem}
        style={styles.flashList}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReachedCallback}
        ListFooterComponent={
          <ActivityIndicator size="large" color="blue" animating={loading} />
        }
      />
      <BottomSheet
        onChange={(index: number) => {
          if (index === -1) {
            setFilterType(null);
          }
        }}
        ref={bottomSheetRef}
        enableDynamicSizing
        enablePanDownToClose
        index={-1}
      >
        <BottomSheetView style={styles.bottomSheetView}>
          {filterType === 'RADIO_GROUP' ? (
            <RadioGroupFilter
              selected={selected}
              items={PRICE_FILTER_ITEMS}
              onClose={closeBottomSheet}
              onSelect={index => {
                setSelected(index);
                closeBottomSheet();
              }}
              headerText={RADIO_GROUP_FILTER_HEADER_TEXT}
            />
          ) : (
            <AccordianMultiSelectFilter
              filters={FILTERS}
              handleClose={closeBottomSheet}
              filterSelectList={filterSelectList}
              accordianOpenList={accordianOpenList}
              onFilterSelectListChange={onFilterSelectListChange}
              onAccordianOpenListChange={onAccordianOpenListChange}
            />
          )}
        </BottomSheetView>
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
});
