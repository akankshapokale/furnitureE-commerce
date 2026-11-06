import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import CartDrawer from "./components/CartDrawer";
import ScrollToTop from "./components/common/ScrollToTop";
import { PageSkeleton, SectionSkeleton } from "./components/common/Skeleton";

import Hero from "./components/home/Hero";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

// Each page / below-the-fold section is its own chunk, fetched only when needed.
const Categories = lazy(() => import("./components/home/Categories"));
const HappyCustomers = lazy(() => import("./components/home/HappyCustomers"));
const ClientReviews = lazy(() => import("./components/home/ClientReviews"));

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Payment = lazy(() => import("./pages/Payment"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const Profile = lazy(() => import("./pages/Profile"));
const CustomSizeRequests = lazy(() => import("./pages/CustomSizeRequests"));
const Orders = lazy(() => import("./pages/Orders"));
const Addresses = lazy(() => import("./pages/Address"));
const Contact = lazy(() => import("./pages/Contact"));
const CategoryDetail = lazy(() => import("./pages/CategoryDetail"));
const About = lazy(() => import("./pages/About"));
const TrackOrder = lazy(() => import("./pages/track-order/TrackOrder"));

const skeletonFor = (pathname: string) => {
  if (pathname === "/shop" || pathname === "/wishlist") return <PageSkeleton variant="grid" />;
  if (pathname.startsWith("/product/")) return <PageSkeleton variant="detail" />;
  return <PageSkeleton variant="list" />;
};

const Home = () => (
  <main>
    <Hero />

    <Suspense fallback={<SectionSkeleton height={380} />}>
      <Categories />
    </Suspense>

    <Suspense fallback={<SectionSkeleton height={500} />}>
      <HappyCustomers />
    </Suspense>

    <Suspense fallback={<SectionSkeleton height={480} />}>
      <ClientReviews />
    </Suspense>

  </main>
);

const AppRoutes = () => {
  const { pathname } = useLocation();

  return (
    <Suspense fallback={skeletonFor(pathname)}>
      {/* key remounts the wrapper so every page fades in */}
      <div className="page-transition" key={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Navigate to="/" replace />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />

          {/* Account menu pages */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-custom-size-requests" element={<CustomSizeRequests />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/address" element={<Addresses />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/categories" element={<Navigate to="/" replace />} />
          <Route path="/category/:slug" element={<CategoryDetail />} />
          <Route path="/category" element={<CategoryDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/track-order" element={<TrackOrder />} />
        </Routes>
      </div>
    </Suspense>
  );
};

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <ScrollToTop />
          <Navbar />

          <div className="site-layout">
            <div className="site-content">
              <AppRoutes />
            </div>
            <CartDrawer />
          </div>

          <Footer />
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
