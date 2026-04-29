import React, { useState } from 'react';
import { SelectField, InputField, TextAreaField, CheckboxField, SectionHeader } from '../ui';
import { opcionesNP0, opcionesNP1, opcionesNP2, estadosGestion, tiposGestion } from '../../data/mockData';
import type { GestionForm } from '../../types';
import Modal from '../modals/Modal';

interface Props { onSubmit?: (data: GestionForm) => void; }

const initialForm: GestionForm = {
  nombreContacto: '', cargo: '', np0: '', np1: '', np2: '', estadoGestion: '', telefono: '', tipoGestion: '', gestorId: '', gestorNombre: '', fechaCompromisoPago: '', compromisoSoles: '', compromisoUSD: '', fechaNuevaGestion: '', horaNuevaGestion: '', fechaGestion: '', horaGestion: '', gestionTerminada: false, observaciones: '',
};

const FichaGestion: React.FC<Props> = ({ onSubmit }) => {
  const [form, setForm] = useState<GestionForm>(initialForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const usuarioActual = "CARLOS R. (Gestor)";

  const set = (field: keyof GestionForm, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleNP0Change = (val: string) => { set('np0', val); set('np1', ''); set('np2', ''); };
  const handleNP1Change = (val: string) => { set('np1', val); set('np2', ''); };

  const handleAgendar = () => {
    if (form.fechaNuevaGestion && form.horaNuevaGestion) {
      const mensaje = `Gestión agendada para: ${form.fechaNuevaGestion} a las ${form.horaNuevaGestion} por ${usuarioActual}`;
      console.log(mensaje);
      alert(mensaje);
      set('fechaGestion', form.fechaNuevaGestion);
      set('horaGestion', form.horaNuevaGestion);
    } else {
      alert('Por favor seleccione fecha y hora para agendar');
    }
  };

  const np1Options = form.np0 ? opcionesNP1[form.np0] ?? [] : [];
  const np2Options = form.np1 ? opcionesNP2[form.np1] ?? [] : [];

  return (
    <div className="ficha-card">
      <div className="ficha-gestion-header">
        <span className="fg-title">FICHA DE GESTIÓN</span>
      </div>

      {/* ─── DATOS DE CONTACTO ─── */}
      <div className="ficha-block ficha-block--compact">
        {/* Inputs de texto → label al costado */}
        <div className="form-grid g2 form-grid--inline">
          <div className="form-row-inline">
            <label className="form-label form-label--inline">Nombre Contacto:</label>
            <input
              type="text"
              className="form-input form-input--inline-field"
              placeholder="Ingresar nombre..."
              value={form.nombreContacto}
              onChange={(e) => set('nombreContacto', e.target.value)}
            />
          </div>
          <div className="form-row-inline">
            <label className="form-label form-label--inline">Cargo:</label>
            <input
              type="text"
              className="form-input form-input--inline-field"
              placeholder="Ingresar cargo..."
              value={form.cargo}
              onChange={(e) => set('cargo', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ─── CLASIFICACIÓN ─── */}
      <div className="ficha-block ficha-block--compact">
        {/* Selects con menú → label arriba (como estaban) */}
        <div className="form-grid g3">
          <SelectField
            label="Clasificación - Respuesta Operación"
            badge="NP0"
            options={opcionesNP0}
            value={form.np0}
            onChange={handleNP0Change}
            placeholder="Seleccionar NP0..."
          />
          <SelectField
            label="Respuesta de Operación"
            badge="NP1"
            options={np1Options}
            value={form.np1}
            onChange={handleNP1Change}
            placeholder={form.np0 ? 'Seleccionar NP1...' : 'Primero seleccione NP0'}
            disabled={!form.np0}
          />
          <SelectField
            label="Sub-Respuesta de Operación"
            badge="NP2"
            options={np2Options}
            value={form.np2}
            onChange={(val) => set('np2', val)}
            placeholder={form.np1 ? 'Seleccionar NP2...' : 'Primero seleccione NP1'}
            disabled={!form.np1}
          />
        </div>

        {/* Estado y Tipo → selects con menú → label arriba */}
        <div className="form-grid g2 form-grid--tight">
          <SelectField
            label="Estado de Gestión"
            options={estadosGestion}
            value={form.estadoGestion}
            onChange={(val) => set('estadoGestion', val)}
            placeholder="Seleccionar estado..."
          />
          <SelectField
            label="Tipo de Gestión"
            options={tiposGestion}
            value={form.tipoGestion}
            onChange={(val) => set('tipoGestion', val)}
            placeholder="Seleccionar tipo..."
          />
        </div>

        {/* Teléfono → input de texto → label al costado */}
        <div className="form-row-inline form-row-inline--tel">
          <label className="form-label form-label--inline">Teléfono:</label>
          <div className="tel-input-group">
            <input
              type="tel"
              className="form-input form-input--inline-field"
              placeholder="Ingresar teléfono..."
              value={form.telefono}
              onChange={(e) => set('telefono', e.target.value)}
            />
            <button
              type="button"
              className="btn btn-whatsapp btn-whatsapp--compact"
              onClick={() => {
                const telefono = form.telefono.replace(/\D/g, '');
                if (!telefono) {
                  alert('Por favor ingrese un número de teléfono');
                  return;
                }
                const mensaje = encodeURIComponent('Hola, me comunico de [Empresa] respecto a su gestión.');
                window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
              }}
              disabled={!form.telefono}
              title="Abrir WhatsApp"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* ─── GESTOR ─── */}
      <div className="ficha-block ficha-block--compact">
        <div className="gestor-row gestor-row--compact">
          <button className="btn btn-info btn-xs" type="button">🔍 Buscar Gestor</button>
          <input type="text" className="form-input form-input--xs" placeholder="ID Gestor" value={form.gestorId} onChange={(e) => set('gestorId', e.target.value)} readOnly style={{ width: '70px' }} />
          <input type="text" className="form-input form-input--xs" placeholder="Nombre del gestor" value={form.gestorNombre} onChange={(e) => set('gestorNombre', e.target.value)} readOnly style={{ flex: 1 }} />
        </div>
      </div>

      {/* ─── ACCIONES A TOMAR ─── */}
      <div className="ficha-block ficha-block--compact">
        <SectionHeader title="ACCIONES A TOMAR" accent />
        {/* Fechas y montos → inputs de texto → label al costado */}
        <div className="form-grid g3 form-grid--inline">
          <div className="form-row-inline">
            <label className="form-label form-label--inline">Fecha Compromiso:</label>
            <input
              type="date"
              className="form-input form-input--inline-field"
              value={form.fechaCompromisoPago}
              onChange={(e) => set('fechaCompromisoPago', e.target.value)}
            />
          </div>
          <div className="form-row-inline">
            <label className="form-label form-label--inline">Compromiso S/.:</label>
            <input
              type="number"
              className="form-input form-input--inline-field"
              placeholder="0.00"
              value={form.compromisoSoles}
              onChange={(e) => set('compromisoSoles', e.target.value)}
            />
          </div>
          <div className="form-row-inline">
            <label className="form-label form-label--inline">Compromiso $US:</label>
            <input
              type="number"
              className="form-input form-input--inline-field"
              placeholder="0.00"
              value={form.compromisoUSD}
              onChange={(e) => set('compromisoUSD', e.target.value)}
            />
          </div>
        </div>

        {/* Agendar gestión → fechas/hora → label al costado */}
        <div className="agendar-gestion-row agendar-gestion-row--compact agendar-gestion-row--inline">
          <div className="form-row-inline">
            <label className="form-label form-label--inline">Fecha Nueva Gestión:</label>
            <input
              type="date"
              className="form-input form-input--inline-field"
              value={form.fechaNuevaGestion}
              onChange={(e) => set('fechaNuevaGestion', e.target.value)}
            />
          </div>
          <div className="form-row-inline">
            <label className="form-label form-label--inline">Hora:</label>
            <input
              type="time"
              className="form-input form-input--inline-field"
              value={form.horaNuevaGestion}
              onChange={(e) => set('horaNuevaGestion', e.target.value)}
            />
          </div>
          <div className="form-row-inline">
            <label className="form-label form-label--inline">Usuario:</label>
            <input
              type="text"
              className="form-input form-input--inline-field"
              value={usuarioActual}
              readOnly
              disabled
            />
          </div>
          <button className="btn btn-primary btn-xs agendar-btn" type="button" onClick={handleAgendar}>
            Agendar
          </button>
        </div>

        {/* Fecha de gestión → label al costado */}
        <div className="fecha-gestion-row fecha-gestion-row--compact fecha-gestion-row--inline">
          <div className="form-row-inline">
            <label className="form-label form-label--inline">Fecha de Gestión:</label>
            <input
              type="date"
              className="form-input form-input--inline-field"
              value={form.fechaGestion}
              onChange={(e) => set('fechaGestion', e.target.value)}
            />
          </div>
          <div className="form-row-inline">
            <label className="form-label form-label--inline">Hora:</label>
            <input
              type="time"
              className="form-input form-input--inline-field"
              value={form.horaGestion}
              onChange={(e) => set('horaGestion', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ─── RESULTADOS ─── */}
      <div className="ficha-block ficha-block--compact">
        <SectionHeader title="RESULTADOS DE LA LLAMADA" accent />
        <div className="resultados-row">
          <CheckboxField label="Gestión Terminada" checked={form.gestionTerminada} onChange={(val) => set('gestionTerminada', val)} />
          {/* TextArea → label arriba por ser campo grande */}
          <TextAreaField
            label="Observaciones"
            placeholder="Ingresar observaciones..."
            value={form.observaciones}
            onChange={(e) => set('observaciones', e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <div className="ficha-submit ficha-submit--compact">
        <button className="btn btn-danger btn-sm" type="button" onClick={() => setForm(initialForm)}>Limpiar</button>
        <button className="btn btn-primary btn-sm" type="button" onClick={() => onSubmit?.(form)}>Guardar Gestión</button>
      </div>

      <Modal isOpen={modalOpen} title={modalTitle} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default FichaGestion;