export function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim() === '';
  }

  return false;
}

export function isValidNumberValue(value: unknown): boolean {
  if (value === null || value === undefined || value === '') {
    return false;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue);
}

export function isPositiveNumberValue(value: unknown): boolean {
  if (!isValidNumberValue(value)) {
    return false;
  }

  return Number(value) > 0;
}

export function isValidPhoneValue(value: unknown): boolean {
  if (isEmptyValue(value)) {
    return false;
  }

  const phone = String(value).trim();

  return /^[0-9]{6,15}$/.test(phone);
}

export function isValidEmailValue(value: unknown): boolean {
  if (isEmptyValue(value)) {
    return false;
  }

  const email = String(value).trim();

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}