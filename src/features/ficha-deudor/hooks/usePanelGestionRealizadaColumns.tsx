import { useMemo } from 'react';
import { ActionButton } from '../../../shared/components/ui';
import { WrapCell } from '../../../shared/components/ui/WrapCell';
import ExpandableCell from '../../../shared/components/ui/ExpandableCell';
import type { Column } from '../../../shared/types';
import type {
  GestionRealizada,
  GestionCompleta,
} from '../../../shared/types/indexApi';

interface UsePanelGestionRealizadaColumnsParams {
  onEliminar: (row: GestionRealizada) => void;
}

export const usePanelGestionRealizadaColumns = ({
  onEliminar,
}: UsePanelGestionRealizadaColumnsParams) => {
  const columnsResumidas: Column<GestionRealizada>[] = useMemo(
    () => [
      {
        key: 'nro',
        label: 'Nro',
        render: (row) => (
          <span style={{ fontWeight: 700, color: '#1a2540' }}>
            {row.nro}
          </span>
        ),
      },
      {
        key: 'fecha',
        label: 'Fecha',
      },
      {
        key: 'gestor',
        label: 'Gestor',
        render: (row) => (
          <WrapCell>{row.gestor}</WrapCell>
        ),
      },
      {
        key: 'documento',
        label: 'Documento',
      },
      {
        key: 'operacion',
        label: 'Operación',
        render: (row) => (
          <span
            className="badge badge-info"
            style={{ fontSize: '10px', textTransform: 'uppercase' }}
          >
            {row.operacion}
          </span>
        ),
      },
      {
        key: 'respuesta',
        label: 'Respuesta',
        render: (row) => (
          <WrapCell
            color={row.respuesta.includes('Contactado') ? '#166534' : '#991b1b'}
            weight={500}
          >
            {row.respuesta}
          </WrapCell>
        ),
      },
      {
        key: 'comentario',
        label: 'Comentario',
        render: (row) => (
          <ExpandableCell text={row.comentario} maxLines={2} lineHeight={18} />
        ),
      },
      {
        key: 'acciones',
        label: 'Borrar',
        width: '55px',
        filterable: false,
        render: (row) => (
          <ActionButton
            label=""
            variant="danger"
            size="sm"
            icon="🗑"
            onClick={() => onEliminar(row)}
          />
        ),
      },
    ],
    [onEliminar]
  );

  const columnsExpandidas: Column<GestionCompleta>[] = useMemo(
    () => [
      {
        key: 'nro',
        label: 'Nro',
        render: (row) => (
          <span style={{ fontWeight: 700, color: '#1a2540' }}>
            {row.nro}
          </span>
        ),
      },
      {
        key: 'cliente',
        label: 'Cliente',
        render: (row) => (
          <WrapCell>{row.cliente}</WrapCell>
        ),
      },
      {
        key: 'cartera',
        label: 'Cartera',
        render: (row) => (
          <WrapCell>{row.cartera}</WrapCell>
        ),
      },
      {
        key: 'campana',
        label: 'Campaña',
        render: (row) => (
          <WrapCell>{row.campana}</WrapCell>
        ),
      },
      {
        key: 'fecha',
        label: 'Fecha',
      },
      {
        key: 'gestor',
        label: 'Gestor',
        render: (row) => (
          <WrapCell>{row.gestor}</WrapCell>
        ),
      },
      {
        key: 'documento',
        label: 'Documento',
      },
      {
        key: 'operacion',
        label: 'Operación',
        render: (row) => (
          <span
            className="badge badge-info"
            style={{ fontSize: '10px', textTransform: 'uppercase' }}
          >
            {row.operacion}
          </span>
        ),
      },
      {
        key: 'resultado',
        label: 'Resultado',
        render: (row) => (
          <WrapCell
            color={row.resultado.includes('Contactado') ? '#166534' : '#991b1b'}
            weight={500}
          >
            {row.resultado}
          </WrapCell>
        ),
      },
      {
        key: 'comentario',
        label: 'Comentario',
        render: (row) => (
          <ExpandableCell text={row.comentario} maxLines={2} lineHeight={18} />
        ),
      },
    ],
    []
  );

  return {
    columnsResumidas,
    columnsExpandidas,
  };
};