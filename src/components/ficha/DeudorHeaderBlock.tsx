import React from 'react';
import { FieldRow } from '../ui';
import type { DeudorHeaderInfo } from '../../types';

interface Props {
  data: DeudorHeaderInfo;
  layout?: 'vertical' | 'horizontal' | 'compact';
}

const DeudorHeaderBlock: React.FC<Props> = ({ data, layout = 'vertical' }) => {
  const isCompact = layout === 'compact';

  if (isCompact) {
    return (
      <div
        style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '10px 16px',
        }}
      >
        {/* Una sola fila con todos los datos */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '4px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#6b7a99', textTransform: 'uppercase' }}>
              Grupo:
            </span>
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#1a2540' }}>
              {data.grupo}
            </span>
          </div>

          <span style={{ color: '#d8dde8' }}>|</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#6b7a99', textTransform: 'uppercase' }}>
              Cartera:
            </span>
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#1a2540' }}>
              {data.cartera}
            </span>
          </div>

          <span style={{ color: '#d8dde8' }}>|</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#6b7a99', textTransform: 'uppercase' }}>
              Cliente:
            </span>
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#1a2540' }}>
              {data.cliente}
            </span>
          </div>

          <span style={{ color: '#d8dde8' }}>|</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#6b7a99', textTransform: 'uppercase' }}>
              Deudor:
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#1a2540' }}>
              {data.deudor}
            </span>
          </div>

          <span style={{ color: '#d8dde8' }}>|</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#6b7a99', textTransform: 'uppercase' }}>
              RUC/DNI:
            </span>
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#1a2540', fontFamily: 'IBM Plex Mono, monospace' }}>
              {data.rucDni}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Layout horizontal (para modales expandidos)
  if (layout === 'horizontal') {
    return (
      <div
        style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px 16px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '8px 16px',
          }}
        >
          <FieldRow label="GRUPO" value={data.grupo} />
          <FieldRow label="CARTERA" value={data.cartera} />
          <FieldRow label="CLIENTE" value={data.cliente} />
          <FieldRow label="DEUDOR" value={data.deudor} highlight />
          <FieldRow label="RUC/DNI" value={data.rucDni} />
        </div>
      </div>
    );
  }

  // Layout vertical (default, para sidebar estrecho)
  return (
    <div
      style={{
        flex: '0 0 220px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        alignSelf: 'flex-start',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          fontWeight: 700,
          color: '#1a2540',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          marginBottom: '8px',
          paddingBottom: '6px',
          borderBottom: '2px solid #e2e8f0',
        }}
      >
        Datos del Deudor
      </div>

      <FieldRow label="GRUPO" value={data.grupo} />
      <FieldRow label="CARTERA" value={data.cartera} />
      <FieldRow label="CLIENTE" value={data.cliente} />
      <FieldRow label="DEUDOR" value={data.deudor} highlight />
      <FieldRow label="RUC/DNI" value={data.rucDni} />
    </div>
  );
};

export default DeudorHeaderBlock;