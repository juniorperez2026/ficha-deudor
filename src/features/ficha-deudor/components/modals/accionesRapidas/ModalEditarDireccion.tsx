import React, { useMemo } from 'react';

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
import type {
  DireccionEditFormData,
  DireccionByIdApi,
} from '../../../../../shared/types';

import {
  useDepartamentos,
  useProvincias,
  useDistritos,
  useDireccionUbicaciones,
} from '../../../hooks/useDireccionesReferenciadas';

import {
  llegoDeBaseOptions,
  tipoDeudorOptions,
  estadosDireccionOptions,
} from '../../../mocks/catalogosDireccion';

import { validateDireccionEditForm } from '../../../validations/direccionValidations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  direccionId: string | null;
  direccionData: DireccionByIdApi | null;
  onGuardar?: (data: DireccionEditFormData & { id: string }) => void;
}

const INITIAL_FORM: DireccionEditFormData = {
  id: '',
  direccion: '',
  departamento: '',
  provincia: '',
  distrito: '',
  refUbicacion: '',
  comentario: '',
  llegoDeBase: false,
  tipoDeudor: '',
  nombreAval: '',
  estado: true,
};

const toSelectIdValue = (value: unknown): string => {
  return toNumberValue(value) ? toStringValue(value) : '';
};

const mapToFormData = (entity: DireccionByIdApi): DireccionEditFormData => ({
  id: toStringValue(entity.nId_PersDirecc),
  direccion: toStringValue(entity.cDirecc_Nomb),
  departamento: toSelectIdValue(entity.nId_Departamento),
  provincia: toSelectIdValue(entity.nId_Provincia),
  distrito: toSelectIdValue(entity.nId_Distrito),
  refUbicacion: toSelectIdValue(entity.nId_PersRefUbi),
  comentario: toStringValue(entity.cDirecc_Coment),
  llegoDeBase: toBooleanValue(entity.bOrigen_Base),
  tipoDeudor: toStringValue(entity.cTipoCoDeudor),
  nombreAval: toStringValue(entity.nombreAval),
  estado:
    entity.bEstado === null || entity.bEstado === undefined
      ? true
      : toBooleanValue(entity.bEstado),
});

const ModalEditarDireccion: React.FC<Props> = ({
  isOpen,
  onClose,
  direccionId,
  direccionData,
  onGuardar,
}) => {
  const { form, errors, handleChange, handleSubmit, handleCancel } =
    useModalForm<DireccionEditFormData, DireccionByIdApi>({
      initialForm: INITIAL_FORM,
      entity: direccionData,
      mapEntityToForm: mapToFormData,
      onClose,
      onSubmit: (data) => {
        if (direccionId) {
          onGuardar?.({ ...data, id: direccionId });
        }
      },
      validate: validateDireccionEditForm,
      resetOnClose: true,
    });

  const {
    data: departamentosData,
    isLoading: isLoadingDepartamentos,
    error: errorDepartamentos,
  } = useDepartamentos();

  const { data: provinciasData, isLoading: isLoadingProvincias } =
    useProvincias(form.departamento || null);

  const { data: distritosData, isLoading: isLoadingDistritos } = useDistritos(
    form.departamento || null,
    form.provincia || null
  );

  const {
    data: ubicacionesData,
    isLoading: isLoadingUbicaciones,
    error: errorUbicaciones,
  } = useDireccionUbicaciones();

  const departamentos = useMemo(
    () => departamentosData?.map((d) => ({ id: d.id, label: d.nombre })) ?? [],
    [departamentosData]
  );

  const provincias = useMemo(
    () => provinciasData?.map((p) => ({ id: p.id, label: p.nombre })) ?? [],
    [provinciasData]
  );

  const distritos = useMemo(
    () => distritosData?.map((d) => ({ id: d.id, label: d.nombre })) ?? [],
    [distritosData]
  );

  const refUbicacionOptions = useMemo(
    () => ubicacionesData?.map((u) => ({ id: u.id, label: u.nombre })) ?? [],
    [ubicacionesData]
  );

  const handleDepartamentoChange = (
    value: DireccionEditFormData['departamento']
  ) => {
    handleChange('departamento', value);
    handleChange('provincia', '');
    handleChange('distrito', '');
  };

  const handleProvinciaChange = (value: DireccionEditFormData['provincia']) => {
    handleChange('provincia', value);
    handleChange('distrito', '');
  };

  if (!isOpen || !direccionId) return null;

  return (
    <ModalFormLayout
      isOpen={isOpen}
      title="EDITAR DIRECCIÓN"
      onClose={handleCancel}
      submitLabel="Guardar Cambios"
      onSubmit={handleSubmit}
      minHeight="auto"
    >
      <InputField
        label="Dirección"
        layout="inline"
        placeholder="Ingrese dirección completa"
        value={form.direccion}
        onChange={(e) => handleChange('direccion', e.target.value)}
        error={errors.direccion}
        required
      />

      <FormGrid columns={3}>
        <SelectField
          label="Departamento"
          layout="inline"
          options={departamentos}
          value={form.departamento}
          onChange={handleDepartamentoChange}
          placeholder={isLoadingDepartamentos ? 'Cargando...' : '-- Seleccione --'}
          error={errors.departamento || errorDepartamentos || ''}
          required
          disabled={isLoadingDepartamentos}
        />

        <SelectField
          label="Provincia"
          layout="inline"
          options={provincias}
          value={form.provincia}
          onChange={handleProvinciaChange}
          placeholder={isLoadingProvincias ? 'Cargando...' : '-- Seleccione --'}
          disabled={!form.departamento || isLoadingProvincias}
          error={errors.provincia}
          required
        />

        <SelectField
          label="Distrito"
          layout="inline"
          options={distritos}
          value={form.distrito}
          onChange={(v) => handleChange('distrito', v)}
          placeholder={isLoadingDistritos ? 'Cargando...' : '-- Seleccione --'}
          disabled={!form.provincia || isLoadingDistritos}
          error={errors.distrito}
          required
        />
      </FormGrid>

      <SelectField
        label="Referencia de Ubicación"
        layout="inline"
        options={refUbicacionOptions}
        value={form.refUbicacion}
        onChange={(v) => handleChange('refUbicacion', v)}
        placeholder={isLoadingUbicaciones ? 'Cargando...' : '-- Seleccione --'}
        error={errors.refUbicacion || errorUbicaciones || ''}
        disabled={isLoadingUbicaciones}
      />

      <TextAreaField
        label="Comentario / Des. Ref. (Opcional)"
        layout="inline"
        placeholder="Ingrese comentario o descripción de referencia..."
        value={form.comentario}
        onChange={(e) => handleChange('comentario', e.target.value)}
        rows={3}
        error={errors.comentario}
      />

      <FormGrid columns={2}>
        <SelectField
          label="Llegó de Base"
          layout="inline"
          options={llegoDeBaseOptions}
          value={form.llegoDeBase}
          onChange={(v) => handleChange('llegoDeBase', toBooleanValue(v))}
          placeholder="---Seleccione---"
          error={errors.llegoDeBase}
        />

        <SelectField
          label="Tipo Deudor"
          layout="inline"
          options={tipoDeudorOptions}
          value={form.tipoDeudor}
          onChange={(v) => handleChange('tipoDeudor', v)}
          placeholder="---Seleccione---"
          error={errors.tipoDeudor}
        />
      </FormGrid>

      <SelectField
        label="Estado"
        layout="inline"
        options={estadosDireccionOptions}
        value={form.estado}
        onChange={(v) => handleChange('estado', toBooleanValue(v))}
        placeholder="---Seleccione---"
      />

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

export default ModalEditarDireccion;