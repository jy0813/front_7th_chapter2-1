import {
  ProductListItem,
  ProductSkeleton,
  ListLoadingSpinner,
} from '@/components';

export const ProductList = ({ loading, products, total }) => {
  return /* HTML */ `
    <!-- 상품 목록 -->
    <div class="mb-6">
      <div>
        ${loading
          ? /* HTML */ `
              <!-- 상품 그리드 -->
              <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
                ${ProductSkeleton().repeat(4)}
              </div>
              ${ListLoadingSpinner()}
            `
          : /* HTML */ `
              <!-- 상품 개수 정보 -->
              <div class="mb-4 text-sm text-gray-600">
                총
                <span class="font-medium text-gray-900">${total}개</span>의 상품
              </div>
              <!-- 상품 그리드 -->
              <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
                ${products.map(ProductListItem).join('')}
              </div>

              <!-- 무한 스크롤 트리거 요소 (Intersection Observer가 감시) -->
              <div id="infinite-scroll-trigger" class="h-4"></div>

              <!-- 추가 로딩 중 표시 -->
              <div
                id="infinite-scroll-loading"
                style="display: none;"
                class="mb-4"
              >
                <div class="grid grid-cols-2 gap-4 mb-4">
                  ${ProductSkeleton().repeat(2)}
                </div>
                ${ListLoadingSpinner()}
              </div>

              <!-- 모든 상품 로드 완료 메시지 -->
              <div
                id="infinite-scroll-end"
                class="text-center py-4 text-sm text-gray-500"
                style="display: none;"
              >
                모든 상품을 확인했습니다
              </div>
            `}
      </div>
    </div>
  `;
};
