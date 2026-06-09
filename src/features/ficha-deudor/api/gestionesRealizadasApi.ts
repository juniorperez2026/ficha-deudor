import { apiClient } from '../../../shared/api/apiClient';
import type {
  ApiResponse,
  GestionRealizada,
  GestionRealizadaApi,
  GestionCompleta,
} from '../../../shared/types/indexApi';

const BASE_GESTION = '/v1/Gestion';

export async function fetchGestionesRealizadas(
  id_cliente: string,
  id_cartera: string,
  id_deudor: string,
  id_usuario: string,
): Promise<{ resumido: GestionRealizada[]; completo: GestionCompleta[] }> {
  const params = new URLSearchParams({
    nId_Cliente: id_cliente,
    nId_Cartera: id_cartera,
    nId_Persdeudor: id_deudor,
    nId_PerfilUsuario: id_usuario,
    PageNumber: '1',
    PageSize: '1000',
  });

  const result = await apiClient<ApiResponse<GestionRealizadaApi[]>>(
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

  // La vista completa viene del mismo endpoint o de otro GET separado
  // Por ahora retornamos vacío para completo (se implementa con otro endpoint)
  return {
    resumido,
    completo: [], // ← Se llenará con otro fetch cuando esté el endpoint
  };
}
