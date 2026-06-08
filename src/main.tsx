import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './shared/styles/styles.css';
import './shared/styles/main.css';
import { AuthProvider } from './features/auth/contexts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);