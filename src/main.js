import { getCategories, getProduct, getProducts } from '@/api/productApi';
import { DetailPage } from '@/pages/DetailPage';
import { HomePage } from '@/pages/HomePage';
import {
  initInfiniteScroll,
  cleanupInfiniteScroll,
} from '@/utils/infiniteScroll';

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
  // 페이지 전환 시 기존 무한 스크롤 정리
  cleanupInfiniteScroll();

  const $root = document.querySelector('#root');
  const url = new URL(window.location);
  const limit = parseInt(url.searchParams.get('limit')) || 20;
  let page = parseInt(url.searchParams.get('current')) || 1;
  const search = url.searchParams.get('search') || '';
  const category1 = url.searchParams.get('category1') || '';
  const category2 = url.searchParams.get('category2') || '';
  const sort = url.searchParams.get('sort') || 'price_asc';

  if (window.location.pathname === `${import.meta.env.BASE_URL}`) {
    // 무한 스크롤을 위해 항상 1페이지부터 시작
    page = 1;
    url.searchParams.set('current', '1');
    window.history.replaceState(null, '', url);

    $root.innerHTML = HomePage({
      loading: true,
      pagination: { limit, page },
      filters: { sort, search, category1, category2 },
    });

    const productsData = await getProducts({
      limit,
      page,
      search,
      category1,
      category2,
      sort,
    });

    const categoriesData = await getCategories();
    $root.innerHTML = HomePage({
      loading: false,
      ...productsData,
      categories: categoriesData,
    });

    // 홈 페이지에서만 무한 스크롤 초기화
    initInfiniteScroll({
      limit,
      page,
      search,
      category1,
      category2,
      sort,
    });
  } else {
    const productId = window.location.pathname.split('/products/')[1];
    $root.innerHTML = DetailPage({ loading: true });
    const data = await getProduct(productId);
    $root.innerHTML = DetailPage({ loading: false, product: data });
  }
};

document.body.addEventListener('click', (e) => {
  const $target = e.target;

  if ($target.closest('.product-card')) {
    const productId = $target.closest('.product-card').dataset.productId;
    push(`${import.meta.env.BASE_URL}products/${productId}`);
    render();
  }
});

window.addEventListener('popstate', render);

document.body.addEventListener('change', (e) => {
  const $target = e.target;

  if ($target.id === 'limit-select') {
    const newLimit = parseInt($target.value);
    const url = new URL(window.location);
    url.searchParams.set('limit', newLimit);
    url.searchParams.set('current', '1');
    history.pushState(null, null, url);
    render();
  }
});

document.body.addEventListener('change', (e) => {
  const $target = e.target;

  if ($target.id === 'sort-select') {
    const newSort = $target.value;
    const url = new URL(window.location);
    url.searchParams.set('sort', newSort);
    url.searchParams.set('current', '1');
    history.pushState(null, null, url);
    render();
  }
});

// 검색 이벤트 처리
document.body.addEventListener('keypress', (e) => {
  const $target = e.target;

  if ($target.id === 'search-input' && e.key === 'Enter') {
    const searchValue = $target.value.trim();
    const url = new URL(window.location);
    if (searchValue) {
      url.searchParams.set('search', searchValue);
    } else {
      url.searchParams.delete('search');
    }
    url.searchParams.set('current', '1');
    history.pushState(null, null, url);
    render();
  }
});

// 카테고리 필터 이벤트 처리
document.body.addEventListener('click', (e) => {
  const $target = e.target;

  // 1depth 카테고리 필터
  if ($target.classList.contains('category1-filter-btn')) {
    const category1 = $target.dataset.category1;
    const url = new URL(window.location);
    url.searchParams.set('category1', category1);
    url.searchParams.delete('category2');
    url.searchParams.set('current', '1');
    history.pushState(null, null, url);
    render();
  }

  // 2depth 카테고리 필터
  if ($target.classList.contains('category2-filter-btn')) {
    const category1 = $target.dataset.category1;
    const category2 = $target.dataset.category2;
    const url = new URL(window.location);
    url.searchParams.set('category1', category1);
    url.searchParams.set('category2', category2);
    url.searchParams.set('current', '1');
    history.pushState(null, null, url);
    render();
  }

  // 브레드크럼 리셋
  if ($target.dataset.breadcrumb === 'reset') {
    const url = new URL(window.location);
    url.searchParams.delete('category1');
    url.searchParams.delete('category2');
    url.searchParams.set('current', '1');
    history.pushState(null, null, url);
    render();
  }

  // 브레드크럼 category1
  if ($target.dataset.breadcrumb === 'category1') {
    const category1 = $target.dataset.category1;
    const url = new URL(window.location);
    url.searchParams.set('category1', category1);
    url.searchParams.delete('category2');
    url.searchParams.set('current', '1');
    history.pushState(null, null, url);
    render();
  }
});

const main = () => {
  render();
};

// 애플리케이션 시작
if (import.meta.env.MODE !== 'test') {
  enableMocking().then(main);
} else {
  main();
}
