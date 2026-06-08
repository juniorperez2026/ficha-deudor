const getBooleanEnv = (value: string | undefined): boolean => {
  return value === "true" || value === "1";
};

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "",
  useMocks: getBooleanEnv(import.meta.env.VITE_USE_MOCKS),
};