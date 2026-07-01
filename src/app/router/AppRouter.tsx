import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { LoginPage } from "../../features/auth/pages/LoginPage";
import EmailDeudorPopup from "../../features/ficha-deudor/components/popups/EmailDeudorPopup";
import AgendaDeudorPopup from "../../features/ficha-deudor/components/popups/AgendaDeudorPopup";
import PagoDeudorPopup from "../../features/ficha-deudor/components/popups/PagoDeudorPopup";
import InfDeudorPopup from "../../features/ficha-deudor/components/popups/InfDeudorPopup";

import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

const DashboardPage = lazy(() => import("../../features/dashboard/pages/DashboardPage"));
const FichaDeudor = lazy(() => import("../../features/ficha-deudor/pages/FichaDeudor"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Cargando...</p>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/ficha-deudor" element={<FichaDeudor />} />

            <Route
              path="/popup/email-deudor/:id_cliente/:id_deudor/:id_usuario"
              element={<EmailDeudorPopup />}
            />

            <Route
              path="/popup/agenda-deudor/:id_cliente/:id_cartera/:id_deudor/:id_usuario"
              element={<AgendaDeudorPopup />}
            />

            <Route
              path="/popup/pago-deudor/:id_cliente/:id_cartera/:id_deudor"
              element={<PagoDeudorPopup />}
            />

            <Route
              path="/popup/inf-deudor/:id_cliente/:id_cartera/:id_deudor/:id_usuario"
              element={<InfDeudorPopup />}
            />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}