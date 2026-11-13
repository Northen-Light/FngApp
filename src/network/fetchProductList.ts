import { FilterOptions, Product } from '../types';

const data: Product[] = require('../mockData/fruits_vegetables_500.json');

type FetchProductListResponse = {
  data: Product[];
  pageEnd: boolean;
};

export const fetchProductList = (
  pageNumber: number,
  pageItems: number = 50,
  filterOptions: FilterOptions[] = [],
  controller?: AbortController,
): Promise<FetchProductListResponse> => {
  return new Promise((res, rej) => {
    let filteredData = [...data];

    if (filterOptions[0].filterValueIds.includes(12)) {
      filteredData = [...data.filter(d => d.price <= 150)];
    } else if (filterOptions[0].filterValueIds.includes(13)) {
      filteredData = [...data.filter(d => d.price > 150 && d.price <= 275)];
    } else if (filterOptions[0].filterValueIds.includes(14)) {
      filteredData = [...data.filter(d => d.price > 275)];
    }

    if (
      filterOptions[1].filterValueIds.includes(21) ||
      filterOptions[1].filterValueIds.includes(22)
    ) {
      filteredData = [
        ...filteredData.filter(
          d =>
            (filterOptions[1].filterValueIds.includes(21) &&
              d.type === 'fruit') ||
            (filterOptions[1].filterValueIds.includes(22) &&
              d.type === 'vegetable'),
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
