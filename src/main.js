import { getCategories, getProduct, getProducts } from '@/api/productApi';
import { DetailPage } from '@/pages/DetailPage';
import { HomePage } from '@/pages/HomePage';
import {
  initInfiniteScroll,
  cleanupInfiniteScroll,
} from '@/utils/infiniteScroll';
import {
  addToCart,
  getCartData,
  updateCartQuantity,
  removeFromCart,
  toggleCartItemSelection,
  removeSelectedItems,
  toggleSelectAll,
  clearCart,
  getSelectedItems,
} from '@/utils/cart';
import { showToast } from '@/components';
import { CartModal } from '@/components/cart';
import { Header } from '@/components/layout/Header';

//TODO: 캐싱 전략 고민
//TODO: 라이프사이클 관리 고민

// 만약 캐시한다면?? (임시)
// let categoriesCache = null;
// let productsCache = {}; // 필터별 products 캐시

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

// 장바구니 모달 렌더링
const renderCartModal = () => {
  const cartData = getCartData();
  const selectedItems = getSelectedItems();
  const checkedItems = new Set(selectedItems.map((item) => item.id));

  // 가격 계산
  const selectedCount = selectedItems.length;
  const selectedPrice = selectedItems.reduce(
    (sum, item) => sum + item.lprice * item.quantity,
    0,
  );
  const totalPrice = cartData.items.reduce(
    (sum, item) => sum + item.lprice * item.quantity,
    0,
  );

  // 장바구니 아이템 포맷 변환
  const formattedItems = cartData.items.map((item) => ({
    id: item.id,
    image: item.image,
    title: item.title,
    price: item.lprice,
    quantity: item.quantity,
    totalPrice: item.lprice * item.quantity,
  }));

  // 모달 HTML 생성
  const modalHTML = CartModal({
    items: formattedItems,
    checkedItems,
    selectedCount,
    selectedPrice,
    totalPrice,
    isAllSelected: cartData.selectedAll,
  });

  // 기존 모달이 있다면 제거
  const existingModal = document.querySelector('.cart-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // footer 요소를 찾아서 그 앞에 모달 추가 (main의 형제 요소로)
  const footer = document.querySelector('footer');
  if (footer) {
    footer.insertAdjacentHTML('beforebegin', modalHTML);
  }

  // body 스크롤 방지
  document.body.style.overflow = 'hidden';
};

// 장바구니 모달 닫기
const closeCartModal = () => {
  const modal = document.querySelector('.cart-modal');
  if (modal) {
    modal.remove();
    // body 스크롤 복원
    document.body.style.overflow = '';
  }
};

// 장바구니 모달 새로고침 (데이터 변경 후 UI 업데이트)
const refreshCartModal = () => {
  const modal = document.querySelector('.cart-modal');
  if (modal) {
    renderCartModal();
  }
};

// 헤더 업데이트 (장바구니 배지 업데이트)
const updateHeader = () => {
  const header = document.querySelector('header');
  if (header) {
    header.outerHTML = Header();
  }
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
  // 공통 상태 객체 추출
  const pageState = {
    pagination: { limit, page },
    filters: { sort, search, category1, category2 },
  };

  const queryParams = { limit, page, search, category1, category2, sort };

  if (window.location.pathname === `${import.meta.env.BASE_URL}`) {
    // 무한 스크롤을 위해 항상 1페이지부터 시작
    page = 1;
    url.searchParams.set('current', '1');
    window.history.replaceState(null, '', url);

    // 로딩 상태 렌더링
    $root.innerHTML = HomePage({
      loading: true,
      ...pageState,
    });

    try {
      // 병렬 API 호출
      const [productsData, categoriesData] = await Promise.all([
        getProducts(queryParams),
        getCategories(),
      ]);

      // 필요한 데이터만 구조분해
      const { products, pagination } = productsData;
      const { filters } = pageState;

      // 완료 상태 렌더링
      $root.innerHTML = HomePage({
        loading: false,
        categories: categoriesData,
        products,
        pagination,
        filters,
      });

      // 홈 페이지에서만 무한 스크롤 초기화
      initInfiniteScroll(queryParams);
    } catch (error) {
      // 에러 상태 렌더링
      $root.innerHTML = HomePage({
        loading: false,
        error: error.message || '데이터를 불러오는데 실패했습니다.',
        ...pageState,
      });
    }
  } else {
    const productId = window.location.pathname.split('/product/')[1];
    $root.innerHTML = DetailPage({ loading: true });
    const data = await getProduct(productId);
    $root.innerHTML = DetailPage({ loading: false, product: data });
  }
};

document.body.addEventListener('click', (e) => {
  const $target = e.target;

  // 재시도 버튼 클릭
  if ($target.closest('#retry-btn')) {
    e.stopPropagation();

    // 로딩 상태로 다시 렌더링
    const $root = document.querySelector('#root');
    const url = new URL(window.location);
    const limit = parseInt(url.searchParams.get('limit')) || 20;
    const page = 1;
    const search = url.searchParams.get('search') || '';
    const category1 = url.searchParams.get('category1') || '';
    const category2 = url.searchParams.get('category2') || '';
    const sort = url.searchParams.get('sort') || 'price_asc';

    const pageState = {
      pagination: { limit, page },
      filters: { sort, search, category1, category2 },
    };

    const queryParams = { limit, page, search, category1, category2, sort };

    $root.innerHTML = HomePage({
      loading: true,
      ...pageState,
    });

    // API 재호출
    Promise.all([getProducts(queryParams), getCategories()])
      .then(([productsData, categoriesData]) => {
        const { products, pagination } = productsData;
        const { filters } = pageState;

        $root.innerHTML = HomePage({
          loading: false,
          categories: categoriesData,
          products,
          pagination,
          filters,
        });

        initInfiniteScroll(queryParams);
      })
      .catch((error) => {
        $root.innerHTML = HomePage({
          loading: false,
          error: error.message || '데이터를 불러오는데 실패했습니다.',
          ...pageState,
        });
      });

    return;
  }

  // 장바구니 아이콘 클릭
  if ($target.closest('#cart-icon-btn')) {
    e.stopPropagation();
    renderCartModal();
    return;
  }

  // 장바구니 모달 닫기
  if ($target.closest('#cart-modal-close-btn')) {
    e.stopPropagation();
    closeCartModal();
    return;
  }

  // 장바구니 모달 오버레이 클릭
  if ($target.classList.contains('cart-modal-overlay')) {
    closeCartModal();
    return;
  }

  // 장바구니 전체 선택 체크박스 클릭
  if ($target.id === 'cart-modal-select-all-checkbox') {
    toggleSelectAll();
    refreshCartModal();
    return;
  }

  // 장바구니 아이템 체크박스 클릭
  if ($target.classList.contains('cart-item-checkbox')) {
    const productId = $target.dataset.productId;
    toggleCartItemSelection(productId);
    refreshCartModal();
    return;
  }

  // 선택한 상품 삭제
  if ($target.closest('#cart-modal-remove-selected-btn')) {
    e.stopPropagation();
    const selectedItems = getSelectedItems();

    if (selectedItems.length > 0) {
      removeSelectedItems();
      refreshCartModal();
      updateHeader();
      showToast('선택된 상품들이 삭제되었습니다.', 'info');
    }
    return;
  }

  // 장바구니 비우기
  if ($target.closest('#cart-modal-clear-cart-btn')) {
    e.stopPropagation();
    clearCart();
    refreshCartModal();
    updateHeader();
    showToast('장바구니가 비워졌습니다.', 'info');
    return;
  }

  // 장바구니 수량 증가
  if ($target.closest('.quantity-increase-btn')) {
    e.stopPropagation();
    const button = $target.closest('.quantity-increase-btn');
    const productId = button.dataset.productId;
    const cartData = getCartData();
    const item = cartData.items.find((item) => item.id === productId);

    if (item) {
      updateCartQuantity(productId, item.quantity + 1);
      refreshCartModal();
    }
    return;
  }

  // 장바구니 수량 감소
  if ($target.closest('.quantity-decrease-btn')) {
    e.stopPropagation();
    const button = $target.closest('.quantity-decrease-btn');
    const productId = button.dataset.productId;
    const cartData = getCartData();
    const item = cartData.items.find((item) => item.id === productId);

    if (item && item.quantity > 1) {
      updateCartQuantity(productId, item.quantity - 1);
      refreshCartModal();
    }
    return;
  }

  // 장바구니 아이템 삭제
  if ($target.closest('.cart-item-remove-btn')) {
    e.stopPropagation();
    const button = $target.closest('.cart-item-remove-btn');
    const productId = button.dataset.productId;

    removeFromCart(productId);
    refreshCartModal();
    updateHeader();
    showToast('상품이 삭제되었습니다.', 'info');
    return;
  }

  if ($target.closest('.add-to-cart-btn')) {
    e.stopPropagation();
    const button = $target.closest('.add-to-cart-btn');

    const product = {
      productId: button.dataset.productId,
      title: button.dataset.productTitle,
      image: button.dataset.productImage,
      lprice: button.dataset.productPrice,
    };

    addToCart(product, 1);
    updateHeader();
    showToast('장바구니에 추가되었습니다.', 'success');

    return;
  }

  if ($target.closest('.product-card')) {
    const productId = $target.closest('.product-card').dataset.productId;
    push(`${import.meta.env.BASE_URL}product/${productId}`);
    render();
  }
});

window.addEventListener('popstate', render);

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.querySelector('.cart-modal');
    if (modal) {
      closeCartModal();
    }
  }
});

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
