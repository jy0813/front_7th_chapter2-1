import { getProducts } from '@/api/productApi';
import { ProductListItem } from '@/components';

// 무한 스크롤 상태 관리
const infiniteScrollState = {
  currentPage: 1,
  isLoading: false,
  hasMore: true,
  observer: null,
  currentFilters: {},
};

// 추가 상품 로드 함수
const loadMoreProducts = async () => {
  if (infiniteScrollState.isLoading || !infiniteScrollState.hasMore) {
    return;
  }

  infiniteScrollState.isLoading = true;

  // 로딩 UI 표시
  const loadingEl = document.querySelector('#infinite-scroll-loading');
  if (loadingEl) loadingEl.style.display = 'block';

  try {
    const nextPage = infiniteScrollState.currentPage + 1;
    const params = {
      ...infiniteScrollState.currentFilters,
      page: nextPage,
    };

    const data = await getProducts(params);

    if (data.products && data.products.length > 0) {
      // 상품 목록에 추가
      appendProducts(data.products);
      infiniteScrollState.currentPage = nextPage;

      // URL의 current 파라미터 업데이트 (새로고침 시 현재 페이지 유지)
      updateUrlCurrentPage(nextPage);

      // 더 이상 데이터가 없는지 확인
      const limit = params.limit || 20;
      if (data.products.length < limit) {
        infiniteScrollState.hasMore = false;
        showEndMessage();
      }
    } else {
      infiniteScrollState.hasMore = false;
      showEndMessage();
    }
  } catch (error) {
    console.error('상품 로드 실패:', error);
  } finally {
    infiniteScrollState.isLoading = false;
    // 로딩 UI 숨김
    const loadingEl = document.querySelector('#infinite-scroll-loading');
    if (loadingEl) loadingEl.style.display = 'none';
  }
};

// DOM에 상품 추가
const appendProducts = (newProducts) => {
  const grid = document.querySelector('#products-grid');
  if (!grid) return;

  newProducts.forEach((product) => {
    const productHTML = ProductListItem(product);
    grid.insertAdjacentHTML('beforeend', productHTML);
  });
};

// URL의 current 파라미터 업데이트
const updateUrlCurrentPage = (page) => {
  const url = new URL(window.location);
  url.searchParams.set('current', page.toString());
  // pushState 대신 replaceState 사용 (브라우저 히스토리에 추가하지 않음)
  window.history.replaceState(null, '', url);
};

// 모든 상품 로드 완료 메시지 표시
const showEndMessage = () => {
  const endEl = document.querySelector('#infinite-scroll-end');
  const triggerEl = document.querySelector('#infinite-scroll-trigger');

  if (endEl) endEl.style.display = 'block';
  if (triggerEl) triggerEl.style.display = 'none';
};

// Intersection Observer 초기화
export const initInfiniteScroll = (filters = {}) => {
  // 기존 observer 정리
  cleanupInfiniteScroll();

  // 현재 필터 저장
  infiniteScrollState.currentFilters = filters;
  infiniteScrollState.currentPage = filters.page || 1;
  infiniteScrollState.hasMore = true;
  infiniteScrollState.isLoading = false;

  // 센티널 요소 찾기
  const sentinel = document.querySelector('#infinite-scroll-trigger');
  if (!sentinel) {
    console.warn('무한 스크롤 트리거 요소를 찾을 수 없습니다');
    return;
  }

  // Intersection Observer 생성
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // 요소가 화면에 보이고, 로딩 중이 아니며, 더 로드할 데이터가 있을 때
        if (
          entry.isIntersecting &&
          !infiniteScrollState.isLoading &&
          infiniteScrollState.hasMore
        ) {
          loadMoreProducts();
        }
      });
    },
    {
      root: null,
      rootMargin: '300px',
      threshold: 0.1,
    },
  );

  observer.observe(sentinel);
  infiniteScrollState.observer = observer;
};

// 무한 스크롤 정리 (메모리 누수 방지)
export const cleanupInfiniteScroll = () => {
  if (infiniteScrollState.observer) {
    infiniteScrollState.observer.disconnect();
    infiniteScrollState.observer = null;
  }

  infiniteScrollState.currentPage = 1;
  infiniteScrollState.hasMore = true;
  infiniteScrollState.isLoading = false;
  infiniteScrollState.currentFilters = {};
};
