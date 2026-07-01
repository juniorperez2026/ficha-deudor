import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type Dispatch,
  type SetStateAction,
} from 'react';

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
  setErrors: Dispatch<SetStateAction<Record<string, string>>>;
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

  useEffect(() => {
    initialFormRef.current = initialForm;
  }, [initialForm]);

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

  const lastEntityKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!entity || !mapEntityToForm) {
      if (lastEntityKeyRef.current !== null) {
        setForm(initialFormRef.current);
        setInitialSnapshot(JSON.stringify(initialFormRef.current));
        lastEntityKeyRef.current = null;
      }

      return;
    }

    const currentKey = JSON.stringify(entity);

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
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));

      setErrors((prev) => {
        const fieldName = field as string;

        if (!prev[fieldName]) {
          return prev;
        }

        const newErrors = { ...prev };
        delete newErrors[fieldName];

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