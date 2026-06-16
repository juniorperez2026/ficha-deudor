import { useState, useEffect, useCallback } from 'react';

interface UseModalFormOptions<TForm, TEntity = object> {
  initialForm: TForm;
  entity?: TEntity | null;
  mapEntityToForm?: (entity: TEntity) => TForm;
  onClose: () => void;
  onSubmit: (data: TForm) => void;
  resetOnClose?: boolean;
  validate?: (data: TForm) => Record<string, string>;
}

interface UseModalFormResult<TForm> {
  form: TForm;
  handleChange: <K extends keyof TForm>(
    field: K,
    value: TForm[K]
  ) => void;
  handleSubmit: () => void;
  handleCancel: () => void;
  resetForm: () => void;
  isDirty: boolean;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function useModalForm<TForm extends object, TEntity = object>({
  initialForm,
  entity,
  mapEntityToForm,
  onClose,
  onSubmit,
  resetOnClose = true,
  validate,
}: UseModalFormOptions<TForm, TEntity>): UseModalFormResult<TForm> {
  const [form, setForm] = useState<TForm>(initialForm);
  const [initialSnapshot, setInitialSnapshot] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (entity && mapEntityToForm) {
      const mapped = mapEntityToForm(entity);
      setForm(mapped);
      setInitialSnapshot(JSON.stringify(mapped));
    } else {
      setForm(initialForm);
      setInitialSnapshot(JSON.stringify(initialForm));
    }

    setErrors({});
  }, [entity, mapEntityToForm, initialForm]);

  const handleChange = useCallback(
    <K extends keyof TForm>(field: K, value: TForm[K]) => {
      setForm(prev => ({
        ...prev,
        [field]: value,
      }));

      if (errors[field as string]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const resetForm = useCallback(() => {
    setForm(initialForm);
    setErrors({});
  }, [initialForm]);

  const handleSubmit = useCallback(() => {
    if (validate) {
      const validationErrors = validate(form);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    onSubmit(form);

    if (resetOnClose) {
      resetForm();
    }

    onClose();
  }, [form, onSubmit, onClose, resetOnClose, resetForm, validate]);

  const handleCancel = useCallback(() => {
    if (resetOnClose) {
      resetForm();
    }

    onClose();
  }, [onClose, resetOnClose, resetForm]);

  const isDirty = JSON.stringify(form) !== initialSnapshot;

  return {
    form,
    handleChange,
    handleSubmit,
    handleCancel,
    resetForm,
    isDirty,
    errors,
    setErrors,
  };
}