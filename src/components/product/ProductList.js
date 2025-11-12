import {
  ProductListItem,
  ProductSkeleton,
  ListLoadingSpinner,
  ProductError,
} from '@/components';

export const ProductList = ({ loading, products, total, error }) => {
  return /* HTML */ `
    <!-- 상품 목록 -->
    <div class="mb-6">
      <div>
        ${error
          ? ProductError(error)
          : loading
            ? /* HTML */ `
                <!-- 상품 그리드 -->
                <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
                  ${ProductSkeleton().repeat(4)}
                </div>
                ${ListLoadingSpinner()}
              `
            : products && products.length > 0
              ? /* HTML */ `
                  <!-- 상품 개수 정보 -->
                  <div class="mb-4 text-sm text-gray-600">
                    총
                    <span class="font-medium text-gray-900">${total}개</span>의
                    상품
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
                `
              : /* HTML */ `
                  <!-- 검색 결과 없음 -->
                  <div class="text-center py-20">
                    <div class="text-gray-400 mb-4">
                      <svg
                        class="mx-auto h-12 w-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">
                      상품을 찾을 수 없습니다.
                    </h3>
                    <p class="text-gray-600">다른 검색어로 시도해보세요.</p>
                  </div>
                `}
      </div>
    </div>
  `;
};
