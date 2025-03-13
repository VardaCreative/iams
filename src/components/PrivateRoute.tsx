
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

// This is a basic implementation. In a real app, you would add authentication logic here.
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  // For demo purposes, we'll assume user is always authenticated
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
