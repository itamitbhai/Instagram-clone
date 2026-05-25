import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = () => {
  const { user, checkedAuth } = useAuth();

  if (!checkedAuth) return <h1>Loading...</h1>;

  if (user) return <Navigate to="/" />;

  return <Outlet />;
};

export default PublicRoute;