import { apiClient } from '../../../shared/api/apiClient';

import type {
  TelefonoReferenciado,
  TelefonoFormData,
  ApiResponse,
  TelefonoReferenciadoApi,
  ApiResponseSimple,
  TelefonoList,
  TelefonoResultadoApi,
  TelefonoOperadorApi,
  TelefonoUbicacionApi,
  TelefonoHorarioGestionApi,
  TelefonoFuenteBusquedaApi,
  TelefonoEditarApi,
  CreateTelefonoResponse,
  CreateTelefonoRequest,
} from '../../../shared/types/indexApi';

import { parseApiDate } from '@shared/utils/dateUtils';
import { toNumberValue, toStringValue } from '@shared/utils/formValueMappers';

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
    PageSize: '1000',
  });

  const result = await apiClient<ApiResponse<TelefonoReferenciadoApi[]>>(
    `${BASE_TELEFONO}/GetTelefonos?${params.toString()}`,
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando teléfonos');
  }

  return result.response.map((item) => ({
    id: item.nId_PersTelef,
    prioridad: item.prioridad,
    numero: item.nroTelefono,
    horario: item.horario,
    refUbicacion: item.referenciaUbicacion,
    estado: item.estado,
    fechaEstado: item.fechaEstado,
    fechaBase: item.fechaBase,
    contactados: item.contactados,
    noContactados: item.noContactados,
    ivr: toStringValue(item.cantidadIvr),
    fuente: item.fuente,
    ordenSearch: toNumberValue(item.ordenSearch),

    // Campos que no vienen en el GET pero existen en el type del frontend
    anexo: '',
    operadorTelefonico: '',
    referencia: 0,
    reclamoIndecopi: false,
  }));
}

export async function fetchTelefonoById(
  idTelefono: number,
  signal?: AbortSignal,
): Promise<TelefonoEditarApi> {
  const result = await apiClient<ApiResponseSimple<TelefonoEditarApi>>(
    `${BASE_TELEFONO}/${idTelefono}`,
    { signal },
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando teléfono para editar');
  }

  return result.response;
}

// ─── POST: Crear nuevo teléfono ───
export async function createTelefono(
  _id_cliente: string,
  id_deudor: string,
  id_usuario: string,
  data: TelefonoFormData,
): Promise<CreateTelefonoResponse> {
  const nowIso = new Date().toISOString();

  const body: CreateTelefonoRequest = {
    nId_PersDeudor: toNumberValue(id_deudor),
    nTelef_Pre: '',
    nTelef_Nro: toStringValue(data.numero),
    nTelef_Anexo: toStringValue(data.anexo),
    nId_PersRefUbi: toNumberValue(data.ubicacion),
    nTelef_Prioridad: toNumberValue(data.prioridad),
    cTelef_Coment: toStringValue(data.comentario),
    nId_PersDeudorGestionHrs: toNumberValue(data.horarioGestion),
    nId_PersTelefOpe: toNumberValue(data.resultado),
    nId_Fuente: toNumberValue(data.fuenteBusqueda),
    nreferencia: toNumberValue(data.referencia),
    nid_usuarioupd: toNumberValue(id_usuario),
    nId_OperadorTelefonico: toNumberValue(data.operadorTelefonico),
    bEstado: data.bEstado ?? true,
    dFecUlt_PerstelefOpe: nowIso,
    dFecCarga_PersTelef: nowIso,
    bReclamo: data.reclamoIndecopi ?? false,
  };

  const result = await apiClient<ApiResponse<CreateTelefonoResponse>>(
    BASE_TELEFONO,
    {
      method: 'POST',
      body,
    },
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error al crear teléfono');
  }

  return result.response;
}

// ─── PUT: Actualizar teléfono existente ───
export async function updateTelefono(
  _id_cliente: string,
  id_deudor: string,
  id_usuario: string,
  id_telefono: number,
  data: TelefonoFormData,
): Promise<CreateTelefonoResponse> {
  const numero = toStringValue(data.numero);

  const [nTelef_Pre, nTelef_Nro] = numero.includes('-')
    ? numero.split('-', 2)
    : ['', numero];

  const body: CreateTelefonoRequest = {
    nId_PersTelef: id_telefono,
    nId_PersDeudor: toNumberValue(id_deudor),
    nTelef_Pre: toStringValue(nTelef_Pre),
    nTelef_Nro: toStringValue(nTelef_Nro),
    nTelef_Anexo: toStringValue(data.anexo),
    nId_PersRefUbi: toNumberValue(data.ubicacion),
    nTelef_Prioridad: toNumberValue(data.prioridad),
    cTelef_Coment: toStringValue(data.comentario),
    nId_PersDeudorGestionHrs: toNumberValue(data.horarioGestion),
    nId_PersTelefOpe: toNumberValue(data.resultado),
    nId_Fuente: toNumberValue(data.fuenteBusqueda),
    nreferencia: toNumberValue(data.referencia),
    nid_usuarioupd: toNumberValue(id_usuario),
    nId_OperadorTelefonico: toNumberValue(data.operadorTelefonico),
    bEstado: data.bEstado ?? true,
    dFecUlt_PerstelefOpe: new Date().toISOString(),
    dFecCarga_PersTelef: parseApiDate(data.dFecCarga_PersTelef),
    bReclamo: data.reclamoIndecopi ?? false,
  };

  const result = await apiClient<ApiResponse<CreateTelefonoResponse>>(
    BASE_TELEFONO,
    {
      method: 'PUT',
      body,
    },
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error al actualizar teléfono');
  }

  return result.response;
}

export async function fetchTelefonoResultados(
  signal?: AbortSignal,
): Promise<TelefonoList[]> {
  const result = await apiClient<ApiResponseSimple<TelefonoResultadoApi[]>>(
    `${BASE_TELEFONO}/GetTelefonoResultados`,
    { signal },
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando resultados telefónicos');
  }

  return result.response.map((item) => ({
    id: toStringValue(item.nId_PersTelefOpe),
    nombre: item.cNombre_PersTelefOpe,
  }));
}

export async function fetchTelefonoOperadores(
  signal?: AbortSignal,
): Promise<TelefonoList[]> {
  const result = await apiClient<ApiResponseSimple<TelefonoOperadorApi[]>>(
    `${BASE_TELEFONO}/GetTelefonoOperadores`,
    { signal },
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando operadores telefónicos');
  }

  return result.response.map((item) => ({
    id: toStringValue(item.nId_OperadorTelefonico),
    nombre: item.cAbrevOperadorTelef,
  }));
}

export async function fetchTelefonoUbicaciones(
  signal?: AbortSignal,
): Promise<TelefonoList[]> {
  const result = await apiClient<ApiResponseSimple<TelefonoUbicacionApi[]>>(
    `${BASE_TELEFONO}/GetTelefonoUbicaciones`,
    { signal },
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando ubicaciones telefónicas');
  }

  return result.response.map((item) => ({
    id: toStringValue(item.nId_PersRefUbi),
    nombre: item.cNombre_PersRefUbi,
  }));
}

export async function fetchTelefonoHorarioGestion(
  signal?: AbortSignal,
): Promise<TelefonoList[]> {
  const result = await apiClient<ApiResponseSimple<TelefonoHorarioGestionApi[]>>(
    `${BASE_TELEFONO}/GetTelefonoHorarioGestion`,
    { signal },
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando horarios de gestión');
  }

  return result.response.map((item) => ({
    id: toStringValue(item.nId_PersDeudorGestionHrs),
    nombre: item.cNombren_PersDeudorGestionHrs,
  }));
}

export async function fetchTelefonoFuenteBusqueda(
  signal?: AbortSignal,
): Promise<TelefonoList[]> {
  const result = await apiClient<ApiResponseSimple<TelefonoFuenteBusquedaApi[]>>(
    `${BASE_TELEFONO}/GetTelefonoFuenteBusqueda`,
    { signal },
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando fuentes de búsqueda');
  }

  return result.response.map((item) => ({
    id: toStringValue(item.nId_Fuente),
    nombre: item.cDescripcion,
  }));
}