import type {
  TelefonoFormData,
  TelefonoEditFormData,
} from '../../../shared/types';

// Validación para registrar teléfono
export const validateTelefonoForm = (
  data: TelefonoFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Campos obligatorios
  if (!data.numero.trim()) {
    errors.numero = 'El número telefónico es obligatorio';
  } else if (data.numero.length < 6) {
    errors.numero = 'El número debe tener al menos 6 dígitos';
  } else if (!/^[0-9+\-\s]+$/.test(data.numero)) {
    errors.numero = 'Ingrese un número telefónico válido';
  }

  if (!data.resultado) {
    errors.resultado = 'El resultado es obligatorio';
  }

  if (!data.operadorTelefonico) {
    errors.operadorTelefonico = 'El operador es obligatorio';
  }

  if (!data.ubicacion) {
    errors.ubicacion = 'La ubicación es obligatoria';
  }

  // Campos opcionales
  if (data.anexo && data.anexo.length > 10) {
    errors.anexo = 'El anexo no puede tener más de 10 caracteres';
  }

  if (data.comentario && data.comentario.length > 500) {
    errors.comentario = 'El comentario no puede exceder 500 caracteres';
  }

  return errors;
};

// Validación para editar teléfono
export const validateTelefonoEditForm = (
  data: TelefonoEditFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Campos obligatorios
  if (!data.numero.trim()) {
    errors.numero = 'El número telefónico es obligatorio';
  } else if (data.numero.length < 6) {
    errors.numero = 'El número debe tener al menos 6 dígitos';
  } else if (!/^[0-9+\-\s]+$/.test(data.numero)) {
    errors.numero = 'Ingrese un número telefónico válido';
  }

  if (!data.resultado) {
    errors.resultado = 'El resultado es obligatorio';
  }

  if (!data.operadorTelefonico) {
    errors.operadorTelefonico = 'El operador es obligatorio';
  }

  if (!data.ubicacion) {
    errors.ubicacion = 'La ubicación es obligatoria';
  }

  // Campos opcionales
  if (data.anexo && data.anexo.length > 10) {
    errors.anexo = 'El anexo no puede tener más de 10 caracteres';
  }

  if (data.comentario && data.comentario.length > 500) {
    errors.comentario = 'El comentario no puede exceder 500 caracteres';
  }

  return errors;
};