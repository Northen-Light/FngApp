import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabs } from './navigators/BottomTabs';
import { CartProvider } from './contextProviders/CartProvider';
import { ProductDataProvider } from './contextProviders/ProductDataProvider';

export default function App() {
  return (
    <SafeAreaView style={styles.rootContainer} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <AppContent />
    </SafeAreaView>
  );
}

function AppContent() {
  return (
    <ProductDataProvider>
      <CartProvider>
        <NavigationContainer>
          <BottomTabs />
        </NavigationContainer>
      </CartProvider>
    </ProductDataProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
});
