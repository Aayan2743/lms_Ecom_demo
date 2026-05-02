import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useShop } from "./ShopContext.jsx";

const AdminProtectedRoute = ({ children }) => {
  const { user, isLoggedIn } = useShop();
  const location = useLocation();

  if (!isLoggedIn()) {
    return (
      <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
    );
  }

  if (user?.role !== "admin") {
    return <Navigate to="/account" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
