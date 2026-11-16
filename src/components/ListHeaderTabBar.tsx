import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import FastImage from 'react-native-fast-image';

import type { MultiSelect, Operation } from '../types';
import { memo } from 'react';

type ListHeaderTabBar = {
  items: MultiSelect[];
  onTabPress: (type: Operation, index?: number) => void;
};

export const ListHeaderTabBar = memo(
  ({ items, onTabPress }: ListHeaderTabBar) => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.parentContainer}
      >
        <Pressable
          style={styles.boxContainer}
          onPress={() => onTabPress('FILTER')}
        >
          <FastImage
            style={styles.filterIcon}
            source={require('@assets/filter.png')}
          />
          <Text style={styles.font16}>Filter</Text>
          <FastImage
            style={styles.arrowDownIcon}
            source={require('@assets/arrow-down.png')}
          />
        </Pressable>

        <Pressable
          style={styles.boxContainer}
          onPress={() => onTabPress('SORT')}
        >
          <FastImage
            style={styles.filterIcon}
            source={require('@assets/sort.png')}
          />
          <Text style={styles.font16}>Sort</Text>
          <FastImage
            style={styles.arrowDownIcon}
            source={require('@assets/arrow-down.png')}
          />
        </Pressable>

        {items.map((item, index) => (
          <Pressable
            key={item.id}
            style={styles.boxContainer}
            onPress={() => onTabPress('FILTER', index)}
          >
            <Text style={styles.font16}>{item.name}</Text>
            <FastImage
              style={styles.arrowDownIcon}
              source={require('@assets/arrow-down.png')}
            />
          </Pressable>
        ))}
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  parentContainer: {
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
  arrowDownIcon: {
    width: 24,
    height: 24,
  },
});
