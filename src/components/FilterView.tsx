import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { FILTER } from '../screens/ProductLanding';

type FilterView = {
  filters: FILTER[];
  selectedFilters: boolean[];
  selectedFilterValues: boolean[][];
  onSelectedFiltersChange: (index: number) => void;
  onSelectedFilterValuesChange: (
    outerIndex: number,
    innerIndex: number,
  ) => void;
  handleClose: () => void;
};

export function FilterView({
  filters,
  selectedFilters,
  selectedFilterValues,
  onSelectedFiltersChange,
  onSelectedFilterValuesChange,
  handleClose,
}: FilterView) {
  return (
    <View style={styles.parentContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>FILTER</Text>
        </View>
        <Pressable
          onPress={handleClose}
          style={({ pressed }) => [
            styles.crossIconContainer,
            { opacity: pressed ? 0.5 : 1.0 },
          ]}
        >
          <FastImage
            style={styles.crossIcon}
            source={require('@assets/close.png')}
          />
        </Pressable>
      </View>

      <View style={styles.multiSelectContainer}>
        {filters.map((filter, outerIndex) => (
          <View key={filter.id}>
            <Pressable
              style={styles.accordianHeaderContainer}
              onPress={() => onSelectedFiltersChange(outerIndex)}
            >
              <Text style={styles.filterText}>{filter.name}</Text>
              <FastImage
                style={styles.arrowIcon}
                source={
                  selectedFilters[outerIndex]
                    ? require('@assets/arrow-up.png')
                    : require('@assets/arrow-down.png')
                }
              />
            </Pressable>

            {selectedFilters[outerIndex] && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.accordianBodyContainer}
              >
                {filter.values.map((value, innerIndex) => (
                  <Pressable
                    key={value.id}
                    style={[
                      styles.capsule,
                      selectedFilterValues[outerIndex][innerIndex]
                        ? styles.bgBlack
                        : {},
                    ]}
                    onPress={() =>
                      onSelectedFilterValuesChange(outerIndex, innerIndex)
                    }
                  >
                    <Text
                      style={[
                        styles.filterValueText,
                        selectedFilterValues[outerIndex][innerIndex]
                          ? styles.textColorWhite
                          : {},
                      ]}
                    >
                      {value.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    marginHorizontal: 16,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  headerTextContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'black',
  },
  crossIconContainer: {
    marginRight: 16,
  },
  crossIcon: {
    height: 16,
    width: 16,
  },
  multiSelectContainer: {
    marginTop: 32,
  },
  filterText: {
    fontSize: 16,
    fontWeight: '400',
  },
  filterValueText: {
    fontSize: 14,
    fontWeight: '400',
  },
  arrowIcon: {
    height: 24,
    width: 24,
    marginRight: 12,
  },
  accordianHeaderContainer: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accordianBodyContainer: {
    flexDirection: 'row',
    paddingBottom: 16,
  },
  capsule: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 8,
  },
  bgBlack: {
    backgroundColor: 'black',
  },
  textColorWhite: {
    color: 'white',
  },
});
