import {
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

type SearchBarProps = {
  onChangeText: (text: string) => void;
  onClose: () => void;
  searchText: string;
};

export function SearchBar({
  onChangeText,
  onClose,
  searchText,
}: SearchBarProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="🔎︎ Search products"
          placeholderTextColor="black"
          onChangeText={onChangeText}
          numberOfLines={1}
          value={searchText}
        />
        <Pressable onPress={onClose}>
          <FastImage
            style={styles.closeIcon}
            source={require('@assets/closed.png')}
          />
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchBar: {
    padding: 16,
    color: 'black',
    flex: 1,
  },
  closeIcon: {
    width: 20,
    height: 20,
    marginRight: 16,
  },
});
