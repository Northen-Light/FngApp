import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, Button } from 'react-native';
import { ProductStackParamList } from '../navigators/types';

type HomeScreenProps = NativeStackScreenProps<
  ProductStackParamList,
  'ProductLanding'
>;

export function ProductLanding({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.profileContainer}>
      <Text style={styles.headerText}> Product Landing Screen</Text>
      <View style={styles.separator} />
      <Button
        title="Details"
        onPress={() => navigation.navigate('ProductDetails')}
      />
      <View />
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
  separator: {
    marginVertical: 8,
  },
});
