import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import { ReactElement } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-screens/experimental';
import { Cart } from '../screens/Cart';
import { Profile } from '../screens/Profile';
import { ProductStack } from './ProductStack';
import { trigger } from 'react-native-haptic-feedback';
import { BottomTabsParamList } from '../types';

const Tab = createNativeBottomTabNavigator<BottomTabsParamList>();

const hapticFeedbackOptions = {
  ignoreAndroidSystemSettings: false,
  enableVibrateFallback: false,
};

function ScreenLayout({ children }: { children: ReactElement }) {
  return (
    <View style={styles.rootScreenContainer}>
      <SafeAreaView edges={{ bottom: true }} insetType="interface">
        {children}
      </SafeAreaView>
    </View>
  );
}
export function BottomTabs() {
  return (
    <Tab.Navigator
      screenListeners={({ navigation }) => ({
        tabPress: () => {
          if (!navigation.isFocused()) {
            trigger('impactLight', hapticFeedbackOptions);
          }
        },
      })}
      screenLayout={ScreenLayout}
    >
      <Tab.Screen
        name="Home"
        component={ProductStack}
        options={{
          tabBarIcon:
            Platform.OS === 'ios'
              ? {
                  type: 'sfSymbol',
                  name: 'house',
                }
              : {
                  type: 'image',
                  source: require('@assets/house.png'),
                },
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon:
            Platform.OS === 'ios'
              ? {
                  type: 'sfSymbol',
                  name: 'cart',
                }
              : {
                  type: 'image',
                  source: require('@assets/shopping-cart.png'),
                },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon:
            Platform.OS === 'ios'
              ? {
                  type: 'sfSymbol',
                  name: 'person.crop.circle',
                }
              : {
                  type: 'image',
                  source: require('@assets/user.png'),
                },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  rootScreenContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
});
