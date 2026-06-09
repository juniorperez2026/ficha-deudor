import { apiClient } from '../../../shared/api/apiClient';
import type {
  ApiResponse,
  EstadoGestion,
  EstadoGestionApi,
  EstadoGestionCompleta,
} from '../../../shared/types/indexApi';

const BASE_GESTION = '/v1/Gestion';

export async function fetchEstadosGestion(
  id_cliente: string,
  id_cartera: string,
  id_deudor: string,
): Promise<{ resumido: EstadoGestion[]; completo: EstadoGestionCompleta[] }> {
  const params = new URLSearchParams({
    nId_Cliente: id_cliente,
    nId_Cartera: id_cartera,
    nId_Persdeudor: id_deudor,
    PageNumber: '1',
    PageSize: '1000',
  });

  const result = await apiClient<ApiResponse<EstadoGestionApi[]>>(
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

  // La vista completa viene del mismo endpoint o de otro GET separado
  return {
    resumido,
    completo: [], // ← Se llenará con otro fetch cuando esté el endpoint
  };
}