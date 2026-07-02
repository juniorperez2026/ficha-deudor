import React, { useCallback, useMemo } from 'react';
import { WrapCell } from '../../../../shared/components/ui/WrapCell';
import { Badge } from '../../../../shared/components/ui/Badge';
import { PanelLayout } from './PanelLayout';
import { useDatosAdicionales } from '../../hooks/useDatosAdicionales';
import type { Column } from '../../../../shared/types';
import type {
  ColumnApi,
  DatoAdicionalApi,
} from '../../../../shared/types/indexApi';
import PanelTablaResumen from './shared/PanelTablaResumen';

interface Props {
  isActive: boolean;
  id_cliente: string;
  id_cartera: string;
  id_deudor: string;
}

const ESTADOS_SERVICIO: Record<
  string,
  { variant: 'success' | 'warning' | 'danger' | 'neutral' }
> = {
  Activo: { variant: 'success' },
  Suspendido: { variant: 'warning' },
  Cancelado: { variant: 'danger' },
};

const PanelDatosAdicionales: React.FC<Props> = ({
  isActive,
  id_cliente,
  id_cartera,
  id_deudor,
}) => {
  const {
    columns,
    allData,
    paginatedData,
    isLoading,
    error,
    pageNumber,
    pageSize,
    totalRecords,
    totalPages,
    setPageNumber,
    setPageSize,
    refetch,
    textFilters,
    selectedFilters,
    onTextFilterChange,
    onSelectedFilterChange,
  } = useDatosAdicionales(id_cliente, id_cartera, id_deudor, 3);

  const renderCell = useCallback((row: DatoAdicionalApi, column: ColumnApi) => {
    const rawValue = row[column.key];

    if (rawValue === null || rawValue === undefined) return '-';

    const value = String(rawValue);

    switch (column.type) {
      case 'money': {
        const numValue = Number(rawValue);

        return Number.isNaN(numValue)
          ? value
          : numValue.toLocaleString('es-PE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
      }

      case 'estado': {
        const config = ESTADOS_SERVICIO[value];

        return <Badge variant={config?.variant || 'neutral'}>{value}</Badge>;
      }

      default:
        return <WrapCell weight={500}>{value}</WrapCell>;
    }
  }, []);

  const tableColumns: Column<DatoAdicionalApi>[] = useMemo(
    () =>
      columns.map((column) => ({
        key: column.key,
        label: column.label,
        render: (row) => renderCell(row, column),
      })),
    [columns, renderCell]
  );

  if (!isActive) return null;

  if (isLoading) {
    return (
      <PanelLayout title="DATOS ADICIONALES" isActive={isActive}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              width: 20,
              height: 20,
              border: '3px solid #ddd',
              borderTopColor: '#333',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />

          <p style={{ marginTop: 8, color: '#666' }}>
            Cargando datos adicionales...
          </p>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </PanelLayout>
    );
  }

  if (error) {
    return (
      <PanelLayout title="DATOS ADICIONALES" isActive={isActive}>
        <div style={{ padding: '2rem', color: '#c00' }}>
          <p style={{ marginBottom: 12 }}>
            Error al cargar datos adicionales:
          </p>

          <p style={{ fontSize: '0.9em', color: '#666', marginBottom: 16 }}>
            {error}
          </p>

          <button
            onClick={refetch}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
            type="button"
          >
            Reintentar
          </button>
        </div>
      </PanelLayout>
    );
  }

  return (
    <PanelLayout title="DATOS ADICIONALES" isActive={isActive}>
      <PanelTablaResumen
        columns={tableColumns}
        data={paginatedData}
        allData={allData}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalRecords={totalRecords}
        totalPages={totalPages}
        textFilters={textFilters}
        selectedFilters={selectedFilters}
        emptyMessage="No se encontraron datos adicionales"
        pageSizeOptions={[5, 10, 20, 50]}
        showCount={false}
        setPageNumber={setPageNumber}
        setPageSize={setPageSize}
        onTextFilterChange={onTextFilterChange}
        onSelectedFilterChange={onSelectedFilterChange}
      />
    </PanelLayout>
  );
};

export default PanelDatosAdicionales;