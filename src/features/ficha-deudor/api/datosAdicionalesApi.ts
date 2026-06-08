import { apiClient } from '../../../shared/api/apiClient';
import type {
  ApiResponse,
  ApiResponseSimple,
  CabeceraDatosAdicionalesApi,
  DatoAdicionalApi,
  ColumnApi,
} from '../../../shared/types/indexApi';

const BASE_GESTION = '/v1/Gestion';

// ─── 1. CABECERAS DINAMICAS ───
export async function fetchCabeceraDatosAdicionales(
  id_cliente: string,
  pantalla: number
): Promise<ColumnApi[]> {
  const params = new URLSearchParams({
    nId_Cliente: id_cliente,
    pantalla: String(pantalla),
  });

  const result = await apiClient<ApiResponseSimple<CabeceraDatosAdicionalesApi>>(
    `${BASE_GESTION}/GetGestionDocumentosAdicionalesCabecera?${params.toString()}`,
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando cabeceras');
  }

  return mapCabeceraToColumns(result.response);
}

// ─── 2. TODOS LOS REGISTROS (sin paginacion) ───
export async function fetchAllDatosAdicionales(
  id_cliente: string,
  id_cartera: string,
  id_deudor: string
): Promise<DatoAdicionalApi[]> {
  // Si el backend tiene endpoint sin paginacion, usalo:
  // return apiClient<ApiResponseSimple<DatoAdicionalApi[]>>(...)

  // Por ahora simulamos con paginacion grande:
  const params = new URLSearchParams({
    nId_Cliente: id_cliente,
    nId_Cartera: id_cartera,
    nId_Persdeudor: id_deudor,
    PageNumber: '1',
    PageSize: '1000', // Cargamos todo de una vez
  });

  const result = await apiClient<ApiResponse<DatoAdicionalApi[]>>(
    `${BASE_GESTION}/GetGestionDocumentosAdicionales?${params.toString()}`,
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando datos adicionales');
  }

  return result.response;
}

// ═══════════════════════════════════════════
// MAPEO: Cabecera -> ColumnApi[]
// ═══════════════════════════════════════════
function mapCabeceraToColumns(cabecera: CabeceraDatosAdicionalesApi): ColumnApi[] {
  const columns: ColumnApi[] = [];

  for (const [key, value] of Object.entries(cabecera)) {
    if (key === 'idCab') continue;
    const label = String(value);
    const type = inferTypeFromLabel(key, label);
    columns.push({ key, label, type });
  }

  return columns;
}

function inferTypeFromLabel(key: string, label: string): ColumnApi['type'] {
  const lowerKey = key.toLowerCase();
  const lowerLabel = label.toLowerCase();

  if (lowerKey.includes('monto') || lowerKey.includes('importe') || lowerKey.includes('saldo') || lowerKey.includes('deuda')) return 'money';
  if (lowerKey.includes('atraso') || lowerKey.includes('dias')) return 'atraso';
  if (lowerKey.includes('fecha') || lowerKey.includes('vencimiento')) return 'date';
  if (lowerKey === 'estado' || lowerKey.includes('estadoservicio') || lowerKey.includes('estado_')) return 'estado';
  if (lowerLabel.includes('monto') || lowerLabel.includes('importe') || lowerLabel.includes('saldo')) return 'money';

  return 'text';
}
