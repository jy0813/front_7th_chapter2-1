import { CartEmpty } from '@/components/cart/CartEmpty.js';
import { CartSelectAll } from '@/components/cart/CartSelectAll.js';
import { CartItemList } from '@/components/cart/CartItemList.js';

export const CartBody = (
  items,
  checkedItems = new Set(),
  isAllSelected = false,
) => {
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return /* HTML */ ` ${CartEmpty()} `;
  }

  return /* HTML */ `
    ${CartSelectAll(items.length, isAllSelected)}
    ${CartItemList(items, checkedItems)}
  `;
};
