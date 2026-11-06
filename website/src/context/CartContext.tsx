import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  variantId?: number;
  variantName?: string;
  customSizeRequestId?: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartProduct[];
  cartCount: number;
  subtotal: number;
  isCartOpen: boolean;
  lastAddedId: number | null;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    product: Omit<CartProduct, "quantity">,
    quantity?: number
  ) => void;
  removeFromCart: (id: number, variantId?: number, variantName?: string) => void;
  increaseQuantity: (id: number, variantId?: number, variantName?: string) => void;
  decreaseQuantity: (id: number, variantId?: number, variantName?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

const CART_STORAGE_KEY = "furniture_cart";

const readSavedCart = (): CartProduct[] => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!savedCart) return [];

    const parsed: unknown = JSON.parse(savedCart);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is CartProduct =>
          item && typeof item === "object" &&
          typeof item.id === "number" &&
          typeof item.name === "string" &&
          typeof item.category === "string" &&
          typeof item.price === "number" &&
          typeof item.image === "string" &&
          typeof item.quantity === "number" && item.quantity > 0,
        )
      : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartProduct[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Keep cart changes in memory if browser storage is unavailable.
  }
};

export const CartProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [cartItems, setCartItems] = useState<CartProduct[]>(readSavedCart);

  const [isCartOpen, setIsCartOpen] = useState(
    // Once the cart panel is in use it stays: reopen it on load if there are items
    () => cartItems.length > 0
  );
  const [lastAddedId, setLastAddedId] = useState<number | null>(null);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  /* Save cart in localStorage */
  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  /* Add product */
  const addToCart = (
    product: Omit<CartProduct, "quantity">,
    quantity = 1
  ) => {
    setLastAddedId(product.id);
    setIsCartOpen(true);

    setCartItems((currentItems) => {
      const existingProduct = currentItems.find(
        (item) => item.id === product.id && item.variantId === product.variantId && item.variantName === product.variantName
      );

      let nextItems: CartProduct[];
      if (existingProduct) {
        nextItems = currentItems.map((item) =>
          item.id === product.id && item.variantId === product.variantId && item.variantName === product.variantName
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      } else {
        nextItems = [
          ...currentItems,
          {
            ...product,
            quantity,
          },
        ];
      }
      saveCart(nextItems);
      return nextItems;
    });
  };

  /* Remove product */
  const removeFromCart = (id: number, variantId?: number, variantName?: string) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id || item.variantId !== variantId || item.variantName !== variantName)
    );
  };

  /* Increase quantity */
  const increaseQuantity = (id: number, variantId?: number, variantName?: string) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id && item.variantId === variantId && item.variantName === variantName
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  /* Decrease quantity */
  const decreaseQuantity = (id: number, variantId?: number, variantName?: string) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id && item.variantId === variantId && item.variantName === variantName
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  /* Clear cart */
  const clearCart = () => {
    setCartItems([]);
  };

  /* Total number of products */
  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cartItems]);

  /* Cart subtotal */
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        isCartOpen,
        lastAddedId,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};
