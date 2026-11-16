import { View, Text, StyleSheet } from 'react-native';
import { useProductData } from '../contextProviders/ProductDataProvider';
import { useCart } from '../contextProviders/CartProvider';
import { useEffect } from 'react';

export function Cart() {
  const { productData } = useProductData();
  const { cartState } = useCart();

  useEffect(() => {}, [cartState, productData]);

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.headerText}> Cart Screen</Text>
    </View>
  );
}

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
});
