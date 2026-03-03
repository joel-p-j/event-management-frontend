import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="p-6 text-center">Checking admin access...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/events" replace />;
  }

  return children;
}
