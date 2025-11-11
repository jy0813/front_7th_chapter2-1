import { SearchForm, ProductList } from '@/components';
import { Layout } from '@/pages/Layout';

export const HomePage = ({
  filters,
  pagination,
  products,
  loading,
  categories,
}) => {
  return Layout({
    children: /* HTML */ `
      ${SearchForm({ filters, pagination, categories })}
      ${ProductList({ loading, products })}
    `,
  });
};
