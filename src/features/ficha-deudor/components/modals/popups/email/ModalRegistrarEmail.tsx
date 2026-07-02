import React, { useState } from 'react';

import { ModalFormLayout } from '../../../layout/ModalFormLayout';
import { FormGrid } from '../../../../../../shared/components/ui/FormGrid';
import {
  InputField,
  SelectField,
  TextAreaField,
} from '../../../../../../shared/components/ui';
import { useModalForm } from '../../../../../../shared/hooks/ui/useModalForm';
import { useEmailStatuses } from '../../../../hooks/popups/useEmailsByDeudor';
import type { DeudorInfo, EmailFormData } from '../../../../../../shared/types';

import {
  prioridadesOptions,
  estadosEmailOptions,
} from '../../../../mocks/catalogoEmail';

import { validateEmailForm } from '../../../../validations/popups/emailValidations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegistrar?: (data: EmailFormData) => void | Promise<void>;
  deudorData?: DeudorInfo | null;
}

const initialForm: EmailFormData = {
  email: '',
  contacto: '',
  comentario: '',
  prioridad: '',
  estado: true,
  status: '',
};

const getSubmitErrorMessage = (err: unknown): string => {
  if (err instanceof Error && err.message.trim()) {
    return err.message;
  }

  return 'No se pudo registrar el email. Intente nuevamente.';
};

const ModalRegistrarEmail: React.FC<Props> = ({
  isOpen,
  onClose,
  onRegistrar,
  deudorData,
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    data: statusesData,
    isLoading: isLoadingStatuses,
    error: errorStatuses,
  } = useEmailStatuses();

  const statusesOptions =
    statusesData?.map((s) => ({
      id: s.id,
      label: s.nombre,
    })) ?? [];

  const {
    form,
    errors,
    setErrors,
    handleChange,
    handleCancel,
    resetForm,
  } = useModalForm<EmailFormData>({
    initialForm,
    onClose,
    onSubmit: () => undefined,
    validate: validateEmailForm,
    resetOnClose: true,
  });

  const handleClose = () => {
    setSubmitError(null);
    handleCancel();
  };

  const submitEmail = async () => {
    const validationErrors = validateEmailForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitError(null);

    try {
      await onRegistrar?.(form);
      resetForm();
      onClose();
    } catch (err) {
      setSubmitError(getSubmitErrorMessage(err));
    }
  };

  const handleSubmitEmail = () => {
    void submitEmail();
  };

  if (!isOpen) return null;

  return (
    <ModalFormLayout
      isOpen={isOpen}
      title="REGISTRAR EMAIL"
      onClose={handleClose}
      submitLabel="Registrar"
      onSubmit={handleSubmitEmail}
      minHeight="auto"
      deudorData={deudorData}
    >
      <FormGrid columns={1}>
        <InputField
          label="Email"
          layout="inline"
          placeholder="Ingrese email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          maxLength={100}
          error={errors.email}
          required
        />
      </FormGrid>

      <FormGrid columns={1}>
        <InputField
          label="Contacto"
          layout="inline"
          placeholder="Ingrese nombre del contacto"
          value={form.contacto}
          onChange={(e) => handleChange('contacto', e.target.value)}
          maxLength={150}
          error={errors.contacto}
          required
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
          label="Estado"
          layout="inline"
          options={estadosEmailOptions}
          value={form.estado}
          onChange={(v) => handleChange('estado', v)}
          placeholder="-- Seleccione --"
          hidePlaceholder
        />

        <SelectField
          label="Status"
          layout="inline"
          options={statusesOptions}
          value={form.status}
          onChange={(v) => handleChange('status', v)}
          placeholder={isLoadingStatuses ? 'Cargando...' : '-- Seleccione --'}
          error={errors.status || errorStatuses || ''}
          required
          disabled={isLoadingStatuses}
        />
      </FormGrid>

      <TextAreaField
        label="Comentario"
        layout="inline"
        placeholder="Ingrese comentario..."
        value={form.comentario}
        onChange={(e) => handleChange('comentario', e.target.value)}
        rows={3}
        error={errors.comentario}
      />

      {submitError && (
        <div className="error-summary">
          <strong>No se pudo completar la operación:</strong>
          <ul>
            <li>{submitError}</li>
          </ul>
        </div>
      )}

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

export default ModalRegistrarEmail;