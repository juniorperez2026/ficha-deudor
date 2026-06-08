export interface TelefonoReferenciadoApi {
  prioridad: number;
  nroTelefono: string;
  horario: string;
  referenciaUbicacion: string;
  estado: string;
  fechaEstado: string;
  fechaBase: string;
  contactados: string;
  noContactados: number;
  cantidadIvr: number;
  fuente: string;
  ordenSearch: string;
}

export interface TelefonoReferenciado {
  id: string;               // ← Se genera en el mapeo desde nroTelefono
  prioridad: number;
  numero: string;           // ← Mapeado desde nroTelefono
  horario: string;
  refUbicacion: string;     // ← Mapeado desde referenciaUbicacion
  estado: string;
  fechaEstado: string;
  fechaBase: string;
  contactados: string;
  noContactados: number;
  ivr: string;              // ← Mapeado desde cantidadIvr (number → string)
  fuente: string;
  ordenSearch: number;      // ← Mapeado desde ordenSearch (string → number)
  anexo: string;
  operadorTelefonico: string;
  referencia: string;
  reclamoIndecopi: string;
}

export interface TelefonoFormData {
  numero: string;
  anexo: string;
  resultado: string;
  operadorTelefonico: string;
  ubicacion: string;
  prioridad: string;
  horarioGestion: string;
  comentario: string;
  fuenteBusqueda: string;
  referencia: string;
  reclamoIndecopi: string;
}

