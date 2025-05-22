import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;

