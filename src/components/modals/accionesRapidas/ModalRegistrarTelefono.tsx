import React, { useState } from 'react';
import Modal from '../Modal';
import DeudorHeaderBlock from '../../ficha/DeudorHeaderBlock';
import {
  InputField,
  SelectField,
  TextAreaField,
  ActionButton,
} from '../../ui';
import type { TelefonoFormData } from '../../../types';
import { deudorHeaderMock } from '../../../data/deudorHeaderMock';
import {
  resultadosOptions,
  operadoresOptions,
  ubicacionesOptions,
  prioridadesOptions,
  horariosGestionOptions,
  fuentesBusquedaOptions,
  referenciasOptions,
  reclamoIndecopiOptions,
} from '../../../data/catalogosTelefono';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegistrar?: (data: TelefonoFormData) => void;
}

const initialForm: TelefonoFormData = {
  numero: '',
  anexo: '',
  resultado: '',
  operadorTelefonico: '',
  ubicacion: '',
  prioridad: '',
  horarioGestion: '',
  comentario: '',
  fuenteBusqueda: '',
  referencia: '',
  reclamoIndecopi: 'NO',
};

const ModalRegistrarTelefono: React.FC<Props> = ({ isOpen, onClose, onRegistrar }) => {
  const [form, setForm] = useState<TelefonoFormData>(initialForm);

  const handleChange = (field: keyof TelefonoFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onRegistrar?.(form);
    setForm(initialForm);
    onClose();
  };

  const handleCancel = () => {
    setForm(initialForm);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="REFERENCIA TELEFÓNICA" onClose={handleCancel} size="lg">
      <div style={{ padding: '16px', display: 'flex', gap: '16px', minHeight: '400px' }}>
        
        {/* Sidebar con datos del deudor */}
        <DeudorHeaderBlock data={deudorHeaderMock} />

        {/* Formulario */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <InputField
              label="Número"
              placeholder="Ingrese número telefónico"
              value={form.numero}
              onChange={(e) => handleChange('numero', e.target.value)}
              maxLength={15}
            />
            <InputField
              label="Anexo"
              placeholder="Anexo (opcional)"
              value={form.anexo}
              onChange={(e) => handleChange('anexo', e.target.value)}
              maxLength={10}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <SelectField
              label="Resultado"
              options={resultadosOptions}
              value={form.resultado}
              onChange={(v) => handleChange('resultado', v)}
              placeholder="-- Seleccione --"
            />
            <SelectField
              label="Operador"
              options={operadoresOptions}
              value={form.operadorTelefonico}
              onChange={(v) => handleChange('operadorTelefonico', v)}
              placeholder="-- Seleccione --"
            />
            <SelectField
              label="Ubicación"
              options={ubicacionesOptions}
              value={form.ubicacion}
              onChange={(v) => handleChange('ubicacion', v)}
              placeholder="-- Seleccione --"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <SelectField
              label="Prioridad"
              options={prioridadesOptions}
              value={form.prioridad}
              onChange={(v) => handleChange('prioridad', v)}
              placeholder="-- Seleccione --"
            />
            <SelectField
              label="Horario Gestión"
              options={horariosGestionOptions}
              value={form.horarioGestion}
              onChange={(v) => handleChange('horarioGestion', v)}
              placeholder="-- Seleccione --"
            />
          </div>

          <TextAreaField
            label="Comentario"
            placeholder="Ingrese comentario..."
            value={form.comentario}
            onChange={(e) => handleChange('comentario', e.target.value)}
            rows={2}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <SelectField
              label="Fuente Búsqueda"
              options={fuentesBusquedaOptions}
              value={form.fuenteBusqueda}
              onChange={(v) => handleChange('fuenteBusqueda', v)}
              placeholder="-- Seleccione --"
            />
            <SelectField
              label="Referencia"
              options={referenciasOptions}
              value={form.referencia}
              onChange={(v) => handleChange('referencia', v)}
              placeholder="-- Seleccione --"
            />
          </div>

          <SelectField
            label="Reclamo Indecopi"
            options={reclamoIndecopiOptions}
            value={form.reclamoIndecopi}
            onChange={(v) => handleChange('reclamoIndecopi', v)}
          />

          <div style={{ marginTop: 'auto', paddingTop: '12px', textAlign: 'right' }}>
            <ActionButton label="Registrar" variant="primary" size="md" icon="✓" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalRegistrarTelefono;