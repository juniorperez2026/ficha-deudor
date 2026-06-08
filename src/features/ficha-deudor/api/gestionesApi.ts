import { apiClient } from '../../../shared/api/apiClient';
import type {
  ApiResponse,
  ApiResponseSimple,
  DocumentoApi,
  CabeceraPantallaApi,
  ColumnApi,
  BotonApi,
} from '../../../shared/types/indexApi';

const BASE_GESTION = '/v1/Gestion';
const BASE_DOCUMENTOS = '/v1/documentos';

// Campos estaticos que siempre vienen al inicio del response
const CAMPOS_ESTATICOS = [
  'nId_DocxCobrar',
  'mejorStatus',
  'nId_Moneda',
  'bEstado',
  'nZona',
  'bSelected',
  'nId_Estrategia',
  'nId_Cartera',
];

// ✅ Backend real existe → va directo al backend
export async function fetchColumnas(
  id_cliente: string,
  id_contrato: string
): Promise<ColumnApi[]> {
  const params = new URLSearchParams({
    nId_Cliente: id_cliente,
    nId_Contrato: id_contrato,
  });

  const result = await apiClient<ApiResponseSimple<CabeceraPantallaApi[]>>(
    `${BASE_GESTION}/GetGestionDocumentosCabecera?${params.toString()}`
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando cabeceras');
  }

  return mapCabecerasToColumns(result.response);
}

// ❌ NO hay backend real → usa mock siempre
export async function fetchBotones(
  id_cliente: string,
  id_cartera: string
): Promise<BotonApi[]> {
  return apiClient<BotonApi[]>(
    `${BASE_DOCUMENTOS}/botones?id_cliente=${id_cliente}&id_cartera=${id_cartera}`,
    {
      mock: () => mockBotones(id_cliente, id_cartera),
    }
  );
}

// ✅ Backend real existe → va directo al backend
export async function fetchGestiones(
  id_cliente: string,
  id_cartera: string,
  id_deudor: string,
  pageNumber: number,
  pageSize: number
): Promise<ApiResponse<DocumentoApi>> {
  const params = new URLSearchParams({
    nId_Cliente: id_cliente,
    nId_Cartera: id_cartera,
    nId_Persdeudor: id_deudor,
    PageNumber: String(pageNumber),
    PageSize: String(pageSize),
  });

  return apiClient<ApiResponse<DocumentoApi>>(
    `${BASE_GESTION}/GetGestionDocumentos?${params.toString()}`
  );
}

// ═══════════════════════════════════════════
// MAPEO: CabeceraPantallaApi → ColumnApi
// ═══════════════════════════════════════════
function mapCabecerasToColumns(cabeceras: CabeceraPantallaApi[]): ColumnApi[] {
  const ordenadas = [...cabeceras].sort((a, b) => a.orden - b.orden);

  return ordenadas.map((cab, index) => ({
    key: getDynamicFieldKey(index),
    label: cab.tituloCabeceraPantalla,
    type: inferTypeFromCabecera(cab),
  }));
}

function getDynamicFieldKey(index: number): string {
  return `dyn_${index}`;
}

function inferTypeFromCabecera(cab: CabeceraPantallaApi): ColumnApi['type'] {
  const tipoDato = cab.tipoDato.toUpperCase();
  const titulo = cab.tituloCabeceraPantalla.toLowerCase();

  if (tipoDato === 'MONEY') return 'money';
  if (titulo.includes('atraso')) return 'atraso';
  if (titulo.includes('vencimiento') || titulo.includes('fecha')) return 'date';
  if (titulo === 'estado' || titulo.includes('estado_')) return 'estado';
  return 'text';
}

export function mapResponseToDocumento(raw: Record<string, unknown>): DocumentoApi {
  const doc: DocumentoApi = {
    nId_DocxCobrar: Number(raw.nId_DocxCobrar),
    mejorStatus: Number(raw.mejorStatus),
    nId_Moneda: Number(raw.nId_Moneda),
    bEstado: Number(raw.bEstado),
    nZona: String(raw.nZona),
    bSelected: Boolean(raw.bSelected),
    nId_Estrategia: Number(raw.nId_Estrategia),
    nId_Cartera: Number(raw.nId_Cartera),
  };

  const dynamicKeys = Object.keys(raw).filter(
    (key) => !CAMPOS_ESTATICOS.includes(key)
  );

  for (const key of dynamicKeys) {
    doc[key] = raw[key];
  }

  return doc;
}

// ═══════════════════════════════════════════
// MOCKS
// ═══════════════════════════════════════════

function mockBotones(id_cliente: string, id_cartera: string): BotonApi[] {
  if (id_cliente === '95') {
    return [
      { id: 'estado_cuenta', label: 'ESTADO_CUENTA', action: 'modal_estado_cuenta' },
      { id: 'datos_cliente', label: 'DATOS_CLIENTE', action: 'modal_datos_cliente' },
      { id: 'cartas', label: 'CARTAS', action: 'modal_cartas' },
      { id: 'pagos', label: 'PAGOS', action: 'modal_pagos' },
      { id: 'email', label: 'EMAIL', action: 'modal_email' },
    ];
  }
  return [
    { id: 'estado_cuenta', label: 'ESTADO_CUENTA', action: 'modal_estado_cuenta' },
    { id: 'pagos', label: 'PAGOS', action: 'modal_pagos' },
  ];
}