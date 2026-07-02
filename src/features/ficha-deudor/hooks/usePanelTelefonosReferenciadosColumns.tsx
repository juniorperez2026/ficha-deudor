import { useMemo } from 'react';
import { ActionButton } from '../../../shared/components/ui';
import { Badge } from '../../../shared/components/ui/Badge';
import { WrapCell } from '../../../shared/components/ui/WrapCell';
import type { Column, TelefonoReferenciado } from '../../../shared/types';

interface UsePanelTelefonosReferenciadosColumnsParams {
  onEdit: (row: TelefonoReferenciado) => void;
}

export const usePanelTelefonosReferenciadosColumns = ({
  onEdit,
}: UsePanelTelefonosReferenciadosColumnsParams) => {
  const columns: Column<TelefonoReferenciado>[] = useMemo(
    () => [
      {
        key: 'prioridad',
        label: 'Prioridad',
      },
      {
        key: 'numero',
        label: 'Número',
      },
      {
        key: 'horario',
        label: 'Horario',
        render: (row) => <WrapCell>{row.horario}</WrapCell>,
      },
      {
        key: 'refUbicacion',
        label: 'Ref. Ubicación',
        render: (row) => <WrapCell>{row.refUbicacion}</WrapCell>,
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (row) => (
          <Badge
            variant={row.estado === 'OPERATIVO' ? 'success' : 'neutral'}
            style={{ padding: '2px 7px', borderRadius: '10px', fontSize: '9px' }}
          >
            {row.estado || '—'}
          </Badge>
        ),
      },
      {
        key: 'fechaEstado',
        label: 'Fecha Estado',
      },
      {
        key: 'fechaBase',
        label: 'Fecha Base',
      },
      {
        key: 'contactados',
        label: 'Contactados',
        render: (row) => (
          <WrapCell weight={500}>{`${row.contactados}`}</WrapCell>
        ),
      },
      {
        key: 'noContactados',
        label: 'No Contactados',
      },
      {
        key: 'ivr',
        label: 'IVR',
      },
      {
        key: 'fuente',
        label: 'Fuente',
        render: (row) => <WrapCell>{row.fuente}</WrapCell>,
      },
      {
        key: 'ordenSearch',
        label: 'Orden Search',
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