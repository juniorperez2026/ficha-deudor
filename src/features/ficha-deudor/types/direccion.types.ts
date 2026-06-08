export interface DireccionReferenciadaApi {
  nId_PersDirecc: number;
  direccion: string;
  referenciaUbicacion: string;
  tipoDeudor: string;
  nombre: string;
  estado: string;
}

export interface DireccionReferenciada {
  id: string;
  direccion: string;
  refUbicacion: string;
  tipoDeudor: string;
  nombre: string;
  estado: string;
  departamento?: string; 
  provincia?: string;
  distrito?: string;
  comentario?: string;
  llegoDeBase?: string;
  nombreAval?: string
}

export interface DireccionFormData {
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  refUbicacion: string;
  comentario: string;
  llegoDeBase: string;
  tipoDeudor: string;
}

export interface DireccionEditFormData {
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  refUbicacion: string;
  comentario: string;
  llegoDeBase: string;
  tipoDeudor: string;
  nombreAval: string;
  estado: string;
}