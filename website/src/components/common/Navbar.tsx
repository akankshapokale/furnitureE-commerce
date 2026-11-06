import { useState, useEffect, useRef } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ComingSoonModal from "../ComingSoonModal";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import AccountMenu from "../AccountMenu";
import { categoriesData, groupSubcategories, getCategoryHeadings } from "../../data/categoriesData";

const COMING_SOON_IDS = new Set(["home-furniture"]);

const Navbar = () => {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null);
  const [openCatId, setOpenCatId] = useState<string | null>(null);
  const [openHeadingId, setOpenHeadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [comingSoonCategory, setComingSoonCategory] = useState<"office" | "home" | null>(null);
  const categoryNavRef = useRef<HTMLDivElement>(null);

  // Close the mobile menu and modal on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setOpenCatId(null);
        setComingSoonCategory(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (categoryNavRef.current && !categoryNavRef.current.contains(event.target as Node)) {
        setOpenCatId(null);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleCategoryNavigate = (catId: string) => {
    setOpenCatId(null);
    if (COMING_SOON_IDS.has(catId)) {
      setComingSoonCategory(catId.includes("office") ? "office" : "home");
      return;
    }
    navigate(`/category/${catId}`);
  };

  const handleSubClick = (catId: string, subId: string) => {
    setOpenCatId(null);
    if (subId === "metal-furniture") {
      setMobileOpen(false);
      if (catId === "office-furniture") {
        navigate("/category/office-furniture?sub=office-metal-furniture");
      } else {
        navigate("/category/cupboards-almirahs");
      }
      return;
    }
    if (subId === "metal-storewell") {
      setMobileOpen(false);
      navigate("/category/cupboards-almirahs?sub=storewell");
      return;
    }
    if (COMING_SOON_IDS.has(catId)) {
      setComingSoonCategory("home");
      return;
    }
    setMobileOpen(false);
    navigate(`/category/${catId}?sub=${subId}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <style>{`
       
/* ==============================
   TOP INFO BAR
============================== */
.ws-topbar {
  background: #1a1a2e;
  color: #9ca3af;
  font-size: 12px;
  text-align: center;
  padding: 6px 20px;
  letter-spacing: 0.4px;
}

.ws-topbar strong {
  color: #f59e0b;
}

/* ==============================
   MAIN HEADER
============================== */
.ws-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #fff;
  box-shadow: 0 1px 0 #e5e7eb;
}

.ws-header-inner {
  width: 100%;
  max-width: 1400px;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 32px;
  height: 68px;
  display: flex;
  align-items: center;
  gap: 24px;
}

/* ==============================
   LOGO
============================== */
.ws-logo {
  display: inline-flex;
  align-items: center;
  gap: 13px;
  text-decoration: none;
  flex-shrink: 0;
}

.ws-logo-img {
  width: 43px;
  height: 43px;
  object-fit: contain;
  flex-shrink: 0;
  transition: transform 0.35s ease;
}

.ws-logo:hover .ws-logo-img,
.ws-logo:focus-visible .ws-logo-img,
.ws-logo:active .ws-logo-img {
  transform: rotate(-8deg) scale(1.08);
}

.ws-logo-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  line-height: 1;
}

.ws-logo-name {
  display: block;
  color: #172033;
  font-size: 17px;
  font-weight: 750;
  letter-spacing: 1.7px;
  white-space: nowrap;
}

.ws-logo-divider {
  width: 100%;
  height: 1.5px;
  background: linear-gradient(
    90deg,
    #c18b45,
    #e8d3ae,
    transparent
  );
}

.ws-logo-tag {
  display: block;
  color: #8b642f;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1.35px;
  white-space: nowrap;
}

/* ==============================
   SEARCH
============================== */
.ws-search {
  flex: 1;
  max-width: 580px;
  min-width: 0;
  position: relative;
  margin: 0 auto;
}

.ws-search form {
  display: flex;
  align-items: center;
  height: 46px;
  border: 1.5px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
  background: #f9fafb;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.ws-search form:focus-within {
  border-color: #1a1a2e;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(26, 26, 46, 0.07);
}

.ws-search input {
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  padding: 0 12px 0 16px;
  font-size: 14px;
  color: #111827;
}

.ws-search input::placeholder {
  color: #9ca3af;
  font-size: 13.5px;
}

.ws-search button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 100%;
  flex-shrink: 0;
  padding: 0 20px;
  border: none;
  background: #1a1a2e;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
  white-space: nowrap;
  transition: background 0.15s;
}

.ws-search button:hover {
  background: #0f172a;
}

/* ==============================
   HEADER ACTIONS
============================== */
.ws-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  margin-left: auto;
  border-left: 1px solid #e5e7eb;
  padding-left: 20px;
}

.ws-icon-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  min-width: 62px;
  padding: 8px 16px;
  border-radius: 8px;
  color: #111827;
  text-decoration: none;
  text-align: center;
  transition: background 0.12s;
}

.ws-icon-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.ws-icon-btn > svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: #374151;
}

.ws-icon-btn:hover > svg {
  color: #111827;
}

.ws-icon-btn > span:not(.badge) {
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  letter-spacing: 0.2px;
  line-height: 1;
}

.ws-icon-btn .badge {
  position: absolute;
  top: 4px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border: 2px solid #fff;
  border-radius: 9px;
  background: #dc2626;
  color: #fff;
  font-size: 9.5px;
  font-weight: 700;
  line-height: 1;
}

/* ==============================
   DESKTOP CATEGORY NAVBAR
============================== */
.ws-catbar {
  position: relative;
  z-index: 1001;
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

.ws-mobile-nav {
  display: none;
}

.ws-catbar-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
  max-width: 1400px;
  min-height: 54px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;

  overflow: visible;
}

.ws-cat-item {
  position: relative;
  flex: 0 0 auto;
}

/* Category buttons */
.ws-cat-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 20px 7px;
  border: none;
  border-bottom: 2px solid transparent;
  box-sizing: border-box;
  background: transparent;
  color: #4b5563;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.12s, border-color 0.12s;
}

.ws-cat-btn:hover,
.ws-cat-btn.active {
  color: #111827;
  border-bottom-color: #64748b;
}

.ws-cat-chevron {
  flex: 0 0 auto;
  transition: transform 0.15s ease;
}

.ws-cat-chevron.open {
  transform: rotate(180deg);
}

.ws-category-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1100;
  width: max-content;
  min-width: 240px;
  max-width: min(320px, calc(100vw - 24px));
  max-height: min(70vh, 560px);
  overflow: auto;
  padding: 8px;
  border: 1px solid #e9ddd5;
  border-radius: 0 0 6px 6px;
  background: #ffffff;
  box-shadow: 0 5px 14px rgba(71, 52, 37, .1);
}

.ws-category-dropdown-group {
  padding: 5px 0;
}

.ws-category-dropdown-group + .ws-category-dropdown-group {
  border-top: 1px solid #e9ddd5;
}

.ws-category-dropdown-section + .ws-category-dropdown-section {
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid #e9ddd5;
}

.ws-category-dropdown-group p {
  margin: 4px 8px;
  color: #171411;
  font-size: 12px;
  font-weight: 700;
}

.ws-category-dropdown-section-title {
  margin: 10px 8px 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e9ddd5;
  color: #171411;
  font-size: 13px;
  font-weight: 700;
}

.ws-category-dropdown-link {
  display: block;
  width: 100%;
  padding: 8px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: #171411;
  font: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}

.ws-category-dropdown-link:hover,
.ws-category-dropdown-link:focus-visible {
  background: #e9ddd5;
  color: #111111;
}

.ws-category-dropdown-home .ws-category-dropdown-link {
  color: #171411;
  font-weight: 550;
}

.ws-category-dropdown-home .ws-category-dropdown-heading-item {
  color: #171411;
  font-weight: 650;
}

.ws-category-dropdown-child {
  padding-left: 22px;
  color: #211d19;
  font-size: 12px;
}

.ws-category-dropdown-headings {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 4px 0;
}

.ws-category-dropdown-heading-item {
  display: flex !important;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 9px 12px;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 550;
  color: #171411;
  transition: all 0.15s ease;
}

.ws-category-dropdown-heading-item:hover,
.ws-category-dropdown-heading-item:focus-visible {
  background: #e9ddd5;
  color: #111111;
}

.ws-dropdown-arrow {
  color: #4b443e;
  flex-shrink: 0;
  transition: transform 0.15s ease, color 0.15s ease;
}

.ws-category-dropdown-heading-item:hover .ws-dropdown-arrow {
  color: #1e293b;
  transform: translateX(3px);
}

.ws-dropdown-arrow.open {
  transform: rotate(180deg);
}

.ws-dropdown-arrow.open.ws-dropdown-arrow-right {
  transform: rotate(90deg);
}

.ws-category-dropdown-subitems {
  margin: 0 0 5px 10px;
  padding-left: 8px;
  border-left: 1px solid #e5e7eb;
}

.ws-drawer-headings-list {
  display: flex;
  flex-direction: column;
}

.ws-drawer-heading-btn {
  display: flex !important;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 550;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
}
.ws-category-dropdown-all {
  margin-bottom: 4px;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 0;
  color: #111827;
  font-weight: 700;
}

/* ==============================
   COMING SOON BADGE
============================== */
.ws-cat-badge {
  display: inline-block;
  padding: 1.5px 5px;
  border-radius: 4px;
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
  vertical-align: middle;
}

.ws-cat-badge.soon {
  background: #fef9c3;
  color: #a16207;
}

/* No desktop overlay over page content */
.ws-backdrop {
  display: none !important;
}

/* ==============================
   MOBILE TOGGLE
============================== */
.ws-mobile-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #111827;
  cursor: pointer;
}

.ws-mobile-toggle:hover {
  background: #f3f4f6;
}

/* ==============================
   MOBILE DRAWER
============================== */
.ws-mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
}

.ws-mobile-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 2001;

  display: flex;
  flex-direction: column;
  width: 88%;
  max-width: 340px;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  box-sizing: border-box;

  background: #fff;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.14);
  animation: wsDrawerIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes wsDrawerIn {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}

.ws-drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  box-sizing: border-box;
}

.ws-drawer-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: 12px 0;
}

.ws-drawer-link {
  display: block;
  padding: 12px 20px;
  border-bottom: 1px solid #f3f4f6;
  color: #111827;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  text-decoration: none;
}

.ws-drawer-link:hover {
  background: #f9fafb;
}

/* Mobile category buttons */
.ws-drawer-cat-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: 52px;
  padding: 14px 20px;
  border: none;
  border-bottom: 1px solid #f3f4f6;
  background: #fff;
  color: #111827;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
}

.ws-drawer-cat-btn:hover {
  background: #f9fafb;
}

.ws-drawer-cat-btn > span {
  display: inline-block;
  flex: 1;
  min-width: 0;
  color: #111827;
  visibility: visible;
}

.ws-drawer-cat-btn > svg {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  color: #6b7280;
}

/* Mobile subcategories */
.ws-drawer-sub-group {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  background: #f8fafc;
}

.ws-drawer-sub-heading {
  padding: 10px 28px 4px;
  color: #9a5a12;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.ws-drawer-sub-link {
  display: block;
  width: 100%;
  padding: 11px 28px;
  border: none;
  background: transparent;
  color: #374151;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
  text-align: left;
  overflow-wrap: anywhere;
  cursor: pointer;
}

.ws-drawer-sub-link:hover {
  background: #fff;
  color: #d97706;
}

.ws-drawer-sub-child {
  padding-left: 44px;
  color: #64748b;
  font-size: 12px;
}

.ws-drawer-view-all {
  display: block;
  width: 100%;
  padding: 11px 28px;
  border: none;
  background: transparent;
  color: #2563eb;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}

.ws-drawer-view-all:hover {
  color: #1d4ed8;
}

/* ==============================
   TABLET
============================== */
@media (max-width: 1023px) {
  .ws-catbar {
    display: none;
  }

  .ws-search {
    display: none;
  }

  .ws-mobile-toggle {
    display: flex;
  }
}

@media (min-width: 1024px) {
  .ws-mobile-toggle {
    display: none;
  }
}

/* ==============================
   MOBILE HEADER
============================== */
@media (max-width: 600px) {
  .ws-header-inner {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas:
      "menu logo actions"
      "search search search";
    height: auto;
    min-height: 62px;
    padding: 10px 12px;
    gap: 8px;
  }

  .ws-mobile-toggle {
    grid-area: menu;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    flex-shrink: 0;
  }

  .ws-logo {
    grid-area: logo;
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    max-width: none;
    flex-shrink: 0;
  }

  .ws-logo-img {
    display: block;
    width: auto;
    height: 34px;
    max-width: 90px;
    object-fit: contain;
  }

  .ws-logo-text {
    display: flex;
    min-width: 0;
    gap: 3px;
  }

  .ws-logo-name {
    font-size: 13px;
    letter-spacing: 0.6px;
  }

  .ws-logo-tag {
    font-size: 6px;
    letter-spacing: 0.45px;
  }

  .ws-logo-divider {
    height: 1px;
  }

  .ws-actions {
    grid-area: actions;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0;
    margin-left: 0;
    padding-left: 0;
    border-left: none;
    flex-shrink: 0;
  }

  .ws-icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    min-height: 36px;
    padding: 4px;
  }

  .account-trigger {
    min-width: 34px !important;
    padding: 4px !important;
  }

  .account-trigger-label {
    font-size: 9px !important;
  }

  .ws-icon-btn > svg {
    width: 21px;
    height: 21px;
  }

  .ws-icon-btn > span:not(.badge) {
    display: none;
  }

  .ws-icon-btn .badge {
    top: 0;
    right: 0;
  }

  /* Search moves to its own row */
  .ws-search {
    grid-area: search;
    display: block;
    order: 0;
    flex: initial;
    width: 100%;
    min-width: 0;
    max-width: none;
    margin: 0;
  }

  .ws-search form {
    width: 100%;
    height: 44px;
  }

  .ws-search input {
    flex: 1;
    min-width: 0;
    width: 100%;
    padding: 0 12px;
    font-size: 13px;
  }

  .ws-search button {
    height: 100%;
    padding: 0 14px;
    gap: 5px;
    font-size: 12px;
  }

  .ws-catbar {
    display: none;
  }

  .ws-mobile-nav {
    display: flex;
    align-items: center;
    gap: 18px;
    min-height: 40px;
    padding: 0 14px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    border-top: 1px solid #f0f0f0;
    background: #fff;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .ws-mobile-nav::-webkit-scrollbar {
    display: none;
  }

  .ws-mobile-nav a {
    flex: 0 0 auto;
    padding: 10px 0;
    border-bottom: 2px solid transparent;
    color: #4b5563;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
  }

  .ws-mobile-nav a.active,
  .ws-mobile-nav a:hover {
    border-bottom-color: #64748b;
    color: #111827;
  }

  .ws-mobile-drawer {
    position: fixed;
    inset: 0 auto 0 0;
    width: min(88%, 340px);
    max-width: 340px;
    height: 100%;
    height: 100dvh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: border-box;
  }

  .ws-drawer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 82px;
    padding: 12px 14px;
    flex-shrink: 0;
  }

  .ws-mobile-drawer .ws-drawer-head a.ws-logo {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    gap: 9px;
    min-width: 0;
    max-width: calc(100% - 32px);
    overflow: visible;
  }

  .ws-mobile-drawer .ws-drawer-head .ws-logo-img {
    display: block;
    width: 40px;
    height: 40px;
    max-width: 40px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .ws-mobile-drawer .ws-drawer-head .ws-logo-text {
    display: flex !important;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    min-width: 0;
    overflow: visible;
    line-height: 1;
  }

  .ws-mobile-drawer .ws-drawer-head .ws-logo-name {
    font-size: 15px;
    font-weight: 750;
    letter-spacing: 0.6px;
    white-space: nowrap;
  }

  .ws-mobile-drawer .ws-drawer-head .ws-logo-divider {
    display: block;
    width: 100%;
    height: 1.5px;
    background: linear-gradient(
      90deg,
      #c18b45,
      #e8d3ae,
      transparent
    );
  }

  .ws-mobile-drawer .ws-drawer-head .ws-logo-tag {
    font-size: 6.5px;
    font-weight: 700;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  .ws-mobile-drawer .ws-drawer-head .ws-mobile-toggle {
    display: flex;
    flex-shrink: 0;
    padding: 5px;
  }

  .ws-drawer-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    padding: 8px 0;
  }

  .ws-drawer-link {
    padding: 14px 20px;
    font-size: 15px;
    line-height: 1.4;
  }

  .ws-drawer-cat-btn {
    width: 100%;
    min-height: 50px;
    padding: 13px 20px;
    gap: 12px;
    font-size: 14px;
    line-height: 1.4;
    box-sizing: border-box;
  }

  .ws-drawer-cat-btn > span {
    display: inline-block !important;
    visibility: visible;
    flex: 1;
    min-width: 0;
    color: #111827;
  }

  .ws-drawer-cat-btn > svg {
    width: 17px;
    height: 17px;
    flex-shrink: 0;
    color: #6b7280;
  }

  .ws-drawer-sub-group {
    padding: 8px 0;
    background: #f8fafc;
  }

  .ws-drawer-sub-link {
    width: 100%;
    padding: 11px 28px;
    font-size: 13px;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }

  .ws-drawer-view-all {
    width: 100%;
    padding: 11px 28px;
    font-size: 13px;
    text-align: left;
  }
}

/* ==============================
   SMALL PHONES
============================== */
@media (max-width: 480px) {
  .ws-header-inner {
    padding: 10px;
    column-gap: 6px;
    row-gap: 8px;
  }

  .ws-logo {
    gap: 6px;
    max-width: calc(100% - 55px);
  }

  .ws-logo-img {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    object-fit: contain;
  }

  .ws-logo-text {
    min-width: 0;
    line-height: 1.2;
  }

  .ws-logo-name {
    font-size: 12px;
    line-height: 1.2;
    white-space: nowrap;
  }

  .ws-logo-tag {
    font-size: 5.5px;
    line-height: 1.3;
    letter-spacing: 0.3px;
    white-space: nowrap;
  }

  .ws-drawer-head {
    padding: 12px;
  }

  .ws-drawer-cat-btn {
    padding-left: 16px;
    padding-right: 16px;
  }
}

/* ==============================
   EXTRA-SMALL PHONES
============================== */
@media (max-width: 360px) {
  .ws-header-inner {
    padding: 8px;
    gap: 5px;
  }

  .ws-logo-tag,
  .ws-logo-divider {
    display: none;
  }

  .ws-logo-img {
    height: 29px;
    max-width: 76px;
  }

  .ws-actions {
    gap: 0;
  }

  .account-trigger-label {
    display: none !important;
  }

  .ws-icon-btn {
    min-width: 28px;
    padding: 4px;
  }

  .ws-search input {
    padding: 0 9px;
    font-size: 12px;
  }

  .ws-search button {
    padding: 0 10px;
  }

  .ws-drawer-head {
    padding: 12px;
  }

  .ws-drawer-cat-btn {
    padding-left: 16px;
    padding-right: 16px;
  }
}

      `}</style>

      
      

      {/* Main header */}
      <header className="ws-header">
        <div className="ws-header-inner">
          {/* Mobile toggle */}
          <button
            type="button"
            className="ws-mobile-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
         
<Link to="/" className="ws-logo">
  <img
    src="/logo-mark-dark.png"
    alt="Staging Spaces"
    className="ws-logo-img"
  />

  <span className="ws-logo-text">
    <span className="ws-logo-name">STAGING SPACES</span>
    <span className="ws-logo-divider" />
    <span className="ws-logo-tag">
      BY NARESH STEEL CORPORATION
    </span>
  </span>
</Link>


          {/* Search */}
          <div className="ws-search">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search furniture, racks, cupboards…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit" aria-label="Search">
                <Search size={15} />
                <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.2px" }}>Search</span>
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="ws-actions">
            <Link
              to="/wishlist"
              className="ws-icon-btn"
              aria-label="Wishlist"
            >
              <Heart
  size={20}
  color="red"
  fill={wishlistCount > 0 ? "red" : "none"}
/>
              <span>Wishlist</span>
              {wishlistCount > 0 && <span className="badge">{wishlistCount > 99 ? "99+" : wishlistCount}</span>}
            </Link>

            <Link
              to="/cart"
              className="ws-icon-btn"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              <span>Cart</span>
              {cartCount > 0 && <span className="badge">{cartCount > 99 ? "99+" : cartCount}</span>}
            </Link>

            <AccountMenu />
          </div>
        </div>

        {/* Desktop category menu */}
        {!location.pathname.startsWith("/category") && <div className="ws-catbar" ref={categoryNavRef}>
          <div className="ws-catbar-inner">
            {categoriesData.map((cat) => {
              const isSoon = COMING_SOON_IDS.has(cat.id);
              const isActive = location.pathname.startsWith(`/category/${cat.id}`);
              const isOpen = openCatId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="ws-cat-item"
                  onMouseEnter={() => { setOpenCatId(cat.id); setOpenHeadingId(null); }}
                  onMouseLeave={() => setOpenCatId((current) => current === cat.id ? null : current)}
                >
                  <button
                    type="button"
                    className={`ws-cat-btn${isActive || isOpen ? " active" : ""}`}
                    onClick={() => { if (openCatId !== cat.id) { setOpenHeadingId(null); setOpenCatId(cat.id); } else { handleCategoryNavigate(cat.id); } }}
                    aria-current={isActive ? "page" : undefined}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    {cat.name}
                    {isSoon && <span className="ws-cat-badge soon" />}
                    <ChevronDown size={13} className={`ws-cat-chevron${isOpen ? " open" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className={`ws-category-dropdown${cat.id === "home-furniture" ? " ws-category-dropdown-home" : ""}`}>
                      {(cat.id === "office-furniture" || cat.id === "outdoor-furniture" || cat.id === "cupboards-almirahs" || cat.id === "bunk-beds") ? (
                        <div className="ws-category-dropdown-headings">
                          {getCategoryHeadings(cat).map((heading) => {
                            const isBunkBeds = cat.id === "bunk-beds";
                            const expanded = openHeadingId === `${cat.id}:${heading.id}`;
                            const subcategories = (cat.subcategories || []).filter((sub) =>
                              heading.includedSubcategoryIds?.includes(sub.id),
                            );
                            return (
                              <div key={heading.id}>
                                <button
                                  type="button"
                                  className="ws-category-dropdown-link ws-category-dropdown-heading-item"
                                  aria-expanded={isBunkBeds ? undefined : expanded}
                                  onClick={() => isBunkBeds ? handleSubClick(cat.id, heading.id) : setOpenHeadingId(expanded ? null : `${cat.id}:${heading.id}`)}
                                >
                                  <span>{heading.name}</span>
                                  {!isBunkBeds && <ChevronDown size={13} className={`ws-dropdown-arrow${expanded ? " open" : ""}`} />}
                                </button>
                                {expanded && !isBunkBeds && <div className="ws-category-dropdown-subitems">
                                  {subcategories.map((sub) => (
                                    <button key={sub.id} type="button" className="ws-category-dropdown-link ws-category-dropdown-child" onClick={() => handleSubClick(cat.id, sub.id)}>
                                      {sub.name}
                                    </button>
                                  ))}
                                </div>}
                              </div>
                            );
                          })}
                        </div>
                      ) : cat.id === "seating-solutions" ? (
                        <div className="ws-category-dropdown-headings">
                          {(cat.subcategories || []).map((sub) => {
                            const expanded = openHeadingId === `${cat.id}:${sub.id}`;
                            return (
                              <div key={sub.id}>
                                {sub.children?.length ? (
                                  <>
                                    <button
                                      type="button"
                                      className="ws-category-dropdown-link ws-category-dropdown-heading-item"
                                      aria-expanded={expanded}
                                      onClick={() => setOpenHeadingId(expanded ? null : `${cat.id}:${sub.id}`)}
                                    >
                                      <span>{sub.name}</span>
                                      <ChevronRight size={13} className={`ws-dropdown-arrow ws-dropdown-arrow-right${expanded ? " open" : ""}`} />
                                    </button>
                                    {expanded && <div className="ws-category-dropdown-subitems">
                                      {sub.children.map((child) => (
                                        <button key={child.id} type="button" className="ws-category-dropdown-link ws-category-dropdown-child" onClick={() => handleSubClick(cat.id, child.id)}>
                                          {child.name}
                                        </button>
                                      ))}
                                    </div>}
                                  </>
                                ) : (
                                  <button type="button" className="ws-category-dropdown-link ws-category-dropdown-heading-item" onClick={() => handleSubClick(cat.id, sub.id)}>
                                    <span>{sub.name}</span>
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="ws-category-dropdown-groups">
                          {groupSubcategories(cat.subcategories || []).map((group) => (
                            <div className="ws-category-dropdown-group" key={group.name}>
                              {group.name !== "Browse" && <p>{group.name}</p>}
                              {group.items.map((sub) => (
                                <div key={sub.id}>
                                  <button type="button" className="ws-category-dropdown-link" onClick={() => handleSubClick(cat.id, sub.id)}>{sub.name}</button>
                                  {sub.children?.map((child) => (
                                    <button key={child.id} type="button" className="ws-category-dropdown-link ws-category-dropdown-child" onClick={() => handleSubClick(cat.id, child.id)}>↳ {child.name}</button>
                                  ))}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <Link to="/about" className={`ws-cat-btn${location.pathname === "/about" ? " active" : ""}`}>About Us</Link>
            <Link to="/contact" className={`ws-cat-btn${location.pathname === "/contact" ? " active" : ""}`}>Contact Us</Link>
          </div>
        </div>}

        {/* Compact navigation stays visible on mobile, including category pages. */}
        <nav className="ws-mobile-nav" aria-label="Main navigation">
          {categoriesData.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className={location.pathname.startsWith(`/category/${cat.id}`) ? "active" : ""}
            >
              {cat.name}
            </Link>
          ))}
          <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About Us</Link>
          <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>Contact Us</Link>
        </nav>
      </header>


      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <>
          <div className="ws-mobile-overlay" onClick={() => setMobileOpen(false)} />
          <div className="ws-mobile-drawer">
            <div className="ws-drawer-head">
              <Link
                to="/"
                className="ws-logo"
                onClick={() => setMobileOpen(false)}
              >
               <img
  src="/logo-mark-dark.png"
  alt="Staging Spaces"
  className="ws-logo-img"
/>
                <span className="ws-logo-text">
                  <span className="ws-logo-text">
  <span className="ws-logo-name">STAGING SPACES</span>
  <span className="ws-logo-divider" />
  <span className="ws-logo-tag">
    BY NARESH STEEL CORPORATION
  </span>
</span>
                </span>
              </Link>
              <button
                type="button"
                className="ws-mobile-toggle"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="ws-drawer-body">
              <Link to="/" className="ws-drawer-link" onClick={() => setMobileOpen(false)}>Home</Link>
              {categoriesData.map(cat => {
                const isExpanded = mobileExpandedId === cat.id;
                const isSoon = COMING_SOON_IDS.has(cat.id);

                return (
                  <div key={cat.id}>
                   <button
  type="button"
  className="ws-drawer-cat-btn"
  onClick={() => {
    if (isSoon) {
      setComingSoonCategory(
        cat.id.includes("office") ? "office" : "home"
      );
      setMobileOpen(false);
    } else {
      setMobileExpandedId(isExpanded ? null : cat.id);
    }
  }}
>
  <span>{cat.name}</span>

  <ChevronRight
    size={15}
    style={{
      transform: isExpanded ? "rotate(90deg)" : "none",
      transition: "transform 0.2s",
      color: "#9ca3af",
    }}
  />
</button>

                    {isExpanded && (
                      <div className="ws-drawer-sub-group">
                        <button
                          type="button"
                          className="ws-drawer-view-all"
                          style={{ display: cat.id === "home-furniture" || cat.id === "bunk-beds" ? "none" : undefined }}
                          onClick={() => {
                            setMobileOpen(false);
                            navigate(`/category/${cat.id}`);
                          }}
                        >
                          View all {cat.name} →
                        </button>
                        <div className="ws-drawer-headings-list">
                          {getCategoryHeadings(cat).map((heading) => (
                            <button
                              key={heading.id}
                              type="button"
                              className="ws-drawer-sub-link ws-drawer-heading-btn"
                              onClick={() => handleSubClick(cat.id, heading.id)}
                            >
                              <span>{heading.name}</span>
                              <ChevronRight size={13} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <Link to="/about" className="ws-drawer-link" onClick={() => setMobileOpen(false)}>About Us</Link>
              <Link to="/contact" className="ws-drawer-link" onClick={() => setMobileOpen(false)}>Contact Us</Link>
            </div>
          </div>
        </>
      )}

      {/* Coming Soon Modal */}
      {comingSoonCategory && (
        <ComingSoonModal
          category={comingSoonCategory}
          onClose={() => setComingSoonCategory(null)}
        />
      )}
    </>
  );
};

export default Navbar;
