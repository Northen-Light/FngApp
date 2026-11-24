import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';

type SearchBarProps = {
  onChangeText: (text: string) => void;
  searchText: string;
};

export function SearchBar({ onChangeText, searchText }: SearchBarProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <TextInput
        style={styles.searchBar}
        placeholder="🔎︎ Search products"
        placeholderTextColor="black"
        onChangeText={onChangeText}
        numberOfLines={1}
        value={searchText}
      />
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: 'black',
  },
});
