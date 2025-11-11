import {
  ProductListItem,
  ProductSkeleton,
  ListLoadingSpinner,
} from '@/components';

export const ProductList = ({ loading, products }) => {
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
                <span class="font-medium text-gray-900"
                  >${products.length}개</span
                >의 상품
              </div>
              <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
                ${products.map(ProductListItem).join('')}
              </div>
            `}
      </div>
    </div>
  `;
};
