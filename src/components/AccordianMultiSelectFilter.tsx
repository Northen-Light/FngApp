import { Pressable, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

type Param = {
  id: number;
  name: string;
};

export type Filter = {
  id: number;
  type: string;
  params: Param[];
};

export type FilterSelect = {
  id: number;
  selected: boolean[];
};

type AccordianMultiSelectFilterProps = {
  filters: Filter[];
  accordianOpenList: boolean[];
  onAccordianOpenListChange: (index: number) => void;
  filterSelectList: FilterSelect[];
  onFilterSelectListChange: (outerIndex: number, innerIndex: number) => void;
  handleClose: () => void;
};

export function AccordianMultiSelectFilter({
  filters,
  accordianOpenList,
  onAccordianOpenListChange,
  filterSelectList,
  onFilterSelectListChange,
  handleClose,
}: AccordianMultiSelectFilterProps) {
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
              onPress={() => onAccordianOpenListChange(outerIndex)}
            >
              <Text style={styles.itemText}>{filter.type.toUpperCase()}</Text>
              <FastImage
                style={styles.arrowIcon}
                source={
                  accordianOpenList[outerIndex]
                    ? require('@assets/arrow-up.png')
                    : require('@assets/arrow-down.png')
                }
              />
            </Pressable>
            {accordianOpenList[outerIndex] && (
              <View style={styles.accordianBodyContainer}>
                {filter.params.map((param, innerIndex) => (
                  <Pressable
                    key={param.id}
                    style={[
                      styles.capsule,
                      filterSelectList[outerIndex].selected[innerIndex]
                        ? styles.bgBlack
                        : {},
                    ]}
                    onPress={() =>
                      onFilterSelectListChange(outerIndex, innerIndex)
                    }
                  >
                    <Text
                      style={[
                        styles.itemText,
                        filterSelectList[outerIndex].selected[innerIndex]
                          ? styles.textColorWhite
                          : {},
                      ]}
                    >
                      {param.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
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
  itemText: {
    fontSize: 16,
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
