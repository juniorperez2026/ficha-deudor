import React from 'react';

import { ModalFormLayout } from '../../layout/ModalFormLayout';
import { FormGrid } from '../../../../../shared/components/ui/FormGrid';
import {
  InputField,
  SelectField,
  TextAreaField,
} from '../../../../../shared/components/ui';
import { useModalForm } from '../../../../../shared/hooks/ui/useModalForm';
import {
  toBooleanValue,
  toNumberValue,
  toStringValue,
} from '../../../../../shared/utils/formValueMappers';
import {
  useTelefonoResultados,
  useTelefonoOperadores,
  useTelefonoUbicaciones,
  useTelefonoHorarioGestion,
  useTelefonoFuenteBusqueda,
  useTelefonoById,
} from '../../../hooks/useTelefonosReferenciados';
import type {
  TelefonoFormData,
  TelefonoEditarApi,
} from '../../../../../shared/types';
import {
  prioridadesOptions,
  referenciasOptions,
  reclamoIndecopiOptions,
} from '../../../mocks/catalogosTelefono';
import { validateTelefonoEditForm } from '../../../validations/telefonoValidations';
import { isEmptyValue } from '@shared/utils/validators';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  telefonoId: number | null;
  onGuardar?: (data: TelefonoFormData) => void;
}

const INITIAL_FORM: TelefonoFormData = {
  id: 0,
  numero: '',
  anexo: '',
  resultado: '',
  operadorTelefonico: '',
  ubicacion: '',
  prioridad: '',
  horarioGestion: '',
  comentario: '',
  fuenteBusqueda: '',
  referencia: 0,
  reclamoIndecopi: false,
  bEstado: false,
  dFecCarga_PersTelef: '',
};

const toSelectValue = (value: unknown): string => {
  const parsedValue = toNumberValue(value);

  return parsedValue > 0 ? toStringValue(parsedValue) : '';
};

const mapApiToFormData = (api: TelefonoEditarApi): TelefonoFormData => ({
  id: toNumberValue(api.nId_PersTelef),
  numero: toStringValue(api.nTelef_Nro),
  anexo: toStringValue(api.nTelef_Anexo),
  resultado: toSelectValue(api.nId_PersTelefOpe),
  operadorTelefonico: toSelectValue(api.nId_OperadorTelefonico),
  ubicacion: toSelectValue(api.nId_PersRefUbi),
  prioridad: toSelectValue(api.nTelef_Prioridad),
  horarioGestion: toSelectValue(api.nId_PersDeudorGestionHrs),
  comentario: toStringValue(api.cTelef_Coment),
  fuenteBusqueda: toSelectValue(api.nId_Fuente),
  referencia: toNumberValue(api.nreferencia),
  reclamoIndecopi: toBooleanValue(api.bReclamo),
  bEstado: toBooleanValue(api.bEstado),
  dFecCarga_PersTelef: toStringValue(api.dFecCarga_PersTelef),
});

const validateModalEditarTelefono = (
  data: TelefonoFormData
): Record<string, string> => {
  const errors = validateTelefonoEditForm(data);

  if (isEmptyValue(data.prioridad)) {
    errors.prioridad = 'La prioridad es obligatoria';
  }

  if (isEmptyValue(data.horarioGestion)) {
    errors.horarioGestion = 'El horario de gestión es obligatorio';
  }

  if (isEmptyValue(data.fuenteBusqueda)) {
    errors.fuenteBusqueda = 'La fuente de búsqueda es obligatoria';
  }

  return errors;
};

const ModalEditarTelefono: React.FC<Props> = ({
  isOpen,
  onClose,
  telefonoId,
  onGuardar,
}) => {
  const {
    data: telefonoApi,
    isLoading: isLoadingTelefono,
    error: errorTelefono,
  } = useTelefonoById(telefonoId);

  const telefonoEntity = telefonoApi as TelefonoEditarApi | null;

  const { form, errors, handleChange, handleSubmit, handleCancel } =
    useModalForm<TelefonoFormData, TelefonoEditarApi>({
      initialForm: INITIAL_FORM,
      entity: telefonoEntity,
      mapEntityToForm: mapApiToFormData,
      onClose,
      onSubmit: (data) => {
        onGuardar?.(data);
      },
      validate: validateModalEditarTelefono,
      resetOnClose: true,
    });

  const {
    data: resultadosData,
    isLoading: isLoadingResultados,
    error: errorResultados,
  } = useTelefonoResultados();

  const {
    data: operadoresData,
    isLoading: isLoadingOperadores,
    error: errorOperadores,
  } = useTelefonoOperadores();

  const {
    data: ubicacionesData,
    isLoading: isLoadingUbicaciones,
    error: errorUbicaciones,
  } = useTelefonoUbicaciones();

  const {
    data: horariosData,
    isLoading: isLoadingHorarios,
    error: errorHorarios,
  } = useTelefonoHorarioGestion();

  const {
    data: fuentesBusquedaData,
    isLoading: isLoadingFuentes,
    error: errorFuentes,
  } = useTelefonoFuenteBusqueda();

  const resultadosOptions =
    resultadosData?.map((r) => ({
      id: r.id,
      label: r.nombre,
    })) ?? [];

  const operadoresOptions =
    operadoresData?.map((o) => ({
      id: o.id,
      label: o.nombre,
    })) ?? [];

  const ubicacionesOptions =
    ubicacionesData?.map((u) => ({
      id: u.id,
      label: u.nombre,
    })) ?? [];

  const horariosGestionOptions =
    horariosData?.map((h) => ({
      id: h.id,
      label: h.nombre,
    })) ?? [];

  const fuentesBusquedaOptions =
    fuentesBusquedaData?.map((f) => ({
      id: f.id,
      label: f.nombre,
    })) ?? [];

  if (!isOpen || !telefonoId) return null;

  if (isLoadingTelefono) {
    return (
      <ModalFormLayout
        isOpen={isOpen}
        title="EDITAR REFERENCIA TELEFÓNICA"
        onClose={handleCancel}
        submitLabel="Guardar Cambios"
        onSubmit={() => undefined}
        minHeight="auto"
      >
        <div className="loading-message">Cargando datos del teléfono...</div>
      </ModalFormLayout>
    );
  }

  if (errorTelefono) {
    return (
      <ModalFormLayout
        isOpen={isOpen}
        title="EDITAR REFERENCIA TELEFÓNICA"
        onClose={handleCancel}
        submitLabel="Guardar Cambios"
        onSubmit={() => undefined}
        minHeight="auto"
      >
        <div className="error-message">
          Error al cargar el teléfono: {String(errorTelefono)}
        </div>
      </ModalFormLayout>
    );
  }

  if (!telefonoEntity) {
    return (
      <ModalFormLayout
        isOpen={isOpen}
        title="EDITAR REFERENCIA TELEFÓNICA"
        onClose={handleCancel}
        submitLabel="Guardar Cambios"
        onSubmit={() => undefined}
        minHeight="auto"
      >
        <div className="error-message">No se encontraron datos del teléfono</div>
      </ModalFormLayout>
    );
  }

  return (
    <ModalFormLayout
      isOpen={isOpen}
      title="EDITAR REFERENCIA TELEFÓNICA"
      onClose={handleCancel}
      submitLabel="Guardar Cambios"
      onSubmit={handleSubmit}
      minHeight="auto"
    >
      <FormGrid columns={2}>
        <InputField
          label="Número Telefónico"
          layout="inline"
          placeholder="Ingrese número telefónico"
          value={form.numero}
          onChange={(e) => handleChange('numero', e.target.value)}
          maxLength={15}
          error={errors.numero}
          required
        />

        <InputField
          label="Anexo"
          layout="inline"
          placeholder="Anexo"
          value={form.anexo}
          onChange={(e) => handleChange('anexo', e.target.value)}
          maxLength={10}
          error={errors.anexo}
        />
      </FormGrid>

      <FormGrid columns={3}>
        <SelectField
          label="Resultado"
          layout="inline"
          options={resultadosOptions}
          value={form.resultado}
          onChange={(v) => handleChange('resultado', v)}
          placeholder={isLoadingResultados ? 'Cargando...' : '-- Seleccione --'}
          error={errors.resultado || errorResultados || ''}
          required
          disabled={isLoadingResultados}
        />

        <SelectField
          label="Operador Telf."
          layout="inline"
          options={operadoresOptions}
          value={form.operadorTelefonico}
          onChange={(v) => handleChange('operadorTelefonico', v)}
          placeholder={isLoadingOperadores ? 'Cargando...' : '-- Seleccione --'}
          error={errors.operadorTelefonico || errorOperadores || ''}
          required
          disabled={isLoadingOperadores}
        />

        <SelectField
          label="Ubicación"
          layout="inline"
          options={ubicacionesOptions}
          value={form.ubicacion}
          onChange={(v) => handleChange('ubicacion', v)}
          placeholder={isLoadingUbicaciones ? 'Cargando...' : '-- Seleccione --'}
          error={errors.ubicacion || errorUbicaciones || ''}
          required
          disabled={isLoadingUbicaciones}
        />
      </FormGrid>

      <FormGrid columns={3}>
        <SelectField
          label="Prioridad"
          layout="inline"
          options={prioridadesOptions}
          value={form.prioridad}
          onChange={(v) => handleChange('prioridad', v)}
          placeholder="-- Seleccione --"
          error={errors.prioridad}
          required
        />

        <SelectField
          label="Horario Gestión"
          layout="inline"
          options={horariosGestionOptions}
          value={form.horarioGestion}
          onChange={(v) => handleChange('horarioGestion', v)}
          placeholder={isLoadingHorarios ? 'Cargando...' : '-- Seleccione --'}
          error={errors.horarioGestion || errorHorarios || ''}
          required
          disabled={isLoadingHorarios}
        />

        <SelectField
          label="Fuente Búsqueda"
          layout="inline"
          options={fuentesBusquedaOptions}
          value={form.fuenteBusqueda}
          onChange={(v) => handleChange('fuenteBusqueda', v)}
          placeholder={isLoadingFuentes ? 'Cargando...' : '-- Seleccione --'}
          error={errors.fuenteBusqueda || errorFuentes || ''}
          required
          disabled={isLoadingFuentes}
        />
      </FormGrid>

      <TextAreaField
        label="Comentario"
        layout="inline"
        placeholder="Ingrese comentario..."
        value={form.comentario}
        onChange={(e) => handleChange('comentario', e.target.value)}
        rows={2}
        error={errors.comentario}
      />

      <FormGrid columns={2}>
        <SelectField
          label="Referencia"
          layout="inline"
          options={referenciasOptions}
          value={form.referencia}
          onChange={(v) => handleChange('referencia', toNumberValue(v))}
          placeholder="-- Seleccione --"
          error={errors.referencia}
        />

        <SelectField
          label="Reclamo Indecopi"
          layout="inline"
          options={reclamoIndecopiOptions}
          value={form.reclamoIndecopi}
          onChange={(v) => handleChange('reclamoIndecopi', toBooleanValue(v))}
          error={errors.reclamoIndecopi}
          hidePlaceholder
        />
      </FormGrid>

      {Object.keys(errors).length > 0 && (
        <div className="error-summary">
          <strong>Por favor, corrija los siguientes errores:</strong>
          <ul>
            {Object.values(errors).map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </ModalFormLayout>
  );
};

export default ModalEditarTelefono;