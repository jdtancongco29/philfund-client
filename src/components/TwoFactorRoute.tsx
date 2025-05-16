// components/TwoFactorRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

export default function TwoFactorRoute() {
  const tempToken = Cookies.get("temp_token");

  return tempToken ? <Outlet /> : <Navigate to="/login" replace />;
}