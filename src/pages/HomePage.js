import { SearchForm, ProductList } from '@/components';
import { Layout } from '@/pages/Layout';

export const HomePage = ({ filters, pagination, products, loading }) => {
  return Layout({
    children: /* HTML */ `
      ${SearchForm({ filters, pagination, loading })}
      ${ProductList({ loading, products })}
    `,
  });
};
