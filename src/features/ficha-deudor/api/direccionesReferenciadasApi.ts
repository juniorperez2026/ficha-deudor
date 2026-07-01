import { apiClient } from '../../../shared/api/apiClient';
import type {
  ApiResponse,
  DireccionReferenciada,
  DireccionReferenciadaApi,
  DireccionFormData,
  DireccionEditFormData,
  Departamento,
  ApiResponseSimple,
  DepartamentoApi,
  Provincia,
  ProvinciaApi,
  Distrito,
  DistritoApi,
  DireccionUbicacion,
  DireccionUbicacionApi,
  CreateDireccionResponse,
  CreateDireccionRequest,
  DireccionByIdApi,
  UpdateDireccionResponse,
  UpdateDireccionRequest,
} from '../../../shared/types/indexApi';
import { toNumberValue, toStringValue } from '@shared/utils/formValueMappers';

const BASE_DIRECCION = '/v1/Direccion';

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
    `${BASE_DIRECCION}/GetDirecciones?${params.toString()}`,
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando direcciones');
  }

  return result.response.map((item) => ({
    id: toStringValue(item.nId_PersDirecc),
    direccion: toStringValue(item.direccion),
    refUbicacion: toStringValue(item.referenciaUbicacion),
    tipoDeudor: toStringValue(item.tipoDeudor),
    nombre: toStringValue(item.nombre),
    estado: toStringValue(item.estado),

    // Campos que no vienen en el GET pero existen en el type del frontend
    departamento: '',
    provincia: '',
    distrito: '',
    comentario: '',
    llegoDeBase: false,
    nombreAval: '',
  }));
}

// ─── POST: Crear nueva dirección ───
export async function createDireccion(
  id_cliente: string,
  id_deudor: string,
  id_usuario: string,
  data: DireccionFormData,
): Promise<CreateDireccionResponse> {
  const body: CreateDireccionRequest = {
    nId_PersDeudor: toNumberValue(id_deudor),
    cDirecc_Nomb: toStringValue(data.direccion),
    nId_PersRefUbi: toNumberValue(data.refUbicacion),
    cDirecc_Coment: toStringValue(data.comentario),
    bEstado: true,
    bOrigen_Base: data.llegoDeBase,
    cTipoCoDeudor: toStringValue(data.tipoDeudor),
    dFec_Actualizacion: new Date().toISOString(),
    nId_Cliente: toNumberValue(id_cliente),
    nid_CalifDirecc: null,
    nid_usuarioUpd: toNumberValue(id_usuario),
    nId_Departamento: toNumberValue(data.departamento),
    nId_Provincia: toNumberValue(data.provincia),
    nId_Distrito: toNumberValue(data.distrito),
  };

  const result = await apiClient<ApiResponse<CreateDireccionResponse>>(
    `${BASE_DIRECCION}`,
    {
      method: 'POST',
      body,
    },
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error al crear dirección');
  }

  return result.response;
}

// ─── GET: Obtener dirección por ID ───
export async function fetchDireccionById(
  idDireccion: string,
  signal?: AbortSignal,
): Promise<DireccionByIdApi> {
  const result = await apiClient<ApiResponse<DireccionByIdApi>>(
    `${BASE_DIRECCION}/${idDireccion}`,
    { signal },
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando dirección para editar');
  }

  return result.response;
}

// ─── PUT: Actualizar dirección existente ───
export async function updateDireccion(
  id_cliente: string,
  id_deudor: string,
  id_usuario: string,
  id_direccion: string,
  data: DireccionEditFormData,
): Promise<UpdateDireccionResponse> {
  const body: UpdateDireccionRequest = {
    nId_PersDirecc: toNumberValue(id_direccion),
    nId_PersDeudor: toNumberValue(id_deudor),
    cDirecc_Nomb: toStringValue(data.direccion),
    nId_PersRefUbi: toNumberValue(data.refUbicacion),
    cDirecc_Coment: toStringValue(data.comentario),
    bEstado: data.estado,
    bOrigen_Base: data.llegoDeBase,
    cTipoCoDeudor: toStringValue(data.tipoDeudor),
    dFec_Actualizacion: new Date().toISOString(),
    nId_Cliente: toNumberValue(id_cliente),
    nid_CalifDirecc: null,
    nid_usuarioUpd: toNumberValue(id_usuario),
    nId_Departamento: toNumberValue(data.departamento),
    nId_Provincia: toNumberValue(data.provincia),
    nId_Distrito: toNumberValue(data.distrito),
  };

  const result = await apiClient<ApiResponse<UpdateDireccionResponse>>(
    `${BASE_DIRECCION}`,
    {
      method: 'PUT',
      body,
    },
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error al actualizar dirección');
  }

  return result.response;
}

export async function fetchDepartamentos(
  signal?: AbortSignal,
): Promise<Departamento[]> {
  const result = await apiClient<ApiResponseSimple<DepartamentoApi[]>>(
    `${BASE_DIRECCION}/GetDireccionDepartamentos`,
    { signal },
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando departamentos');
  }

  return result.response.map((item) => ({
    id: toStringValue(item.nId_Departamento),
    nombre: toStringValue(item.cNombre_Departamento),
  }));
}

export async function fetchProvincias(
  idDepartamento: string,
  signal?: AbortSignal,
): Promise<Provincia[]> {
  const result = await apiClient<ApiResponseSimple<ProvinciaApi[]>>(
    `${BASE_DIRECCION}/GetDireccionProvincias`,
    {
      signal,
      headers: {
        nId_Departamento: idDepartamento,
      },
    },
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando provincias');
  }

  return result.response.map((item) => ({
    id: toStringValue(item.nId_Provincia),
    nombre: toStringValue(item.cNombre_Provincia),
  }));
}

export async function fetchDistritos(
  idDepartamento: string,
  idProvincia: string,
  signal?: AbortSignal,
): Promise<Distrito[]> {
  const params = new URLSearchParams({
    nId_Provincia: idProvincia,
  });

  const result = await apiClient<ApiResponseSimple<DistritoApi[]>>(
    `${BASE_DIRECCION}/GetDireccionDistritos?${params.toString()}`,
    {
      signal,
      headers: {
        nId_Departamento: idDepartamento,
      },
    },
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando distritos');
  }

  return result.response.map((item) => ({
    id: toStringValue(item.nId_Distrito),
    nombre: toStringValue(item.cNombre_Distrito),
  }));
}

export async function fetchDireccionUbicaciones(
  signal?: AbortSignal,
): Promise<DireccionUbicacion[]> {
  const result = await apiClient<ApiResponseSimple<DireccionUbicacionApi[]>>(
    `${BASE_DIRECCION}/GetDireccionUbicaciones`,
    { signal },
  );

  if (result.statusCode !== 200) {
    throw new Error(result.message || 'Error cargando ubicaciones');
  }

  return result.response.map((item) => ({
    id: toStringValue(item.nId_PersRefUbi),
    nombre: toStringValue(item.cNombre_PersRefUbi),
  }));
}