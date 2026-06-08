export interface LoginFormErrors {
  username?: string;
  password?: string;
}

export const validateLoginForm = (values: {
  username: string;
  password: string;
}): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  if (!values.username.trim()) {
    errors.username = 'El usuario es obligatorio';
  } else if (values.username.trim().length < 3) {
    errors.username = 'El usuario debe tener al menos 3 caracteres';
  }

  if (!values.password) {
    errors.password = 'La contraseña es obligatoria';
  } else if (values.password.length < 4) {
    errors.password = 'La contraseña debe tener al menos 4 caracteres';
  }

  return errors;
};

/**
 * Verifica si hay errores en el formulario
 */
export const hasErrors = (errors: LoginFormErrors): boolean =>
  Object.keys(errors).length > 0;