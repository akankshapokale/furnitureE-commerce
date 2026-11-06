import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { permissionForPath } from "../../config/permissions";

// Requires a signed-in admin/employee, and the right page permission for the URL.
const ProtectedRoute = () => {
  const { user, loading, can, firstAllowedPath } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const required = permissionForPath(location.pathname);

  if (required && !can(required)) {
    const fallback = firstAllowedPath();

    // Employee with no pages granted yet.
    if (!fallback || fallback === location.pathname) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-white p-6 text-center">
          <div>
            <h1 className="text-lg font-semibold text-[#10243e]">No pages assigned</h1>
            <p className="mt-1 text-sm text-gray-500">
              Ask an admin to grant you access to dashboard pages.
            </p>
          </div>
        </div>
      );
    }

    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
