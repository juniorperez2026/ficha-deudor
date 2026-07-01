import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from '../../features/auth/contexts/authContextValue';

export function PublicRoute() {
  const { usuario, clienteSeleccionada } = useAuth();

  if (usuario && clienteSeleccionada) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}