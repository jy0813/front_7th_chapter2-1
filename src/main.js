import { getCategories, getProduct, getProducts } from '@/api/productApi';
import { DetailPage } from '@/pages/DetailPage';
import { HomePage } from '@/pages/HomePage';

const enableMocking = () =>
  import('@/mocks/browser.js').then(({ worker }) =>
    worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
    }),
  );

const push = (path) => {
  history.pushState(null, null, path);
  render();
};

const render = async () => {
  const $root = document.querySelector('#root');

  if (window.location.pathname === `${import.meta.env.BASE_URL}`) {
    $root.innerHTML = HomePage({ loading: true });
    const productsData = await getProducts();
    const categoriesData = await getCategories();
    $root.innerHTML = HomePage({
      loading: false,
      ...productsData,
      categories: categoriesData,
    });

    document.body.addEventListener('click', (e) => {
      const $target = e.target;

      if ($target.closest('.product-card')) {
        const productId = $target.closest('.product-card').dataset.productId;
        push(`${import.meta.env.BASE_URL}products/${productId}`);
        render();
      }
    });
  } else {
    const productId = window.location.pathname.split('/products/')[1];
    $root.innerHTML = DetailPage({ loading: true });
    const data = await getProduct(productId);
    $root.innerHTML = DetailPage({ loading: false, product: data });
  }
};

window.addEventListener('popstate', render);

const main = () => {
  render();
};

// 애플리케이션 시작
if (import.meta.env.MODE !== 'test') {
  enableMocking().then(main);
} else {
  main();
}
