import type React from 'react';

export type SelectOption<T = string> = {
  id: T;
  label: string;
};

type ColumnRender<TData> = {
  bivarianceHack(row: TData): React.ReactNode;
}['bivarianceHack'];

export interface Column<TData = unknown> {
  key: string;
  label: string;
  render?: ColumnRender<TData>;
  width?: string;
  filterable?: boolean;
  group?: string;
  groupLabel?: string;
}

export interface Ubigeo {
  id: string;
  nombre: string;
  provincias?: Provincia[];
}

export interface Provincia {
  id: string;
  nombre: string;
  distritos?: Distrito[];
}

export interface Distrito {
  id: string;
  nombre: string;
}

export * from '../../features/ficha-deudor/types/deudor.types';
export * from '../../features/ficha-deudor/types/telefono.types';
export * from '../../features/ficha-deudor/types/direccion.types';
export * from '../../features/ficha-deudor/types/popups/email.types';
export * from '../../features/ficha-deudor/types/popups/agenda.types';
export * from '../../features/ficha-deudor/types/popups/pago.types';
export * from '../../features/ficha-deudor/types/popups/infDeudor.types';
export * from '../../features/ficha-deudor/types/fichaGestion.types';
export * from '../../features/dashboard/types/dashboardDeudor.types';
export * from '../../features/ficha-deudor/types/popups/gestor.types';