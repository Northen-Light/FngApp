import { FlashList } from '@shopify/flash-list';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

const data = require('../mockData/fruits_vegetables_500.json');

type Product = {
  id: number;
  name: string;
  price: number;
  type: 'fruit' | 'vegetable';
  imageURL: string;
};

const UA = 'FngApp/1.0 (contact: prateekpatnaik823@gmail.com)';

function ListItem({ item }: { item: Product }) {
  return (
    <View style={styles.m16}>
      <Image
        resizeMode="cover"
        style={styles.image}
        source={{
          uri: item.imageURL,
          cache: 'force-cache',
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

  useEffect(() => {
    setProductList(data.slice(0, 100));
  }, []);

  return (
    <View style={styles.profileContainer}>
      <FlashList
        style={styles.flashList}
        data={productList}
        numColumns={2}
        renderItem={ListItem}
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
