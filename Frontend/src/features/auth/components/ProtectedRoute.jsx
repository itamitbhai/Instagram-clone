import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { user, checkedAuth } = useAuth();

  if (!checkedAuth) return <h1>Loading...</h1>;

  if (!user) return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedRoute;