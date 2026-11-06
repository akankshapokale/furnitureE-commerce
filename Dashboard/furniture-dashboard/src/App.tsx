import { BrowserRouter, Routes, Route, Navigate, useLocation, type Location } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Customers from "./pages/Customers";
import Payments from "./pages/Payments";
import Shipments from "./pages/Shipments";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import PendingOrders from "./pages/PendingOrders";
import ProcessingOrders from "./pages/ProcessingOrders";
import Dispatched from "./pages/Dispatched";
import Delivered from "./pages/Delivered";
import Returns from "./pages/Returns";
import Refunds from "./pages/Refunds";
import Settings from "./pages/Settings";
import OrderDetails from "./pages/OrderDetails";
import Login from "./pages/Login";
import People from "./pages/People";
import HRLeave from "./pages/HRLeave";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import WebsiteControl from "./pages/WebsiteControl";
import OffersPromotions from "./pages/OfferPromotions";
import CustomSizeRequests from "./pages/CustomSizeRequests";


function AppRoutes() {
  const location = useLocation();
  const backgroundLocation = (location.state as { backgroundLocation?: Location } | null)?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/people" element={<People />} />
            <Route path="/people/staff" element={<People title="Staff Management" staffView />} />
            <Route path="/hr-leave" element={<HRLeave />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/custom-size-requests" element={<CustomSizeRequests />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Navigate to="/website-control?module=categories" replace />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/:id" element={<ProductForm />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/orders/pending" element={<PendingOrders />} />
            <Route path="/orders/processing" element={<ProcessingOrders />} />
            <Route path="/orders/dispatched" element={<Dispatched />} />
            <Route path="/orders/delivered" element={<Delivered />} />
            <Route path="/orders/returns" element={<Returns />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/website-control" element={<WebsiteControl />} />
            <Route path="/offers-promotions" element={<OffersPromotions />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/products/new" element={<ProductForm drawer />} />
            <Route path="/products/:id" element={<ProductForm drawer />} />
          </Route>
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
