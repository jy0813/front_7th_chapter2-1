import { CartItem } from '@/components/cart/CartItem.js';

export const CartItemList = (items, checkedItems = new Set()) => {
  return /* HTML */ `
    <div class="flex-1 overflow-y-auto min-h-0">
      <div class="p-4 space-y-4">
        ${items
          .map((item) => CartItem(item, checkedItems.has(item.id)))
          .join('')}
      </div>
    </div>
  `;
};
