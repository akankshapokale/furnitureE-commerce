import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type WishlistProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
};

type WishlistContextType = {
  wishlistItems: WishlistProduct[];
  wishlistCount: number;
  isInWishlist: (productId: number) => boolean;
  addToWishlist: (product: WishlistProduct) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (product: WishlistProduct) => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const STORAGE_KEY = "furniture_wishlist";

const readSavedWishlist = (): WishlistProduct[] => {
  try {
    const savedWishlist = localStorage.getItem(STORAGE_KEY);
    if (!savedWishlist) return [];

    const parsed: unknown = JSON.parse(savedWishlist);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is WishlistProduct =>
          item && typeof item === "object" &&
          typeof item.id === "number" &&
          typeof item.name === "string" &&
          typeof item.category === "string" &&
          typeof item.price === "number" &&
          typeof item.image === "string",
        )
      : [];
  } catch {
    return [];
  }
};

const saveWishlist = (items: WishlistProduct[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Keep the current wishlist in memory if browser storage is unavailable.
  }
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>(readSavedWishlist);

  useEffect(() => {
    saveWishlist(wishlistItems);
  }, [wishlistItems]);

  const wishlistCount = wishlistItems.length;

  const isInWishlist = (productId: number) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const addToWishlist = (product: WishlistProduct) => {
    if (wishlistItems.some((item) => item.id === product.id)) return;
    const next = [...wishlistItems, product];
    saveWishlist(next);
    setWishlistItems(next);
  };

  const removeFromWishlist = (productId: number) => {
    const next = wishlistItems.filter((item) => item.id !== productId);
    saveWishlist(next);
    setWishlistItems(next);
  };

  const toggleWishlist = (product: WishlistProduct) => {
    const exists = wishlistItems.some((item) => item.id === product.id);
    const next = exists
      ? wishlistItems.filter((item) => item.id !== product.id)
      : [...wishlistItems, product];
    saveWishlist(next);
    setWishlistItems(next);
  };

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
    }),
    [wishlistItems, wishlistCount]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
};
