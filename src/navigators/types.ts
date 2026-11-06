import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type BottomTabsParamList = {
  Home: NativeStackScreenProps<ProductStackParamList> | undefined;
  Cart: undefined;
  Profile: undefined;
};

export type ProductStackParamList = {
  ProductLanding: undefined;
  ProductDetails: undefined;
};
