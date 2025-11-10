import { Rating } from '@/components';

const ProductListItem = ({ productId, title, image, lprice }) => {
  return /* HTML */ `
    <div
      class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
      data-product-id="${productId}"
    >
      <!-- 상품 이미지 -->
      <div
        class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image"
      >
        <img
          src="${image}"
          alt="${title}"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>
      <!-- 상품 정보 -->
      <div class="p-3">
        <div class="cursor-pointer product-info mb-3">
          <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
            ${title}
          </h3>
          <p class="text-xs text-gray-500 mb-2"></p>
          <p class="text-lg font-bold text-gray-900">
            ${Number(lprice).toLocaleString()}원
          </p>
        </div>
        <!-- 장바구니 버튼 -->
        <button
          class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
                hover:bg-blue-700 transition-colors add-to-cart-btn"
          data-product-id="${productId}"
        >
          장바구니 담기
        </button>
      </div>
    </div>
  `;
};

const ProductDetailItem = ({
  productId,
  title,
  image,
  lprice,
  stock,
  description,
  rating,
  reviewCount,
}) => {
  return /* HTML */ `
    <!-- 상품 상세 정보 -->
    <div class="bg-white rounded-lg shadow-sm mb-6">
      <!-- 상품 이미지 -->
      <div class="p-4">
        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img
            src="${image}"
            alt="${title}"
            class="w-full h-full object-cover product-detail-image"
          />
        </div>
        <!-- 상품 정보 -->
        <div>
          <p class="text-sm text-gray-600 mb-1"></p>
          <h1 class="text-xl font-bold text-gray-900 mb-3">${title}</h1>
          <!-- 평점 및 리뷰 -->
          <div class="flex items-center mb-3">
            ${Rating({ rating })}
            <span class="ml-2 text-sm text-gray-600"
              >${(rating ?? 0).toFixed(1)} (${reviewCount}개 리뷰)</span
            >
          </div>
          <!-- 가격 -->
          <div class="mb-4">
            <span class="text-2xl font-bold text-blue-600"
              >${Number(lprice).toLocaleString()}원</span
            >
          </div>
          <!-- 재고 -->
          <div class="text-sm text-gray-600 mb-4">재고 ${stock}개</div>
          <!-- 설명 -->
          <div class="text-sm text-gray-700 leading-relaxed mb-6">
            ${description}
          </div>
        </div>
      </div>
      <!-- 수량 선택 및 액션 -->
      <div class="border-t border-gray-200 p-4">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-gray-900">수량</span>
          <div class="flex items-center">
            <button
              id="quantity-decrease"
              class="w-8 h-8 flex items-center justify-center border border-gray-300 
                   rounded-l-md bg-gray-50 hover:bg-gray-100"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 12H4"
                ></path>
              </svg>
            </button>
            <input
              type="number"
              id="quantity-input"
              value="1"
              min="1"
              max="107"
              class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
                  focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              id="quantity-increase"
              class="w-8 h-8 flex items-center justify-center border border-gray-300 
                   rounded-r-md bg-gray-50 hover:bg-gray-100"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- 액션 버튼 -->
        <button
          id="add-to-cart-btn"
          data-product-id="${productId}"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
                 hover:bg-blue-700 transition-colors font-medium"
        >
          장바구니 담기
        </button>
      </div>
    </div>
  `;
};

export { ProductListItem, ProductDetailItem };
