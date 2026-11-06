import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Heart,
  Search,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import type { Product } from "../types/product";
import { fetchProducts } from "../services/catalog";
import LazyImage from "../components/common/LazyImage";

const Shop = () => {
  const { addToCart, cartItems } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setSearch(searchParams.get("q") || "");
    setSelectedCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((rows) => {
        if (!active) return;
        setProducts(rows.map((row) => {
          const listPrice = Number(row.price);
          const sellingPrice = row.discount_price == null ? listPrice : Number(row.discount_price);
          return {
            id: row.id,
            name: row.name,
            category: row.category_name || "Furniture",
            price: sellingPrice,
            oldPrice: sellingPrice < listPrice ? listPrice : undefined,
            discount: sellingPrice < listPrice ? Math.round((1 - sellingPrice / listPrice) * 100) : undefined,
            image: row.image_url || "/images-webp/cupboard1.webp",
            description: row.short_description || "",
          };
        }));
        setLoadError(false);
      })
      .catch(() => { if (active) setLoadError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((product) => product.category)))], [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        searchValue === "" ||
        product.name.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue) ||
        (product.description ?? "").toLowerCase().includes(searchValue);

      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sortBy === "name") {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [products, search, selectedCategory, sortBy]);

  const getCartQuantity = (productId: number) => {
    const item = cartItems.find((item) => item.id === productId);
    return item?.quantity ?? 0;
  };

  const handleWishlist = (
    product: Product
  ) => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
    });
  };

  return (
    <main className="shop-page">
      {/* Header */}
      <section className="shop-hero">
        <div className="shop-hero-content">
          <p className="shop-eyebrow">THE COLLECTION</p>

          <h1>Furniture for the way you live.</h1>

          <p className="shop-description">
            Discover thoughtfully designed furniture made to bring comfort,
            character and timeless style to your home.
          </p>
        </div>
      </section>

      {/* Shop Controls */}
      <section className="shop-section">
        <div className="shop-toolbar">
          <div className="shop-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search furniture..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="shop-sort">
            <SlidersHorizontal size={17} />

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="shop-categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                selectedCategory === category
                  ? "shop-category active"
                  : "shop-category"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Result Header */}
        <div className="shop-results-header">
          <div>
            <p className="shop-result-label">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "PRODUCT"
                : "PRODUCTS"}
            </p>

            <h2>
              {selectedCategory === "All"
                ? "All Furniture"
                : selectedCategory}
            </h2>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? <div className="shop-empty" aria-busy="true">Loading products…</div> : loadError ? <div className="shop-empty" role="status"><h3>Products are temporarily unavailable</h3><p>Please try again in a moment.</p></div> : filteredProducts.length > 0 ? (
          <div className="shop-product-grid">
            {filteredProducts.map((product) => {
              const isLiked = isInWishlist(product.id);
              const quantity = getCartQuantity(product.id);

              return (
                <article
                  className="shop-product-card"
                  key={product.id}
                >
                  {/* Image */}
                  <div className="shop-product-image">
                    <Link to={`/product/${product.id}`}>
                      <LazyImage
                        src={product.image}
                        alt={product.name}
                      />
                    </Link>

                    {product.discount && (
                      <span className="shop-discount">
                        {product.discount}% OFF
                      </span>
                    )}

                    {/* Wishlist */}
                    <button
                      type="button"
                      className={`shop-wishlist ${
                        isLiked ? "liked" : ""
                      }`}
                      aria-label={
                        isLiked
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      onClick={() => handleWishlist(product)}
                    >
                      <Heart
                        size={19}
                        fill={
                          isLiked
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="shop-product-details">
                    <p className="shop-product-category">
                      {product.category}
                    </p>

                    <Link
                      to={`/product/${product.id}`}
                      className="shop-product-name"
                    >
                      {product.name}
                    </Link>

                    <div className="shop-product-price">
                      <strong>
                        ₹{product.price.toLocaleString("en-IN")}
                      </strong>

                      {product.oldPrice && (
                        <span>
                          ₹
                          {product.oldPrice.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      )}
                    </div>

                    {/* Add To Cart */}
                    <button
                      type="button"
                      className="shop-add-cart"
                      onClick={() =>
                        addToCart({
                          id: product.id,
                          name: product.name,
                          category: product.category,
                          price: product.price,
                          oldPrice: product.oldPrice,
                          image: product.image,
                        })
                      }
                    >
                      <ShoppingCart size={17} />

                      {quantity > 0
                        ? `Added to Cart (${quantity})`
                        : "Add to Cart"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="shop-empty">
            <Search size={34} />

            <h3>No products found</h3>

            <p>
              Try changing your search or selecting a
              different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setSortBy("featured");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Shop;
