import React, { useState } from 'react';
import Modal from '../Modal';
import DeudorHeaderBlock from '../../ficha/DeudorHeaderBlock';
import {
  InputField,
  SelectField,
  TextAreaField,
  ActionButton,
} from '../../ui';
import type { DireccionFormData } from '../../../types';
import { deudorHeaderMock } from '../../../data/deudorHeaderMock';
import {
  departamentosOptions,
  provinciasOptions,
  distritosOptions,
  refUbicacionDirOptions,
  llegoDeBaseOptions,
  tipoDeudorOptions,
} from '../../../data/catalogosDireccion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegistrar?: (data: DireccionFormData) => void;
}

const initialForm: DireccionFormData = {
  direccion: '',
  departamento: '',
  provincia: '',
  distrito: '',
  refUbicacion: '',
  comentario: '',
  llegoDeBase: '',
  tipoDeudor: '',
};

const ModalRegistrarDireccion: React.FC<Props> = ({ isOpen, onClose, onRegistrar }) => {
  const [form, setForm] = useState<DireccionFormData>(initialForm);

  const handleChange = (field: keyof DireccionFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Registrando dirección:', form);
    onRegistrar?.(form);
    setForm(initialForm);
    onClose();
  };

  const handleCancel = () => {
    setForm(initialForm);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="REGISTRAR DIRECCIÓN" onClose={handleCancel} size="lg">
      <div style={{ padding: '16px', display: 'flex', gap: '16px', minHeight: '420px' }}>
        
        {/* Sidebar con datos del deudor */}
        <DeudorHeaderBlock data={deudorHeaderMock} />

        {/* Formulario */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <InputField
            label="Dirección"
            placeholder="Ingrese dirección completa"
            value={form.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <SelectField
              label="Departamento"
              options={departamentosOptions}
              value={form.departamento}
              onChange={(v) => handleChange('departamento', v)}
              placeholder="-- Seleccione --"
            />
            <SelectField
              label="Provincia"
              options={provinciasOptions}
              value={form.provincia}
              onChange={(v) => handleChange('provincia', v)}
              placeholder="-- Seleccione --"
            />
            <SelectField
              label="Distrito"
              options={distritosOptions}
              value={form.distrito}
              onChange={(v) => handleChange('distrito', v)}
              placeholder="-- Seleccione --"
            />
          </div>

          <SelectField
            label="Referencia de Ubicación"
            options={refUbicacionDirOptions}
            value={form.refUbicacion}
            onChange={(v) => handleChange('refUbicacion', v)}
            placeholder="-- Seleccione --"
          />

          <TextAreaField
            label="Comentario / Des. Ref."
            placeholder="Ingrese comentario o descripción de referencia..."
            value={form.comentario}
            onChange={(e) => handleChange('comentario', e.target.value)}
            rows={3}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <SelectField
              label="Llegó de Base"
              options={llegoDeBaseOptions}
              value={form.llegoDeBase}
              onChange={(v) => handleChange('llegoDeBase', v)}
              placeholder="-- Seleccione --"
            />
            <SelectField
              label="Tipo Deudor"
              options={tipoDeudorOptions}
              value={form.tipoDeudor}
              onChange={(v) => handleChange('tipoDeudor', v)}
              placeholder="-- Seleccione --"
            />
          </div>

          {/* Botón Registrar */}
          <div style={{ marginTop: 'auto', paddingTop: '16px', textAlign: 'right' }}>
            <ActionButton
              label="Registrar"
              variant="primary"
              size="md"
              icon="✓"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalRegistrarDireccion;