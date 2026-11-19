import { FlashList } from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import { memo, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { Product } from '../types';
import { useProductData } from '../contextProviders/ProductDataProvider';
import { Action, useCart } from '../contextProviders/CartProvider';

type ListData = [string, { quantity: number; amount: number }];

export function Cart() {
  const { productData } = useProductData();
  const { cartState, dispatch } = useCart();
  const [listData, setListData] = useState<ListData[]>([]);

  useEffect(() => {
    setListData(Object.entries(cartState.items));
  }, [cartState]);

  return (
    <View style={styles.profileContainer}>
      {listData.length > 0 && productData.size > 0 ? (
        <FlashList
          style={styles.flashlistContainer}
          data={listData}
          keyExtractor={item => item[0]}
          renderItem={({ item }) => (
            <ListItem
              item={item}
              dispatch={dispatch}
              product={productData.get(Number(item[0])) as Product}
            />
          )}
        />
      ) : (
        <Text style={styles.headerText}>Cart is empty !!!</Text>
      )}
    </View>
  );
}

type ListItemProps = {
  item: ListData;
  dispatch: (action: Action) => void;
  product: Product;
};

const ListItem = memo(
  ({ item, dispatch, product }: ListItemProps) => {
    const id = item[0];
    const cartItem = item[1];

    console.log(`Render:${id}`);

    return (
      <View style={styles.combinedProductContainer}>
        <FastImage
          recyclingKey={id}
          style={styles.productImage}
          source={{ uri: product.imageURL }}
        />
        <View>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.combinedProductAmount}>₹{cartItem.amount}</Text>
        </View>

        <View style={styles.modifyContainer}>
          <Pressable
            hitSlop={16}
            style={({ pressed }) => ({
              marginRight: 4,
              opacity: pressed ? 0.5 : 1,
            })}
            onPress={() =>
              dispatch({
                type: 'DECREMENT',
                payload: {
                  id: product.id,
                  price: product.price,
                },
              })
            }
          >
            <Text style={styles.textWhite}>-</Text>
          </Pressable>
          <Text style={styles.textWhite}>{cartItem.quantity}</Text>
          <Pressable
            hitSlop={16}
            style={({ pressed }) => ({
              marginLeft: 4,
              opacity: pressed ? 0.5 : 1,
            })}
            onPress={() =>
              dispatch({
                type: 'INCREMENT',
                payload: {
                  id: product.id,
                  price: product.price,
                },
              })
            }
          >
            <Text style={styles.textWhite}>+</Text>
          </Pressable>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    const prevItem = prevProps.item;
    const nextItem = nextProps.item;

    if (prevItem[0] !== nextItem[0]) return false;
    if (prevItem[1].amount !== nextItem[1].amount) return false;
    if (prevItem[1].quantity !== nextItem[1].quantity) return false;

    return true;
  },
);

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: 'black',
  },
  flashlistContainer: {
    width: '100%',
    height: '100%',
  },
  combinedProductContainer: {
    height: 60,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  modifyContainer: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'black',
    padding: 8,
    borderRadius: 8,
    minWidth: 60,
  },
  textWhite: {
    color: 'white',
  },
  combinedProductAmount: {
    marginLeft: 16,
    fontSize: 12,
    fontWeight: 'bold',
  },
  productName: {
    marginLeft: 16,
    fontSize: 14,
    fontWeight: 'black',
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});
