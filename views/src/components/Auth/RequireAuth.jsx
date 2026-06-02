import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RouteLoader() {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
      <div className="text-center">
        <div className="spinner-border text-dark" role="status" aria-hidden="true"></div>
        <div className="mt-3 text-secondary">Loading...</div>
      </div>
    </div>
  );
}

export default function RequireAuth({ roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <RouteLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to={user.role === "Admin" ? "/admin/dashboard" : "/"} replace />;
  }

  return <Outlet />;
}
