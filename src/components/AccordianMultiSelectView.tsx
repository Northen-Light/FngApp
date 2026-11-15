import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

type Item = {
  id: number;
  name: string;
  type: 'SINGLE_SELECT' | 'MULTI_SELECT';
  values: Value[];
};

type Value = {
  id: number;
  name: string;
};

type AccordianMultiSelectViewProps = {
  items: Item[];
  selectedAccordians: boolean[];
  onSelectedAccordiansChange: (index: number) => void;
  selectedValues: boolean[][];
  onSelectedValuesChange: (outerIndex: number, innerIndex: number) => void;
  headerText: string;
  handleClose: () => void;
};

export function AccordianMultiSelectView({
  items,
  selectedAccordians,
  onSelectedAccordiansChange,
  selectedValues,
  onSelectedValuesChange,
  headerText,
  handleClose,
}: AccordianMultiSelectViewProps) {
  return (
    <View style={styles.parentContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>{headerText}</Text>
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
        {items.map((item, outerIndex) => (
          <View key={item.id}>
            <Pressable
              style={styles.accordianHeaderContainer}
              onPress={() => onSelectedAccordiansChange(outerIndex)}
            >
              <Text style={styles.itemText}>{item.name}</Text>
              <FastImage
                style={styles.arrowIcon}
                source={
                  selectedAccordians[outerIndex]
                    ? require('@assets/arrow-up.png')
                    : require('@assets/arrow-down.png')
                }
              />
            </Pressable>

            {selectedAccordians[outerIndex] && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.accordianBodyContainer}
              >
                {item.values.map((value, innerIndex) => (
                  <Pressable
                    key={value.id}
                    style={[
                      styles.capsule,
                      selectedValues[outerIndex][innerIndex]
                        ? styles.bgBlack
                        : {},
                    ]}
                    onPress={() =>
                      onSelectedValuesChange(outerIndex, innerIndex)
                    }
                  >
                    <Text
                      style={[
                        styles.itemValueText,
                        selectedValues[outerIndex][innerIndex]
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
  itemText: {
    fontSize: 16,
    fontWeight: '400',
  },
  itemValueText: {
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
