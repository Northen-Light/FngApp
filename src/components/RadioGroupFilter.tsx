import { Pressable, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

type RadioGroupFilterProps = {
  items: Item[];
  selected: number;
  headerText: string;
  onSelect: (index: number) => void;
  onClose: () => void;
};

export function RadioGroupFilter({
  items,
  selected,
  headerText,
  onSelect,
  onClose,
}: RadioGroupFilterProps) {
  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>{headerText}</Text>
        </View>
        <Pressable
          onPress={onClose}
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

      <View style={styles.radioGroup}>
        {items.map((item, index) => (
          <Pressable
            hitSlop={{ left: 16 }}
            key={item.id}
            style={styles.radioGroupItem}
            onPress={() => onSelect(index)}
          >
            <View style={styles.buttonOuter}>
              {selected === index && <View style={styles.buttonInner} />}
            </View>

            <Text style={styles.itemText}>{item.name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

type Item = {
  id: number;
  name: string;
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 16,
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
  radioGroup: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  radioGroupItem: {
    marginVertical: 8,
    flexDirection: 'row',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '400',
  },
  buttonOuter: {
    width: 24,
    height: 24,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 24,
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonInner: {
    width: 12,
    height: 12,
    backgroundColor: 'black',
    borderWidth: 1,
    borderRadius: 24,
  },
});
