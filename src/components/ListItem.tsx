import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import type { Product } from '../types';

import { UA } from '../constants/constants';

type ListItemProps = {
  item: Product;
};

export const ListItem = memo(({ item }: ListItemProps) => {
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
