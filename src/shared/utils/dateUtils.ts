export function parseApiDate(value: unknown): string {
  if (!value) {
    return new Date().toISOString();
  }

  if (typeof value !== 'string') {
    return new Date().toISOString();
  }

  if (value.includes('T')) {
    return value;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return new Date().toISOString();
  }

  return parsedDate.toISOString();
}