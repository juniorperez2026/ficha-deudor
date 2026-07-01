export function toStringValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
}

export function toNumberValue(value: unknown): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function toBooleanValue(value: unknown): boolean {
  if (value === true || value === 1) {
    return true;
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();

    return normalizedValue === 'true' || normalizedValue === '1';
  }

  return false;
}