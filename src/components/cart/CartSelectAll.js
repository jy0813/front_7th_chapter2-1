export const CartSelectAll = (itemCount, isAllSelected = false) => {
  return /* HTML */ `
    <div class="p-4 border-b border-gray-200 bg-gray-50">
      <label class="flex items-center text-sm text-gray-700">
        <input
          type="checkbox"
          id="cart-modal-select-all-checkbox"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
          ${isAllSelected ? 'checked' : ''}
        />
        전체선택 (${itemCount}개)
      </label>
    </div>
  `;
};
