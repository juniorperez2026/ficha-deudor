import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from '../../features/auth/contexts/authContextValue';

export function ProtectedRoute() {
  const { usuario, clienteSeleccionada } = useAuth();

  if (!usuario || !clienteSeleccionada) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}