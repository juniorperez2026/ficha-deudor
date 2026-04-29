import React from 'react';
import type { DeudorInfo } from '../../types';
import { CompactInfoSection, InfoRow } from '../ui/CompactInfoSection';

interface Props {
  data: DeudorInfo;
  contacto: string;
  onContactoChange: (v: string) => void;
  compact?: boolean;
  mejorResultado?: string; // ← NUEVO: Prop opcional
}

const DeudorHeader: React.FC<Props> = ({ 
  data, 
  contacto, 
  onContactoChange, 
  compact = false,
  mejorResultado = 'Tezfo' // ← Valor por defecto
}) => {
  return (
    <div className={`ficha-card ${compact ? 'deudor-header--compact' : ''}`}>
      {/* Meta strip (sin cambios) */}
      <div className="header-meta-strip">
        <div className="meta-item">
          <span className="meta-label">ZONA</span>
          <span className="meta-value">{data.zona}</span>
        </div>
        {!compact && <div className="meta-separator" />}
        <div className="meta-item">
          <span className="meta-label">CARTERA</span>
          <span className="meta-value">{data.cartera}</span>
        </div>
        {!compact && <div className="meta-separator" />}
        <div className="meta-item">
          <span className="meta-label">CAMPAÑA</span>
          <span className="meta-value">{data.campana}</span>
        </div>
      </div>

      {compact ? (
        <div className="compact-layout">
          <div className="compact-layout__grid">
            
            {/* ═══════════════════════════════════════
                COLUMNA 1: INFORMACIÓN DEL DEUDOR
               ═══════════════════════════════════════ */}
            <CompactInfoSection title="Información del Deudor">
              <InfoRow 
                label="Nombre / R.S.:" 
                value={data.nombreRazonSocial} 
                highlight 
              />
              <InfoRow 
                label="DNI / RUC:" 
                value={data.dniRuc} 
              />
              <InfoRow 
                label="Grado Inst.:" 
                value={data.gradoInstruccion} 
              />
              <InfoRow 
                label="Edad:" 
                value={`${data.edad} años`} 
              />
              <div className="compact-row compact-row--center" style={{ marginTop: 2 }}>
                <span className="compact-label">Contacto:</span>
                <input
                  type="text"
                  placeholder="Ingresar..."
                  value={contacto}
                  onChange={(e) => onContactoChange(e.target.value)}
                  className="compact-input"
                />
              </div>
            </CompactInfoSection>

            {/* ═══════════════════════════════════════
                COLUMNA 2: ASESORES
               ═══════════════════════════════════════ */}
            <CompactInfoSection title="Asesores">
              <InfoRow label="Asesor Asig.:" value={data.asesorAsignado} />
              <InfoRow label="Post Venta:" value={data.asesorPostVenta} />
              <InfoRow label="Comercial:" value={data.asesorComercial} />
              <InfoRow 
                label="Correo APV:" 
                value={data.correoApv} 
                title={data.correoApv}
              />
              <InfoRow 
                label="Correo AC:" 
                value={data.correoAc} 
                title={data.correoAc}
              />
            </CompactInfoSection>

            {/* ═══════════════════════════════════════
                COLUMNA 3: MEJOR RESULTADO (NUEVO)
               ═══════════════════════════════════════ */}
            <CompactInfoSection title="Mejor Resultado">
              <InfoRow 
                label="Resultado:" 
                value={mejorResultado} 
                highlight 
              />
            </CompactInfoSection>

          </div>
        </div>
      ) : (
        <div className="deudor-info-grid">
          {/* Versión normal (placeholder para tu implementación) */}
        </div>
      )}
    </div>
  );
};

export default DeudorHeader;