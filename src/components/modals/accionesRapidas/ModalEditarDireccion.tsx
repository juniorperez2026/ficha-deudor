import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import DeudorHeaderBlock from '../../ficha/DeudorHeaderBlock';
import {
  InputField,
  SelectField,
  TextAreaField,
  ActionButton,
} from '../../ui';
import type { DireccionReferenciada, DireccionEditFormData } from '../../../types';
import { deudorHeaderMock } from '../../../data/deudorHeaderMock';
import {
  departamentosOptions,
  provinciasOptions,
  distritosOptions,
  refUbicacionDirOptions,
  llegoDeBaseOptions,
  tipoDeudorOptions,
  estadosDireccionOptions,
} from '../../../data/catalogosDireccion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  direccion: DireccionReferenciada | null;
  onGuardar?: (data: DireccionEditFormData & { id: string }) => void;
}

// Mapeo de DireccionReferenciada → DireccionEditFormData
const mapToFormData = (d: DireccionReferenciada): DireccionEditFormData => ({
  direccion: d.direccion.split(',')[0] || d.direccion,  // Extraer solo la dirección sin distrito
  departamento: d.departamento || '',
  provincia: d.provincia || '',
  distrito: d.distrito || '',
  refUbicacion: d.refUbicacion,
  comentario: d.comentario || '',
  llegoDeBase: d.llegoDeBase || '',
  tipoDeudor: d.tipoDeudor,
  nombreAval: d.nombreAval || (d.tipoDeudor === 'Titular' ? '—' : d.nombre),
  estado: d.estado,
});

const ModalEditarDireccion: React.FC<Props> = ({ isOpen, onClose, direccion, onGuardar }) => {
  const [form, setForm] = useState<DireccionEditFormData>({
    direccion: '',
    departamento: '',
    provincia: '',
    distrito: '',
    refUbicacion: '',
    comentario: '',
    llegoDeBase: '',
    tipoDeudor: '',
    nombreAval: '',
    estado: '',
  });

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (direccion) {
      setForm(mapToFormData(direccion));
    }
  }, [direccion]);

  const handleChange = (field: keyof DireccionEditFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (direccion) {
      onGuardar?.({ ...form, id: direccion.id });
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!direccion) return null;

  return (
    <Modal isOpen={isOpen} title="EDITAR DIRECCIÓN" onClose={handleCancel} size="lg">
      <div style={{ padding: '16px', display: 'flex', gap: '16px', minHeight: '480px' }}>
        
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

          {/* ─── CAMPOS NUEVOS PARA EDICIÓN ─── */}
          <InputField
            label="Nombre Aval"
            placeholder="Nombre del aval o garante"
            value={form.nombreAval}
            onChange={(e) => handleChange('nombreAval', e.target.value)}
              />

          <SelectField
            label="Estado"
            options={estadosDireccionOptions}
            value={form.estado}
            onChange={(v) => handleChange('estado', v)}
            placeholder="-- Seleccione --"
          />

          {/* Botón Guardar */}
          <div style={{ marginTop: 'auto', paddingTop: '16px', textAlign: 'right' }}>
            <ActionButton
              label="Guardar Cambios"
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

export default ModalEditarDireccion;