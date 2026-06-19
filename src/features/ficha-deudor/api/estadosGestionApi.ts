import { apiClient } from '../../../shared/api/apiClient';
import type {
  ApiResponse,
  ApiResponseSimple,
  EstadoGestion,
  EstadoGestionApi,
  EstadoGestionCompleta,
  GestionHistoricaApi,
} from '../../../shared/types/indexApi';

const BASE_GESTION = '/v1/Gestion';

// ─── GET: Estados de Gestión Resumidos ───
export async function fetchEstadosGestion(
  id_cliente: string,
  id_cartera: string,
  id_deudor: string,
): Promise<{ resumido: EstadoGestion[] }> {
  const params = new URLSearchParams({
    nId_Cliente: id_cliente,
    nId_Cartera: id_cartera,
    nId_Persdeudor: id_deudor,
    PageNumber: '1',
    PageSize: '1000',
  });

  const result = await apiClient<ApiResponseSimple<EstadoGestionApi[]>>(
    `${BASE_GESTION}/GetGestionEstadosGestionesCarteraDeudor?${params.toString()}`,
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando estados de gestión');
  }

  const resumido: EstadoGestion[] = result.response.map((item) => ({
    id: String(item.nId_DocxCobrarOpe),
    nro: item.nro,
    fecha: item.fechaGestion,
    operador: item.operador,
    documento: item.documento,
    operacion: item.operacion,
    resultado: item.resultado,
    comentario: item.comentario,
  }));

  return { resumido };
}

// ─── GET: Estados de Gestión Históricos (Vista Expandida / Completa) ───
export async function fetchEstadosGestionHistoricos(
  id_cliente: string,
  id_cartera: string,
  id_deudor: string,
  pageNumber: number = 1,
  pageSize: number = 1000,
): Promise<{
  completo: EstadoGestionCompleta[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}> {
  const params = new URLSearchParams({
    nId_Cliente: id_cliente,
    nId_Cartera: id_cartera,
    nId_PersDeudor: id_deudor,
    PageNumber: String(pageNumber),
    PageSize: String(pageSize),
  });

  const result = await apiClient<ApiResponse<GestionHistoricaApi[]>>(
    `${BASE_GESTION}/GetGestionEstadosGestionesCarteraDeudorHistorica?${params.toString()}`,
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando estados de gestión históricos');
  }

  const completo: EstadoGestionCompleta[] = result.response.map((item) => ({
    id: String(item.nId_DocxCobrarOpe),
    nro: item.nro,
    cliente: item.cliente,
    cartera: item.cartera,
    campana: item.campanna,
    fecha: item.fecha,
    gestor: item.gestor,
    documento: item.documento,
    operacion: item.operacion,
    resultado: item.resultado,
    comentario: item.comentario,
  }));

  return {
    completo,
    pageNumber: result.pageNumber,
    pageSize: result.pageSize,
    totalRecords: result.totalRecords,
    totalPages: result.totalPages,
  };
}