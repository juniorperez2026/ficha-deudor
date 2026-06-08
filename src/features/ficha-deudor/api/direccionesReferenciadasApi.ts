import { apiClient } from '../../../shared/api/apiClient';
import { mockDireccionesReferenciadas } from '../mocks/mocks/direccionesReferenciadas';
import type {
  ApiResponse,
  DireccionReferenciada,
  DireccionReferenciadaApi,
  DireccionFormData,
  DireccionEditFormData,
} from '../../../shared/types/indexApi';

const BASE_GESTION = '/v1/Gestion';

// ─── GET: Todos los registros (carga masiva para filtros client-side) ───
export async function fetchDireccionesReferenciadas(
  id_cliente: string,
  id_deudor: string,
): Promise<DireccionReferenciada[]> {
  const params = new URLSearchParams({
    nId_Cliente: id_cliente,
    nId_Persdeudor: id_deudor,
    PageNumber: '1',
    PageSize: '1000',
  });

  const result = await apiClient<ApiResponse<DireccionReferenciadaApi[]>>(
    `${BASE_GESTION}/GetGestionDirecciones?${params.toString()}`,
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando direcciones');
  }
  
  return result.response.map((item) => ({
    id: String(item.nId_PersDirecc),
    direccion: item.direccion,
    refUbicacion: item.referenciaUbicacion,
    tipoDeudor: item.tipoDeudor,
    nombre: item.nombre,
    estado: item.estado,
    // Campos que no vienen en el GET pero existen en el type del frontend
    departamento: '',
    provincia: '',
    distrito: '',
    comentario: '',
    llegoDeBase: '',
    nombreAval: '',
  }));
}

// ─── POST: Crear nueva dirección ───
export async function createDireccion(
  id_cliente: string,
  id_deudor: string,
  data: DireccionFormData
): Promise<DireccionReferenciada> {
  return apiClient<DireccionReferenciada>(
    `${BASE_GESTION}/CreateDireccion`,
    {
      method: 'POST',
      body: {
        nId_Persdeudor: id_cliente,
        nId_Cartera: id_deudor,
        ...data,
      },
      mock: () => {
        const nuevo: DireccionReferenciada = {
          id: `DIR-${Date.now()}`,
          direccion: `${data.direccion}, ${data.distrito}`,
          refUbicacion: data.refUbicacion,
          tipoDeudor: data.tipoDeudor,
          nombre: data.tipoDeudor === 'Titular'
            ? 'S.A.A. INVERSIONES CENTENARIO'
            : data.tipoDeudor,
          estado: 'OPERATIVO',
          departamento: data.departamento,
          provincia: data.provincia,
          distrito: data.distrito,
          comentario: data.comentario,
          llegoDeBase: data.llegoDeBase,
          nombreAval: data.tipoDeudor === 'Titular' ? '—' : data.tipoDeudor,
        };

        if (!mockDireccionesReferenciadas[id_cliente]) {
          mockDireccionesReferenciadas[id_cliente] = [];
        }
        mockDireccionesReferenciadas[id_cliente].push(nuevo);

        return nuevo;
      },
    }
  );
}

// ─── PUT: Actualizar dirección existente ───
export async function updateDireccion(
  id_cliente: string,
  id_deudor: string,
  id_direccion: string,
  data: DireccionEditFormData
): Promise<DireccionReferenciada> {
  return apiClient<DireccionReferenciada>(
    `${BASE_GESTION}/UpdateDireccion/${id_direccion}`,
    {
      method: 'PUT',
      body: {
        nId_Persdeudor: id_cliente,
        nId_Cartera: id_deudor,
        idDireccion: id_direccion,
        ...data,
      },
      mock: () => {
        const lista = mockDireccionesReferenciadas[id_cliente] || [];
        const index = lista.findIndex((d) => d.id === id_direccion);

        if (index === -1) {
          throw new Error(`Dirección ${id_direccion} no encontrada`);
        }

        const actualizado: DireccionReferenciada = {
          ...lista[index],
          direccion: `${data.direccion}, ${data.distrito}`,
          departamento: data.departamento,
          provincia: data.provincia,
          distrito: data.distrito,
          refUbicacion: data.refUbicacion,
          comentario: data.comentario,
          llegoDeBase: data.llegoDeBase,
          tipoDeudor: data.tipoDeudor,
          nombreAval: data.nombreAval,
          estado: data.estado,
          nombre: data.tipoDeudor === 'Titular'
            ? 'S.A.A. INVERSIONES CENTENARIO'
            : data.nombreAval || data.tipoDeudor,
        };

        lista[index] = actualizado;
        return actualizado;
      },
    }
  );
}