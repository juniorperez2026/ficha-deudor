import React from 'react';
import { PanelLayout } from '../PanelLayout';

interface Props {
  title: string;
  isActive: boolean;
  error?: string | null;
  loadingMessage: string;
  errorTitle: string;
  onRetry: () => void;
}

const PanelResumenEstado: React.FC<Props> = ({
  title,
  isActive,
  error,
  loadingMessage,
  errorTitle,
  onRetry,
}) => {
  if (error) {
    return (
      <PanelLayout title={title} isActive={isActive}>
        <div style={{ padding: '2rem', color: '#c00' }}>
          <p style={{ marginBottom: 12 }}>{errorTitle}</p>

          <p style={{ fontSize: '0.9em', color: '#666', marginBottom: 16 }}>
            {error}
          </p>

          <button
            onClick={onRetry}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
            type="button"
          >
            Reintentar
          </button>
        </div>
      </PanelLayout>
    );
  }

  return (
    <PanelLayout title={title} isActive={isActive}>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <span>{loadingMessage}</span>
      </div>
    </PanelLayout>
  );
};

export default PanelResumenEstado;