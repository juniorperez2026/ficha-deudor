import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import DeudorHeaderBlock from '../../ficha/DeudorHeaderBlock';
import {
  InputField,
  SelectField,
  TextAreaField,
  ActionButton,
} from '../../ui';
import type { TelefonoReferenciado, TelefonoFormData } from '../../../types';
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
  telefono: TelefonoReferenciado | null;
  onGuardar?: (data: TelefonoFormData & { id: string }) => void;
}

// Mapeo de TelefonoReferenciado → TelefonoFormData
const mapToFormData = (t: TelefonoReferenciado): TelefonoFormData => ({
  numero: t.numero,
  anexo: t.anexo,
  resultado: t.estado,              // ← estado se mapea a resultado
  operadorTelefonico: t.operadorTelefonico,
  ubicacion: t.refUbicacion,        // ← refUbicacion se mapea a ubicacion
  prioridad: t.prioridad.toString(),
  horarioGestion: t.horario,        // ← horario se mapea a horarioGestion
  comentario: '',                   // ← no existe en la interfaz, se deja vacío
  fuenteBusqueda: t.fuente,        // ← fuente se mapea a fuenteBusqueda
  referencia: t.referencia,
  reclamoIndecopi: t.reclamoIndecopi,
});

const ModalEditarTelefono: React.FC<Props> = ({ isOpen, onClose, telefono, onGuardar }) => {
  const [form, setForm] = useState<TelefonoFormData>({
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
  });

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (telefono) {
      setForm(mapToFormData(telefono));
    }
  }, [telefono]);

  const handleChange = (field: keyof TelefonoFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (telefono) {
      onGuardar?.({ ...form, id: telefono.id });
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!telefono) return null;

  return (
    <Modal isOpen={isOpen} title="EDITAR REFERENCIA TELEFÓNICA" onClose={handleCancel} size="lg">
      <div style={{ padding: '16px', display: 'flex', gap: '16px', minHeight: '400px' }}>
        
        {/* Sidebar con datos del deudor (reutilizado) */}
        <DeudorHeaderBlock data={deudorHeaderMock} />

        {/* Formulario de edición */}
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
            <ActionButton label="Guardar Cambios" variant="primary" size="md" icon="✓" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalEditarTelefono;