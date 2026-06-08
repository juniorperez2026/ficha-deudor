// src/features/auth/pages/LoginPage.tsx

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm, ClienteSelectorModal } from '../components';
import { useAuth } from '../hooks';
import { login as loginApi } from '../api';
import type { LoginPayload, Cliente, Usuario } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, seleccionarCliente, isLoading: authLoading, error: authError, clearError } = useAuth();
  
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [modalUser, setModalUser] = useState<Usuario | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = useCallback(async (payload: LoginPayload) => {
    clearError();
    setLoginError(null);
    setIsSubmitting(true);
    
    const response = await loginApi(payload);
    
    setIsSubmitting(false);
    
    if (!response.success || !response.usuario) {
      setLoginError(response.message || 'Usuario o contraseña incorrectos');
      return;
    }
    
    const user = response.usuario;
    setModalUser(user);
    setShowClienteModal(true);
    
    // Actualizar contexto (usuario existe pero cartera no)
    await login(payload);
    
  }, [login, clearError]);

  // src/features/auth/pages/LoginPage.tsx

const handleSelectCliente = useCallback((cliente: Cliente) => {
  seleccionarCliente(cliente);
  setShowClienteModal(false);
  
  // Navegar a la raíz con query params en lugar de /dashboard
  navigate(`/?id_cliente=${cliente.id_cliente}&id_usuario=${modalUser?.id_usuario}`, {
    replace: true,
  });
  
}, [seleccionarCliente, navigate, modalUser]);

  const handleCloseModal = useCallback(() => {
    setShowClienteModal(false);
    setModalUser(null);
  }, []);

  const displayError = loginError || authError;
  const displayLoading = isSubmitting || authLoading;

  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__brand">
          <span className="login-page__logo-text">AVAL</span>
          <span className="login-page__logo-sub">PERÚ</span>
        </div>
        
        <LoginForm
          onSubmit={handleLogin}
          isLoading={displayLoading}
          error={displayError}
        />
      </div>

      {showClienteModal && modalUser && (
        <ClienteSelectorModal
          isOpen={true}
          usuario={modalUser}
          onClose={handleCloseModal}
          onContinue={handleSelectCliente}
        />
      )}
    </div>
  );
};

export default LoginPage;