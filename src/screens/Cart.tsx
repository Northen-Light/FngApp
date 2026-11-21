import { FlashList } from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import { memo, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import type { NativeBottomTabNavigationProp } from '@react-navigation/bottom-tabs/unstable';
import type { BottomTabsParamList, Product } from '../types';
import { useNavigation } from '@react-navigation/native';
import { useProductData } from '../store/productData';
import { decrement, increment, reset, useCartData } from '../store/cartData';

type ListData = [string, { quantity: number; amount: number }];

type CartNavigationProp = NativeBottomTabNavigationProp<
  BottomTabsParamList,
  'Cart'
>;

export function Cart() {
  const navigation: CartNavigationProp = useNavigation();

  const productData = useProductData(state => state.productData);
  const cartState = useCartData();
  const [listData, setListData] = useState<ListData[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'IN_PROGRESS' | 'DELIVERED'>();

  const timerRefs = useRef<number[]>([]);

  useEffect(() => {
    const timers = timerRefs.current;
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  useEffect(() => {
    setListData(Object.entries(cartState.items));
  }, [cartState]);

  if (orderStatus) {
    return (
      <View style={styles.cartContainer}>
        {orderStatus === 'IN_PROGRESS' ? (
          <View>
            <Text style={styles.headerText}>Payment Successful.</Text>
            <View style={styles.separator} />
            <Text style={styles.headerText}>Order will be delivered soon.</Text>
          </View>
        ) : (
          <Text style={styles.headerText}>Order Delivered !!!</Text>
        )}
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.cartContainer}>
        <ActivityIndicator color="black" size="large" />
        <View style={styles.separator} />
        <Text style={styles.headerText}>Processing Payment...</Text>
      </View>
    );
  }

  if (listData.length > 0 && productData.size > 0) {
    return (
      <View style={styles.cartContainer}>
        <View style={styles.parentContainer}>
          <FlashList
            style={styles.flashlistContainer}
            data={listData}
            keyExtractor={item => item[0]}
            renderItem={({ item }) => (
              <ListItem
                item={item}
                product={productData.get(Number(item[0])) as Product}
              />
            )}
          />
          <View style={styles.checkoutContainer}>
            <Text style={styles.totalAmountQuantityDetails}>
              Total :{' '}
              <Text style={styles.totalAmountText}>
                ₹{cartState.totalAmount}
              </Text>{' '}
              (x
              {cartState.totalQuantity})
            </Text>
            <Pressable
              onPress={() => {
                setLoading(true);
                timerRefs.current.push(
                  setTimeout(() => {
                    setLoading(false);
                    setOrderStatus('IN_PROGRESS');

                    timerRefs.current.push(
                      setTimeout(() => {
                        setOrderStatus('DELIVERED');
                        reset();

                        timerRefs.current.push(
                          setTimeout(() => {
                            setOrderStatus(undefined);
                            navigation.navigate('Home');
                          }, 1000),
                        );
                      }, 3000),
                    );
                  }, 3000),
                );
              }}
              style={({ pressed }) => ({
                ...styles.payNowButton,
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Text style={styles.payNowButtonText}>Pay now</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cartContainer}>
      <Text style={styles.headerText}>Cart is empty !!!</Text>
    </View>
  );
}

type ListItemProps = {
  item: ListData;
  product: Product;
};

const ListItem = memo(
  ({ item, product }: ListItemProps) => {
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
            onPress={() => decrement(product.id, product.price)}
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
            onPress={() => increment(product.id, product.price)}
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
    if (prevItem[1] !== nextItem[1]) return false;

    return true;
  },
);

const styles = StyleSheet.create({
  cartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    marginHorizontal: 16,
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
  },
  flashlistContainer: {
    width: '100%',
    height: '100%',
  },
  parentContainer: {
    width: '100%',
    height: '100%',
  },
  separator: {
    marginVertical: 8,
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
  checkoutContainer: {
    height: 68,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 32,
    margin: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  totalAmountQuantityDetails: {
    fontSize: 16,
  },
  totalAmountText: {
    fontWeight: 'bold',
  },
  payNowButton: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 16,
  },
  payNowButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
