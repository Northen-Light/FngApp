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

export type Product = {
  id: number;
  name: string;
  price: number;
  type: 'fruit' | 'vegetable';
  imageURL: string;
};

export type ListData = { type: 'Product'; data: Product } | { type: 'Filter' };

export type Filter = {
  id: number;
  name: string;
  type: 'SINGLE_SELECT' | 'MULTI_SELECT';
  values: FilterValue[];
};

export type FilterOptions = {
  filterId: number;
  filterValueIds: number[];
};

type FilterValue = {
  id: number;
  name: string;
};
