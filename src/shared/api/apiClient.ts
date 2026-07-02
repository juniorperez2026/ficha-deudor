import { env } from "../../app/config/env";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type MockFn<T> = () => T | Promise<T>;

interface ApiRequestOptions<T = unknown> {
  method?: HttpMethod;
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  mock?: MockFn<T>;
  useMock?: boolean;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getErrorMessage(errorData: unknown): string {
  if (isRecord(errorData)) {
    const message = errorData.message;
    const messageUser = errorData.messageUser;
    const title = errorData.title;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (typeof messageUser === "string" && messageUser.trim()) {
      return messageUser;
    }

    if (typeof title === "string" && title.trim()) {
      return title;
    }
  }

  if (typeof errorData === "string" && errorData.trim()) {
    return errorData;
  }

  return "Ocurrió un error al procesar la solicitud.";
}

async function parseResponseData(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function normalizeApiError(response: Response): Promise<ApiError> {
  const errorData = await parseResponseData(response);
  const message = getErrorMessage(errorData);

  return new ApiError(message, response.status, errorData);
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiRequestOptions<T> = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    signal,
    headers = {},
    mock,
    useMock = env.useMocks,
  } = options;

  if (useMock && mock) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return await mock();
  }

  const response = await fetch(`${env.apiBaseUrl}${endpoint}`, {
    method,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw await normalizeApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await parseResponseData(response);
  return data as T;
}