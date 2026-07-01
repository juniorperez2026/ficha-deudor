export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "",
  useMocks: import.meta.env.VITE_USE_MOCKS === "true",
  useClientesMock: import.meta.env.VITE_USE_CLIENTES_MOCK === "true",
  useDocumentosMock: import.meta.env.VITE_USE_DOCUMENTOS_MOCK === "true",
};