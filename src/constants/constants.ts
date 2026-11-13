import { Filter } from '../types';

export const FILTERS: Filter[] = [
  {
    id: 1,
    name: 'Price',
    type: 'SINGLE_SELECT',
    values: [
      { id: 11, name: 'All' },
      { id: 12, name: 'Low (₹0-150)' },
      { id: 13, name: 'Medium (₹150-275)' },
      { id: 14, name: 'High (₹275+)' },
    ],
  },
  {
    id: 2,
    name: 'Product',
    type: 'MULTI_SELECT',
    values: [
      { id: 21, name: 'Fruit' },
      { id: 22, name: 'Vegetable' },
    ],
  },
];

export const PAGE_ITEMS = 100;

export const UA = 'FngApp/1.0 (contact: prateekpatnaik823@gmail.com)';
