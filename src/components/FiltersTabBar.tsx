import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import FastImage from 'react-native-fast-image';

import type { Filter, Operation } from '../types';

type FiltersTabBar = {
  filters: Filter[];
  onTabPress: (type: Operation, index?: number) => void;
};

export const FiltersTabBar = ({ filters, onTabPress }: FiltersTabBar) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterCellContainer}
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
      </Pressable>

      <Pressable style={styles.boxContainer} onPress={() => onTabPress('SORT')}>
        <Text style={styles.font16}>Sort</Text>
        <FastImage
          style={styles.arrowDownIcon}
          source={require('@assets/arrow-down.png')}
        />
      </Pressable>

      {filters.map((filter, index) => (
        <Pressable
          key={filter.id}
          style={styles.boxContainer}
          onPress={() => onTabPress('FILTER', index)}
        >
          <Text style={styles.font16}>{filter.name}</Text>
          <FastImage
            style={styles.arrowDownIcon}
            source={require('@assets/arrow-down.png')}
          />
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  arrowDownIcon: {
    width: 24,
    height: 24,
  },
});
