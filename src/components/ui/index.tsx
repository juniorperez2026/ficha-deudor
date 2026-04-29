import React from 'react';
import type { SelectOption } from '../../types';

export const FieldRow: React.FC<{ label: string; value?: string | number; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className={`field-row ${highlight ? 'field-highlight' : ''}`}>
    <span className="field-label">{label}:</span>
    <span className="field-value">{value ?? '—'}</span>
  </div>
);

export const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string; wrapperClassName?: string }> = ({ label, wrapperClassName, ...props }) => (
  <div className={`form-group ${wrapperClassName ?? ''}`}>
    {label && <label className="form-label">{label}</label>}
    <input className="form-input" {...props} />
  </div>
);

export const TextAreaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }> = ({ label, ...props }) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    <textarea className="form-input form-textarea" {...props} />
  </div>
);

export const SelectField: React.FC<{ label?: string; options: SelectOption[]; value: string; onChange: (value: string) => void; placeholder?: string; disabled?: boolean; badge?: string }> = ({ label, options, value, onChange, placeholder = 'Seleccionar...', disabled, badge }) => (
  <div className="form-group">
    {label && (
      <label className="form-label">
        {badge && <span className="form-badge">{badge}</span>}
        {label}
      </label>
    )}
    <select className="form-select" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export const SectionHeader: React.FC<{ title: string; accent?: boolean }> = ({ title, accent }) => (
  <div className={`section-header ${accent ? 'section-header--accent' : ''}`}>
    <span className="section-title">{title}</span>
  </div>
);

export const ActionButton: React.FC<{ label: string; onClick?: () => void; variant?: string; size?: string; icon?: string }> = ({ label, onClick, variant = 'secondary', size = 'sm', icon }) => (
  <button className={`btn btn-${variant} btn-${size}`} onClick={onClick} type="button">
    {icon && <span className="btn-icon">{icon}</span>}
    {label}
  </button>
);

export const CheckboxField: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void }> = ({ label, checked, onChange }) => (
  <label className="checkbox-wrapper">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="checkbox-input" />
    <span className="checkbox-label">{label}</span>
  </label>
);

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getVariant = (s: string) => {
    const upper = s.toUpperCase();
    if (['VENCIDO', 'IMPAGO', 'MORA', 'PREJUDICIAL'].includes(upper)) return 'danger';
    if (['PAGADO', 'AL DIA'].includes(upper)) return 'success';
    if (['PROMESA', 'EN_PROCESO', 'EN PROCESO'].includes(upper)) return 'warning';
    return 'neutral';
  };
  return <span className={`status-badge status-badge--${getVariant(status)}`}>{status}</span>;
};