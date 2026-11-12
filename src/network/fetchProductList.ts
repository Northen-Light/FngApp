import type { Product } from '../screens/ProductLanding';

const data: Product[] = require('../mockData/fruits_vegetables_500.json');

type FetchProductListResponse = {
  data: Product[];
  pageEnd: boolean;
};

export const fetchProductList = (
  pageNumber: number,
  pageItems: number = 50,
  filterOptions: number[] = [],
  controller?: AbortController,
): Promise<FetchProductListResponse> => {
  return new Promise((res, rej) => {
    let filteredData = [...data];

    if (filterOptions.includes(2)) {
      filteredData = [...data.filter(d => d.price <= 150)];
    } else if (filterOptions.includes(3)) {
      filteredData = [...data.filter(d => d.price > 150 && d.price <= 275)];
    } else if (filterOptions.includes(4)) {
      filteredData = [...data.filter(d => d.price > 275)];
    }

    if (filterOptions.includes(11) || filterOptions.includes(12)) {
      filteredData = [
        ...filteredData.filter(
          d =>
            (filterOptions.includes(11) && d.type === 'fruit') ||
            (filterOptions.includes(12) && d.type === 'vegetable'),
        ),
      ];
    }

    const start = pageNumber * pageItems;
    const end = Math.min(start + pageItems, filteredData.length);

    const delay = Math.floor(Math.random() * 3) * 1000;

    const timer = setTimeout(() => {
      res({
        data: filteredData.slice(start, end),
        pageEnd: end === filteredData.length,
      });
    }, delay);

    controller?.signal.addEventListener('abort', () => {
      clearTimeout(timer);
      rej(new Error('fetch Aborted'));
    });
  });
};
