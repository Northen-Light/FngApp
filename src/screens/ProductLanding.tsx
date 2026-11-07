import { FlashList } from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { fetchProductList } from '../network/fetchProductList';

export type Product = {
  id: number;
  name: string;
  price: number;
  type: 'fruit' | 'vegetable';
  imageURL: string;
};

const UA = 'FngApp/1.0 (contact: prateekpatnaik823@gmail.com)';
const PAGE_ITEMS = 100;

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

  return (
    <View style={styles.profileContainer}>
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
    </View>
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
});
