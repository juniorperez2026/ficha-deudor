import React, { useEffect, useMemo, useRef } from 'react';

import { ModalFormLayout } from '../../layout/ModalFormLayout';
import { FormGrid } from '../../../../../shared/components/ui/FormGrid';
import {
  InputField,
  SelectField,
  TextAreaField,
} from '../../../../../shared/components/ui';
import { useModalForm } from '../../../../../shared/hooks/ui/useModalForm';
import type { DireccionFormData } from '../../../../../shared/types';
import {
  toBooleanValue,
  toStringValue,
} from '../../../../../shared/utils/formValueMappers';
import {
  useDepartamentos,
  useProvincias,
  useDistritos,
  useDireccionUbicaciones,
} from '../../../hooks/useDireccionesReferenciadas';
import {
  llegoDeBaseOptions,
  tipoDeudorOptions,
} from '../../../mocks/catalogosDireccion';
import { validateDireccionForm } from '../../../validations/direccionValidations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegistrar?: (data: DireccionFormData) => void;
}

const INITIAL_FORM: DireccionFormData = {
  direccion: '',
  departamento: '',
  provincia: '',
  distrito: '',
  refUbicacion: '',
  comentario: '',
  llegoDeBase: false,
  tipoDeudor: 'TITULAR',
};

const ModalRegistrarDireccion: React.FC<Props> = ({
  isOpen,
  onClose,
  onRegistrar,
}) => {
  const previousDepartamentoRef = useRef(INITIAL_FORM.departamento);
  const previousProvinciaRef = useRef(INITIAL_FORM.provincia);

  const { form, errors, handleChange, handleSubmit, handleCancel } =
    useModalForm<DireccionFormData>({
      initialForm: INITIAL_FORM,
      onClose,
      onSubmit: (data) => {
        onRegistrar?.(data);
      },
      validate: validateDireccionForm,
      resetOnClose: true,
    });

  const {
    data: departamentosData,
    isLoading: isLoadingDepartamentos,
    error: errorDepartamentos,
  } = useDepartamentos();

  const {
    data: provinciasData,
    isLoading: isLoadingProvincias,
  } = useProvincias(form.departamento || null);

  const {
    data: distritosData,
    isLoading: isLoadingDistritos,
  } = useDistritos(form.departamento || null, form.provincia || null);

  const {
    data: ubicacionesData,
    isLoading: isLoadingUbicaciones,
    error: errorUbicaciones,
  } = useDireccionUbicaciones();

  const departamentos = useMemo(
    () =>
      departamentosData?.map((departamento) => ({
        id: departamento.id,
        label: departamento.nombre,
      })) ?? [],
    [departamentosData]
  );

  const provincias = useMemo(
    () =>
      provinciasData?.map((provincia) => ({
        id: provincia.id,
        label: provincia.nombre,
      })) ?? [],
    [provinciasData]
  );

  const distritos = useMemo(
    () =>
      distritosData?.map((distrito) => ({
        id: distrito.id,
        label: distrito.nombre,
      })) ?? [],
    [distritosData]
  );

  const refUbicacionOptions = useMemo(
    () =>
      ubicacionesData?.map((ubicacion) => ({
        id: ubicacion.id,
        label: ubicacion.nombre,
      })) ?? [],
    [ubicacionesData]
  );

  useEffect(() => {
    const previousDepartamento = previousDepartamentoRef.current;
    const departamentoChanged = previousDepartamento !== form.departamento;

    previousDepartamentoRef.current = form.departamento;

    if (!departamentoChanged) {
      return;
    }

    if (form.provincia) {
      handleChange('provincia', '');
    }

    if (form.distrito) {
      handleChange('distrito', '');
    }
  }, [form.departamento, form.provincia, form.distrito, handleChange]);

  useEffect(() => {
    const previousProvincia = previousProvinciaRef.current;
    const provinciaChanged = previousProvincia !== form.provincia;

    previousProvinciaRef.current = form.provincia;

    if (!provinciaChanged) {
      return;
    }

    if (form.distrito) {
      handleChange('distrito', '');
    }
  }, [form.provincia, form.distrito, handleChange]);

  const refUbicacionValue = toStringValue(
    form.refUbicacion || refUbicacionOptions[0]?.id
  );

  if (!isOpen) return null;

  return (
    <ModalFormLayout
      isOpen={isOpen}
      title="REGISTRAR DIRECCIÓN"
      onClose={handleCancel}
      submitLabel="Registrar"
      onSubmit={handleSubmit}
      minHeight="auto"
    >
      <InputField
        label="Dirección"
        layout="inline"
        placeholder="Ingrese dirección completa"
        value={toStringValue(form.direccion)}
        onChange={(e) => handleChange('direccion', e.target.value)}
        maxLength={200}
        error={errors.direccion}
        required
      />

      <FormGrid columns={3}>
        <SelectField
          label="Departamento"
          layout="inline"
          options={departamentos}
          value={toStringValue(form.departamento)}
          onChange={(v) => handleChange('departamento', v)}
          placeholder={isLoadingDepartamentos ? 'Cargando...' : '-- Seleccione --'}
          error={errors.departamento || errorDepartamentos || ''}
          required
          disabled={isLoadingDepartamentos}
        />

        <SelectField
          label="Provincia"
          layout="inline"
          options={provincias}
          value={toStringValue(form.provincia)}
          onChange={(v) => handleChange('provincia', v)}
          placeholder={isLoadingProvincias ? 'Cargando...' : '-- Seleccione --'}
          disabled={!form.departamento || isLoadingProvincias}
          error={errors.provincia}
          required
        />

        <SelectField
          label="Distrito"
          layout="inline"
          options={distritos}
          value={toStringValue(form.distrito)}
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
        value={refUbicacionValue}
        onChange={(v) => handleChange('refUbicacion', v)}
        error={errors.refUbicacion || errorUbicaciones || ''}
        disabled={isLoadingUbicaciones}
      />

      <TextAreaField
        label="Comentario / Des. Ref. (Opcional)"
        layout="inline"
        placeholder="Ingrese comentario o descripción de referencia..."
        value={toStringValue(form.comentario)}
        onChange={(e) => handleChange('comentario', e.target.value)}
        rows={3}
        maxLength={500}
        error={errors.comentario}
      />

      <FormGrid columns={2}>
        <SelectField
          label="Llegó de Base"
          layout="inline"
          options={llegoDeBaseOptions}
          value={form.llegoDeBase}
          onChange={(v) => handleChange('llegoDeBase', toBooleanValue(v))}
          error={errors.llegoDeBase}
          hidePlaceholder
        />

        <SelectField
          label="Tipo Deudor"
          layout="inline"
          options={tipoDeudorOptions}
          value={toStringValue(form.tipoDeudor)}
          onChange={(v) => handleChange('tipoDeudor', v)}
          error={errors.tipoDeudor}
          hidePlaceholder
        />
      </FormGrid>

      {Object.keys(errors).length > 0 && (
        <div className="error-summary">
          <strong>Por favor, corrija los siguientes errores:</strong>
          <ul>
            {Object.values(errors).map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </ModalFormLayout>
  );
};

export default ModalRegistrarDireccion;