import { Pressable, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

type FilterCellProps = {
  onPressHandler: () => void;
};

export const FilterCell = ({ onPressHandler }: FilterCellProps) => {
  return (
    <View style={styles.filterCellContainer}>
      <Pressable style={styles.boxContainer} onPress={onPressHandler}>
        <FastImage
          style={styles.filterIcon}
          source={require('@assets/filter.png')}
        />
        <Text style={styles.font16}>Filter</Text>
      </Pressable>
    </View>
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
});
