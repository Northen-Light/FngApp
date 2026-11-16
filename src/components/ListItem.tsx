import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import type { Product } from '../types';

import { UA } from '../constants/constants';

type ListItemProps = {
  item: Product;
  count: number;
  onPlusButtonPress: () => void;
  onMinusButtonPress: () => void;
  onAddButtonPress: () => void;
};

export const ListItem = memo(
  ({
    item,
    count,
    onPlusButtonPress,
    onMinusButtonPress,
    onAddButtonPress,
  }: ListItemProps) => {
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
        <View style={styles.bottomContainer}>
          <View style={[styles.mt8, styles.width60percent]}>
            <Text style={styles.productNameText}>{item.name}</Text>
            <Text style={styles.productPriceText}>₹{item.price}</Text>
          </View>
          {count ? (
            <View style={styles.modifyContainer}>
              <Pressable
                onPress={onMinusButtonPress}
                hitSlop={16}
                style={({ pressed }) => ({
                  marginRight: 4,
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <Text style={styles.textWhite}>-</Text>
              </Pressable>
              <Text style={styles.textWhite}>{count}</Text>
              <Pressable
                onPress={onPlusButtonPress}
                hitSlop={16}
                style={({ pressed }) => ({
                  marginLeft: 4,
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <Text style={styles.textWhite}>+</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={onAddButtonPress}
              style={({ pressed }) => ({
                ...styles.addButtonContainer,
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Text style={styles.textWhite}>Add</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  },
);

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
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  modifyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'black',
    padding: 8,
    borderRadius: 8,
    minWidth: 60,
  },
  addButtonContainer: {
    backgroundColor: 'black',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
  },
  textWhite: {
    color: 'white',
  },
  width60percent: {
    width: '60%',
  },
});
