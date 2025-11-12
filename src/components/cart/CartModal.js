import { CartHeader } from '@/components/cart/CartHeader.js';
import { CartBody } from '@/components/cart/CartBody.js';
import { CartFooter } from '@/components/cart/CartFooter.js';

export const CartModal = ({
  items = [],
  checkedItems = new Set(),
  selectedCount = 0,
  selectedPrice = 0,
  totalPrice = 0,
  isAllSelected = false,
}) => {
  return /* HTML */ `
    <div class="fixed inset-0 z-50 overflow-y-auto cart-modal">
      <!-- 배경 오버레이 -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity cart-modal-overlay"
      ></div>

      <!-- 모달 컨테이너 -->
      <div
        class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4"
      >
        <div
          class="relative bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        >
          ${CartHeader(items.length)}
          ${CartBody(items, checkedItems, isAllSelected)}
          ${items.length > 0
            ? CartFooter({ selectedCount, selectedPrice, totalPrice })
            : ''}
        </div>
      </div>
    </div>
  `;
};
