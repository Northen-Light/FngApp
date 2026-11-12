import { Product } from '../screens/ProductLanding';

const products: Product[] = require('../mockData/fruits_vegetables_500.json');

export const queryItems = (
  text: string,
  abortController: AbortController,
): Promise<Product[]> => {
  const signal = abortController.signal;

  const result = products.filter(product =>
    product.name.toLowerCase().includes(text.toLowerCase()),
  );

  const delay = Math.floor(Math.random() * 5) * 1000;

  return new Promise((res, rej) => {
    const timer = setTimeout(() => res(result), delay);

    const handleAbort = () => {
      clearTimeout(timer);
      rej(new Error('Query Call Aborted'));
    };

    signal.addEventListener('abort', handleAbort, { once: true });
  });
};
