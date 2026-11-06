import { View, Text, StyleSheet } from 'react-native';

export function Profile() {
  return (
    <View style={styles.profileContainer}>
      <Text style={styles.headerText}> Profile Screen</Text>
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
