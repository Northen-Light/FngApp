import type { Product } from '../screens/ProductLanding';

const data: Product[] = require('../mockData/fruits_vegetables_500.json');

type FetchProductListResponse = {
  data: Product[];
  pageEnd: boolean;
};

export const fetchProductList = (
  pageNumber: number,
  pageItems: number = 50,
): Promise<FetchProductListResponse> => {
  return new Promise(res => {
    const start = pageNumber * pageItems;
    const end = Math.min(start + pageItems, 500);

    setTimeout(() => {
      res({
        data: data.slice(start, end),
        pageEnd: end === 500,
      });
    }, 2000);
  });
};
