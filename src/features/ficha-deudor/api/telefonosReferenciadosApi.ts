import { apiClient } from '../../../shared/api/apiClient';
import { mockTelefonosReferenciados } from '../mocks/mocks/telefonosReferenciados';
import type { TelefonoReferenciado, TelefonoFormData, ApiResponse, 
              TelefonoReferenciadoApi, ApiResponseSimple, TelefonoList, 
              TelefonoResultadoApi, TelefonoOperadorApi,
              TelefonoUbicacionApi, TelefonoHorarioGestionApi,
              TelefonoFuenteBusquedaApi,
              TelefonoEditarApi,
              CreateTelefonoResponse,
              CreateTelefonoRequest} from '../../../shared/types/indexApi';

const BASE_GESTION = '/v1/Gestion';
const BASE_TELEFONO = '/v1/Telefono';

// ─── GET: Todos los registros (carga masiva para filtros client-side) ───
export async function fetchTelefonosReferenciados(
  id_cliente: string,
  id_deudor: string,
): Promise<TelefonoReferenciado[]> {
  const params = new URLSearchParams({
    nId_Cliente: id_cliente,
    nId_Persdeudor: id_deudor,
    PageNumber: '1',
    PageSize: '1000'
  });

  const result = await apiClient<ApiResponse<TelefonoReferenciadoApi[]>>(
    `${BASE_GESTION}/GetGestionTelefonos?${params.toString()}`,
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando teléfonos');
  }

  return result.response.map((item) => ({
    id: item.nId_PersTelef,
    prioridad: item.prioridad,
    numero: item.nroTelefono,                   // nroTelefono → numero
    horario: item.horario,
    refUbicacion: item.referenciaUbicacion,     // referenciaUbicacion → refUbicacion
    estado: item.estado,
    fechaEstado: item.fechaEstado,
    fechaBase: item.fechaBase,
    contactados: item.contactados,
    noContactados: item.noContactados,
    ivr: String(item.cantidadIvr),              // cantidadIvr (number) → ivr (string)
    fuente: item.fuente,
    ordenSearch: parseInt(item.ordenSearch, 10) || 0, // ordenSearch (string) → number
    // Campos que no vienen en el GET pero existen en el type del frontend
    anexo: '',
    operadorTelefonico: '',
    referencia: 0,
    reclamoIndecopi: false,
  }));
}

export async function fetchTelefonoById(
  idTelefono: number,
  signal?: AbortSignal
): Promise<TelefonoEditarApi> {
  // ← El ID va en el PATH, no como query parameter
  const result = await apiClient<ApiResponseSimple<TelefonoEditarApi>>(
    `${BASE_TELEFONO}/${idTelefono}`,  // ← /v1/Telefono/28494035
    { signal }
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando teléfono para editar');
  }

  return result.response;
}

// ─── POST: Crear nuevo teléfono ───
export async function createTelefono(
  id_cliente: string,
  id_deudor: string,
  id_usuario: string,
  data: TelefonoFormData
): Promise<CreateTelefonoResponse> {
  const body: CreateTelefonoRequest = {
    nId_PersDeudor: Number(id_deudor) || 0,
    nTelef_Pre: '',
    nTelef_Nro: data.numero,
    nTelef_Anexo: data.anexo,
    nId_PersRefUbi: Number(data.ubicacion) || 0,
    nTelef_Prioridad: Number(data.prioridad) || 0,
    cTelef_Coment: data.comentario,
    nId_PersDeudorGestionHrs: Number(data.horarioGestion) || 0,
    nId_PersTelefOpe: Number(data.resultado) || 0,
    nId_Fuente: Number(data.fuenteBusqueda) || 0,
    nreferencia: Number(data.referencia) || 0,
    nid_usuarioupd: Number(id_usuario) || 0,
    nId_OperadorTelefonico: Number(data.operadorTelefonico) || 0,
    bEstado: true, 
    dFecUlt_PerstelefOpe: new Date().toISOString(),
    dFecCarga_PersTelef: new Date().toISOString(),
    bReclamo: data.reclamoIndecopi,
  };

  const result = await apiClient<ApiResponse<CreateTelefonoResponse>>(
    `${BASE_TELEFONO}`,  // ← /v1/Telefono
    {
      method: 'POST',
      body,
    }
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error al crear teléfono');
  }

  return result.response;
}

// ─── PUT: Actualizar teléfono existente ───
export async function updateTelefono(
    id_cliente: string,
    id_deudor: string,
    id_telefono: number,
    data: TelefonoFormData
  ): Promise<TelefonoReferenciado> {
    return apiClient<TelefonoReferenciado>(
      `${BASE_GESTION}/UpdateTelefono/${id_telefono}`,
      {
        method: 'PUT',
        body: {
          nId_Cliente: id_cliente,
          nId_Persdeudor: id_deudor,
          idTelefono: id_telefono,
          ...data,
        },
        mock: () => {
          const lista = mockTelefonosReferenciados[id_deudor] || [];
          const index = lista.findIndex((t) => t.id === id_telefono);

          if (index === -1) {
            throw new Error(`Teléfono ${id_telefono} no encontrado`);
          }

          const actualizado: TelefonoReferenciado = {
            ...lista[index],
            numero: data.numero,
            anexo: data.anexo,
            estado: data.resultado,
            operadorTelefonico: data.operadorTelefonico,
            refUbicacion: data.ubicacion,
            prioridad: parseInt(data.prioridad, 10) || 0,
            horario: data.horarioGestion,
            fuente: data.fuenteBusqueda,
            referencia: data.referencia,
            reclamoIndecopi: data.reclamoIndecopi,
          };

          lista[index] = actualizado;
          return actualizado;
        },
      }
    );
  }

export async function fetchTelefonoResultados(signal?: AbortSignal): Promise<TelefonoList[]> {
  const result = await apiClient<ApiResponseSimple<TelefonoResultadoApi[]>>(
    `${BASE_TELEFONO}/GetTelefonoResultados`,
    { signal }
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando resultados telefónicos');
  }

  return result.response.map(item => ({
    id: String(item.nId_PersTelefOpe),
    nombre: item.cNombre_PersTelefOpe,
  }));
};

export async function fetchTelefonoOperadores(signal?: AbortSignal): Promise<TelefonoList[]> {
  const result = await apiClient<ApiResponseSimple<TelefonoOperadorApi[]>>(
    `${BASE_TELEFONO}/GetTelefonoOperadores`,
    { signal }
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando operadores telefónicos');
  }

  return result.response.map(item => ({
    id: String(item.nId_OperadorTelefonico),
    nombre: item.cAbrevOperadorTelef,
  }));
}

export async function fetchTelefonoUbicaciones(signal?: AbortSignal): Promise<TelefonoList[]> {
  const result = await apiClient<ApiResponseSimple<TelefonoUbicacionApi[]>>(
    `${BASE_TELEFONO}/GetTelefonoUbicaciones`,
    { signal }
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando ubicaciones telefónicas');
  }

  return result.response.map(item => ({
    id: String(item.nId_PersRefUbi),
    nombre: item.cNombre_PersRefUbi,
  }));
}

export async function fetchTelefonoHorarioGestion(signal?: AbortSignal): Promise<TelefonoList[]> {
  const result = await apiClient<ApiResponseSimple<TelefonoHorarioGestionApi[]>>(
    `${BASE_TELEFONO}/GetTelefonoHorarioGestion`,
    { signal }
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando horarios de gestión');
  }

  return result.response.map(item => ({
    id: String(item.nId_PersDeudorGestionHrs),
    nombre: item.cNombren_PersDeudorGestionHrs,
  }));
}

export async function fetchTelefonoFuenteBusqueda(signal?: AbortSignal): Promise<TelefonoList[]> {
  const result = await apiClient<ApiResponseSimple<TelefonoFuenteBusquedaApi[]>>(
    `${BASE_TELEFONO}/GetTelefonoFuenteBusqueda`,
    { signal }
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando fuentes de búsqueda');
  }

  return result.response.map(item => ({
    id: String(item.nId_Fuente),
    nombre: item.cDescripcion,
  }));
}