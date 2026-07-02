import React, { useState } from 'react';
import { ModalFormLayout } from '../../../layout/ModalFormLayout';

import { FormGrid } from '../../../../../../shared/components/ui/FormGrid';

import {
  InputField,
  SelectField,
  TextAreaField,
} from '../../../../../../shared/components/ui';

import { useModalForm } from '../../../../../../shared/hooks/ui/useModalForm';

import { useEmailById, useEmailStatuses } from '../../../../hooks/popups/useEmailsByDeudor';
import type { EmailEditFormData, EmailByIdApi, DeudorInfo } from '../../../../../../shared/types';

import {
  prioridadesOptions,
  estadosEmailOptions,
} from '../../../../mocks/catalogoEmail';

import { validateEmailEditForm } from '../../../../validations/popups/emailValidations';
import { getErrorMessage } from '../../../../utils/getErrorMessage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  emailId: string | null;
  onGuardar?: (data: EmailEditFormData) => void | Promise<void>;
  deudorData?: DeudorInfo | null;
}

const INITIAL_FORM: EmailEditFormData = {
  id: '',
  email: '',
  contacto: '',
  comentario: '',
  prioridad: '',
  estado: true,
  status: '',
  dFecRegistro: '',
};

const mapApiToFormData = (api: EmailByIdApi): EmailEditFormData => ({
  id: String(api.nId_PersEmail),
  email: api.cPers_Email ?? '',
  contacto: api.cEmail_Contacto ?? '',
  comentario: api.cEmail_Coment ?? '',
  prioridad: api.nEmail_Prioridad ? String(api.nEmail_Prioridad) : '',
  estado: api.bEstado ?? true,
  status: api.nId_PersEmailOpe ? String(api.nId_PersEmailOpe) : '',
  dFecRegistro: api.dFecRegistro ?? '',
});

const ModalEditarEmail: React.FC<Props> = ({
  isOpen,
  onClose,
  emailId,
  onGuardar,
  deudorData,
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    data: emailApi,
    isLoading: isLoadingEmail,
    error: errorEmail,
  } = useEmailById(emailId);

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
  } = useModalForm<EmailEditFormData, EmailByIdApi>({
    initialForm: INITIAL_FORM,
    entity: emailApi,
    mapEntityToForm: mapApiToFormData,
    onClose,
    onSubmit: () => undefined,
    validate: validateEmailEditForm,
    resetOnClose: true,
  });

  const handleClose = () => {
    setSubmitError(null);
    handleCancel();
  };

  const submitEmail = async () => {
    const validationErrors = validateEmailEditForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitError(null);

    try {
      await onGuardar?.(form);
      resetForm();
      onClose();
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'No se pudo guardar la edición del email. Intente nuevamente.'));
    }
  };

  const handleSubmitEmail = () => {
    void submitEmail();
  };

  if (!isOpen || !emailId) return null;

  if (isLoadingEmail) {
    return (
      <ModalFormLayout
        isOpen={isOpen}
        title="EDITAR EMAIL"
        onClose={handleClose}
        submitLabel="Guardar Cambios"
        onSubmit={() => undefined}
        minHeight="auto"
        deudorData={deudorData}
      >
        <div className="loading-message">Cargando datos del email...</div>
      </ModalFormLayout>
    );
  }

  if (errorEmail) {
    return (
      <ModalFormLayout
        isOpen={isOpen}
        title="EDITAR EMAIL"
        onClose={handleClose}
        submitLabel="Guardar Cambios"
        onSubmit={() => undefined}
        minHeight="auto"
        deudorData={deudorData}
      >
        <div className="error-message">
          Error al cargar el email: {String(errorEmail)}
        </div>
      </ModalFormLayout>
    );
  }

  if (!emailApi) {
    return (
      <ModalFormLayout
        isOpen={isOpen}
        title="EDITAR EMAIL"
        onClose={handleClose}
        submitLabel="Guardar Cambios"
        onSubmit={() => undefined}
        minHeight="auto"
        deudorData={deudorData}
      >
        <div className="error-message">No se encontraron datos del email</div>
      </ModalFormLayout>
    );
  }

  return (
    <ModalFormLayout
      isOpen={isOpen}
      title="EDITAR EMAIL"
      onClose={handleClose}
      submitLabel="Guardar Cambios"
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

export default ModalEditarEmail;