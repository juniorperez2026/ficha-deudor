import { useMemo } from 'react';
import { ActionButton } from '../../../shared/components/ui';
import { WrapCell } from '../../../shared/components/ui/WrapCell';
import type { Column, DireccionReferenciada } from '../../../shared/types';

const ESTADOS_BADGE: Record<string, string> = {
  ACTIVO: 'badge-s',
  INACTIVO: 'badge-d',
};

interface UsePanelDireccionesReferenciadasColumnsParams {
  onEdit: (row: DireccionReferenciada) => void;
}

export const usePanelDireccionesReferenciadasColumns = ({
  onEdit,
}: UsePanelDireccionesReferenciadasColumnsParams) => {
  const columns: Column<DireccionReferenciada>[] = useMemo(
    () => [
      {
        key: 'direccion',
        label: 'Dirección',
        render: (row) => <WrapCell>{row.direccion}</WrapCell>,
      },
      {
        key: 'refUbicacion',
        label: 'Ref. Ubicación',
        render: (row) => <WrapCell>{row.refUbicacion}</WrapCell>,
      },
      {
        key: 'tipoDeudor',
        label: 'Tipo Deudor',
        render: (row) => (
          <span
            className={`badge ${
              row.tipoDeudor === 'Titular' ? 'badge-s' : 'badge-info'
            }`}
          >
            {row.tipoDeudor}
          </span>
        ),
      },
      {
        key: 'nombre',
        label: 'Nombre',
        render: (row) => <WrapCell weight={500}>{row.nombre}</WrapCell>,
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (row) => {
          const badgeClass = ESTADOS_BADGE[row.estado] || 'badge-n';

          return (
            <span className={`badge ${badgeClass}`}>
              {row.estado || '—'}
            </span>
          );
        },
      },
      {
        key: 'acciones',
        label: 'Editar',
        width: '55px',
        filterable: false,
        render: (row) => (
          <ActionButton
            label=""
            variant="primary"
            size="sm"
            icon="✎"
            onClick={() => onEdit(row)}
          />
        ),
      },
    ],
    [onEdit]
  );

  return {
    columns,
  };
};