const CART_KEY = 'shopping_cart';

export const getCartData = () => {
  const defaultData = {
    items: [],
    selectedAll: false,
  };

  try {
    const data = localStorage.getItem(CART_KEY);
    if (!data) return defaultData;

    const parsed = JSON.parse(data);

    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      selectedAll: Boolean(parsed.selectedAll),
    };
  } catch {
    return defaultData;
  }
};

const saveCartData = (data) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('장바구니 저장 실패:', error);
  }
};

export const addToCart = (product, quantity = 1) => {
  const data = getCartData();
  const existingItem = data.items.find((item) => item.id === product.productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    data.items.push({
      id: product.productId,
      quantity,
      selected: false,
      title: product.title,
      image: product.image,
      lprice: product.lprice,
    });
  }

  saveCartData(data);
  return data.items;
};

export const updateCartQuantity = (productId, quantity) => {
  const data = getCartData();
  const item = data.items.find((item) => item.id === productId);

  if (!item) return data.items;

  if (quantity <= 0) {
    data.items = data.items.filter((item) => item.id !== productId);
  } else {
    item.quantity = quantity;
  }

  saveCartData(data);
  return data.items;
};

export const removeFromCart = (productId) => {
  const data = getCartData();
  data.items = data.items.filter((item) => item.id !== productId);
  saveCartData(data);
  return data.items;
};

export const removeSelectedItems = () => {
  const data = getCartData();
  data.items = data.items.filter((item) => !item.selected);
  data.selectedAll = false;
  saveCartData(data);
  return data.items;
};

export const clearCart = () => {
  const data = { items: [], selectedAll: false };
  saveCartData(data);
  return [];
};

export const toggleCartItemSelection = (productId) => {
  const data = getCartData();
  const item = data.items.find((item) => item.id === productId);

  if (item) {
    item.selected = !item.selected;

    data.selectedAll = data.items.every((item) => item.selected);

    saveCartData(data);
  }

  return data.items;
};

export const toggleSelectAll = () => {
  const data = getCartData();
  const newSelectedAll = !data.selectedAll;

  data.items.forEach((item) => {
    item.selected = newSelectedAll;
  });

  data.selectedAll = newSelectedAll;
  saveCartData(data);

  return data;
};

export const getSelectedItems = () => {
  return getCartData().items.filter((item) => item.selected);
};

export const getCartItemsLength = () => {
  return getCartData().items.length;
};
