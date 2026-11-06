import { View, Text, StyleSheet } from 'react-native';

export function Cart() {
  return (
    <View style={styles.profileContainer}>
      <Text style={styles.headerText}> Cart Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: 'black',
  },
});
