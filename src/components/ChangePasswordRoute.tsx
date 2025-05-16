// components/ChangePasswordRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ChangePasswordRoute() {
  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token");

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}