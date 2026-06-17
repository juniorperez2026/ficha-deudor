import { useState, useEffect, useCallback, useRef } from 'react';

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
  const initialFormRef = useRef(initialForm);
  initialFormRef.current = initialForm;

  const [form, setForm] = useState<TForm>(() => {
    if (entity && mapEntityToForm) {
      return mapEntityToForm(entity);
    }
    return initialForm;
  });

  const [initialSnapshot, setInitialSnapshot] = useState<string>(() => {
    if (entity && mapEntityToForm) {
      return JSON.stringify(mapEntityToForm(entity));
    }
    return JSON.stringify(initialForm);
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ REF: guarda la última entidad procesada por CONTENIDO
  const lastEntityKeyRef = useRef<string | null>(null);

  useEffect(() => {
    // Si no hay entity o no hay mapper, resetear si es necesario
    if (!entity || !mapEntityToForm) {
      if (lastEntityKeyRef.current !== null) {
        setForm(initialFormRef.current);
        setInitialSnapshot(JSON.stringify(initialFormRef.current));
        lastEntityKeyRef.current = null;
      }
      return;
    }

    // Generar clave de la entidad actual por su contenido
    const currentKey = JSON.stringify(entity);

    // ✅ CLAVE: Si es exactamente la misma entidad que ya procesamos, NO hacer nada
    if (currentKey === lastEntityKeyRef.current) {
      return;
    }

    lastEntityKeyRef.current = currentKey;
    const mapped = mapEntityToForm(entity);
    setForm(mapped);
    setInitialSnapshot(JSON.stringify(mapped));
    setErrors({});
  }, [entity, mapEntityToForm]);

  const handleChange = useCallback(
    <K extends keyof TForm>(field: K, value: TForm[K]) => {
      setForm(prev => ({
        ...prev,
        [field]: value,
      }));

      setErrors(prev => {
        if (!prev[field as string]) return prev;
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    },
    []
  );

  const resetForm = useCallback(() => {
    if (entity && mapEntityToForm) {
      const mapped = mapEntityToForm(entity);
      setForm(mapped);
      setInitialSnapshot(JSON.stringify(mapped));
    } else {
      setForm(initialFormRef.current);
      setInitialSnapshot(JSON.stringify(initialFormRef.current));
    }
    setErrors({});
  }, [entity, mapEntityToForm]);

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