import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabs } from './navigators/BottomTabs';

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
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
});
