import type { SelectOption } from '../types';

export const resultadosOptions: SelectOption[] = [
  { id: 'CONTACTADO', label: 'Contactado' },
  { id: 'NO_CONTACTADO', label: 'No Contactado' },
  { id: 'MENSAJE_VOZ', label: 'Mensaje en Voz' },
  { id: 'TELF_NO_EXISTE', label: 'Teléfono No Existe' },
  { id: 'TELF_BLOQUEADO', label: 'Teléfono Bloqueado' },
  { id: 'NO_CONTESTA', label: 'No Contesta' },
  { id: 'BUZON_LLENO', label: 'Buzón Lleno' },
  { id: 'FAX', label: 'Fax' },
  { id: 'OPERATIVO', label: 'Operativo' },
];

export const operadoresOptions: SelectOption[] = [
  { id: 'CLARO', label: 'Claro' },
  { id: 'MOVISTAR', label: 'Movistar' },
  { id: 'ENTEL', label: 'Entel' },
  { id: 'BITEL', label: 'Bitel' },
  { id: 'OTROS', label: 'Otros' },
];

export const ubicacionesOptions: SelectOption[] = [
  { id: 'LIMA', label: 'Lima' },
  { id: 'PROVINCIA', label: 'Provincia' },
  { id: 'EXTRANJERO', label: 'Extranjero' },
];

export const prioridadesOptions: SelectOption[] = [
  { id: '1', label: '1 - Alta' },
  { id: '2', label: '2 - Media' },
  { id: '3', label: '3 - Baja' },
];

export const horariosGestionOptions: SelectOption[] = [
  { id: 'MANANA', label: 'Mañana (8:00 - 12:00)' },
  { id: 'TARDE', label: 'Tarde (12:00 - 18:00)' },
  { id: 'NOCHE', label: 'Noche (18:00 - 21:00)' },
  { id: 'TODO_EL_DIA', label: 'Todo el día' },
];

export const fuentesBusquedaOptions: SelectOption[] = [
  { id: 'SEARCH_VISA', label: 'Search Visa' },
  { id: 'REFERENCIA_VARIOS', label: 'Referencia Varios' },
  { id: 'CLIENTE', label: 'Cliente' },
  { id: 'BASE_INTERNA', label: 'Base Interna' },
  { id: 'RUC', label: 'RUC' },
  { id: 'WEB', label: 'Web' },
  { id: 'TELEFONICA', label: 'Telefónica' },
];

export const referenciasOptions: SelectOption[] = [
  { id: 'CLARO_CORP_REF', label: 'Claro Corp - Referencia Varios' },
  { id: 'CLIENTE_DIRECTO', label: 'Cliente Directo' },
  { id: 'TERCERO', label: 'Tercero' },
  { id: 'FAMILIAR', label: 'Familiar' },
  { id: 'CONYUGE', label: 'Cónyuge' },
  { id: 'EMPLEADO', label: 'Empleado' },
];

export const reclamoIndecopiOptions: SelectOption[] = [
  { id: 'NO', label: 'NO' },
  { id: 'SI', label: 'SÍ' },
  { id: 'PENDIENTE', label: 'Pendiente' },
];