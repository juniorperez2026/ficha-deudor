import type { DireccionFormData, DireccionEditFormData } from '../../../shared/types';

// Validación para registrar dirección
export const validateDireccionForm = (data: DireccionFormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!data.direccion.trim()) {
    errors.direccion = 'La dirección es obligatoria';
  } else if (data.direccion.length < 5) {
    errors.direccion = 'Ingrese una dirección más completa (mínimo 5 caracteres)';
  } else if (data.direccion.length > 200) {
    errors.direccion = 'La dirección no puede exceder 200 caracteres';
  }
  
  if (!data.departamento) {
    errors.departamento = 'Seleccione un departamento';
  }
  
  if (!data.provincia) {
    errors.provincia = 'Seleccione una provincia';
  }
  
  if (!data.distrito) {
    errors.distrito = 'Seleccione un distrito';
  }
  
  if (data.comentario && data.comentario.length > 500) {
    errors.comentario = 'El comentario no puede exceder 500 caracteres';
  }
  
  return errors;
};

// Validación para editar dirección (incluye campos adicionales)
export const validateDireccionEditForm = (data: DireccionEditFormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  console.log('Validando:', data);

  // Validaciones obligatorias
  if (!data.direccion.trim()) {
    errors.direccion = 'La dirección es obligatoria';
  } else if (data.direccion.length < 5) {
    errors.direccion = 'Ingrese una dirección más completa (mínimo 5 caracteres)';
  } else if (data.direccion.length > 200) {
    errors.direccion = 'La dirección no puede exceder 200 caracteres';
  }
  
  if (!data.departamento) {
    errors.departamento = 'Seleccione un departamento';
  }
  
  if (!data.provincia) {
    errors.provincia = 'Seleccione una provincia';
  }
  
  if (!data.distrito) {
    errors.distrito = 'Seleccione un distrito';
  }
  
  // Validación de comentario (opcional)
  if (data.comentario && data.comentario.length > 500) {
    errors.comentario = 'El comentario no puede exceder 500 caracteres';
  }
  
  console.log('Errores:', errors);
  
  return errors;
};