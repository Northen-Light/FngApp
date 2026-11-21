import { NavigatorScreenParams } from '@react-navigation/native';

export type BottomTabsParamList = {
  Home: NavigatorScreenParams<ProductStackParamList> | undefined;
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

export type ListData =
  | { type: 'Product'; product: Product }
  | { type: 'Filter' };

export type MultiSelect = {
  id: number;
  name: string;
  type: 'SINGLE_SELECT' | 'MULTI_SELECT';
  values: MultiSelectValue[];
};

export type FilterOptions = {
  filterId: number;
  filterValueIds: number[];
};

export type SortOptions = {
  sortId: number;
};

export type Operation = 'SORT' | 'FILTER';

type MultiSelectValue = {
  id: number;
  name: string;
};
