import { useMemo } from 'react';
import { WrapCell } from '../../../shared/components/ui/WrapCell';
import ExpandableCell from '../../../shared/components/ui/ExpandableCell';
import type { Column } from '../../../shared/types';
import type {
  EstadoGestion,
  EstadoGestionCompleta,
} from '../../../shared/types/indexApi';

export const usePanelEstadoGestionColumns = () => {
  const columnsResumidas: Column<EstadoGestion>[] = useMemo(
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
        key: 'operador',
        label: 'Operador',
        render: (row) => (
          <WrapCell>{row.operador}</WrapCell>
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

  const columnsExpandidas: Column<EstadoGestionCompleta>[] = useMemo(
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