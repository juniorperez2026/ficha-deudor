import { apiClient } from '../../../shared/api/apiClient';
import type {
  ApiResponse,
  ApiResponseSimple,
  GestionRealizada,
  GestionRealizadaApi,
  GestionCompleta,
  GestionHistoricaApi,
} from '../../../shared/types/indexApi';

const BASE_GESTION = '/v1/Gestion';

// ─── GET: Gestiones Resumidas ───
export async function fetchGestionesRealizadas(
  id_cliente: string,
  id_cartera: string,
  id_deudor: string,
  id_usuario: string,
): Promise<{ resumido: GestionRealizada[] }> {
  const params = new URLSearchParams({
    nId_Cliente: id_cliente,
    nId_Cartera: id_cartera,
    nId_Persdeudor: id_deudor,
    nId_PerfilUsuario: id_usuario,
    PageNumber: '1',
    PageSize: '1000',
  });

  const result = await apiClient<ApiResponseSimple<GestionRealizadaApi[]>>(
    `${BASE_GESTION}/GetGestionGestionesCarteraDeudor?${params.toString()}`,
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando gestiones');
  }
  
  const resumido: GestionRealizada[] = result.response.map((item) => ({
    id: String(item.nId_DocxCobrarOpe),
    nro: item.nro,
    fecha: item.fechaGestion,
    gestor: item.gestor,
    documento: item.documento,
    operacion: item.operacion,
    respuesta: item.respuesta,
    comentario: item.comentario,
  }));

  return { resumido };
}

// ─── GET: Gestiones Históricas (Vista Expandida / Completa) ───
export async function fetchGestionesHistoricas(
  id_cliente: string,
  id_cartera: string,
  id_deudor: string,
  pageNumber: number = 1,
  pageSize: number = 1000,
): Promise<{
  completo: GestionCompleta[];
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
    throw new Error(result.message || 'Error cargando gestiones históricas');
  }

  const completo: GestionCompleta[] = result.response.map((item) => ({
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