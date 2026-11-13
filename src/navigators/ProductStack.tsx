import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductLanding } from '../screens/ProductLanding';
import { ProductDetails } from '../screens/ProductDetails';
import { ProductStackParamList } from '../types';

const Stack = createNativeStackNavigator<ProductStackParamList>();

export function ProductStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductLanding"
        component={ProductLanding}
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{ title: 'Details' }}
      />
    </Stack.Navigator>
  );
}
