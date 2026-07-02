import React from 'react';
import Table from '../../../../../shared/components/table/Table';
import { ActionButton } from '../../../../../shared/components/ui';
import Paginacion from '../../../../../shared/components/ui/Paginacion';
import type { Column } from '../../../../../shared/types';

interface Props<TData> {
  columns: Column<TData>[];
  data: TData[];
  allData: TData[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  textFilters: Record<string, string>;
  selectedFilters: Record<string, string[]>;
  emptyMessage: string;
  itemLabel?: string;
  verMasLabel?: string;
  pageSizeOptions?: number[];
  showCount?: boolean;
  enableColumnFilters?: boolean;
  fitToPanel?: boolean;
  headerRight?: React.ReactNode;
  setPageNumber: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  onTextFilterChange: (key: string, value: string) => void;
  onSelectedFilterChange: (key: string, value: string[]) => void;
  onVerMas?: () => void;
  onRowClick?: (row: TData) => void;
}

const PanelTablaResumen = <TData,>({
  columns,
  data,
  allData,
  pageNumber,
  pageSize,
  totalRecords,
  totalPages,
  textFilters,
  selectedFilters,
  emptyMessage,
  itemLabel,
  verMasLabel,
  pageSizeOptions = [5, 10, 30, 50],
  showCount = true,
  enableColumnFilters = true,
  fitToPanel = false,
  headerRight,
  setPageNumber,
  setPageSize,
  onTextFilterChange,
  onSelectedFilterChange,
  onVerMas,
  onRowClick,
}: Props<TData>) => {
  const indiceInicio = (pageNumber - 1) * pageSize;
  const indiceFin = Math.min(pageNumber * pageSize, totalRecords);

  const showHeader = (showCount && itemLabel) || headerRight;

  return (
    <div style={{ padding: '16px 0' }}>
      {showHeader && (
        <div
          style={{
            display: headerRight ? 'flex' : 'block',
            justifyContent: headerRight ? 'space-between' : undefined,
            alignItems: headerRight ? 'center' : undefined,
            marginBottom: '12px',
          }}
        >
          {showCount && itemLabel ? (
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
              Mostrando {indiceInicio + 1}-{indiceFin} de {totalRecords}{' '}
              {itemLabel}
            </span>
          ) : (
            <span />
          )}

          {headerRight}
        </div>
      )}

      <Table
        columns={columns}
        data={data}
        onRowClick={onRowClick}
        emptyMessage={emptyMessage}
        enableColumnFilters={enableColumnFilters}
        allData={allData}
        textFilters={textFilters}
        selectedFilters={selectedFilters}
        onTextFilterChange={onTextFilterChange}
        onSelectedFilterChange={onSelectedFilterChange}
        fitToPanel={fitToPanel}
      />

      {totalPages > 0 && (
        <Paginacion
          paginaActual={pageNumber}
          totalPaginas={totalPages}
          totalRegistros={totalRecords}
          indiceInicio={indiceInicio}
          indiceFin={indiceFin}
          onPaginaAnterior={() => setPageNumber(Math.max(1, pageNumber - 1))}
          onPaginaSiguiente={() =>
            setPageNumber(Math.min(totalPages, pageNumber + 1))
          }
          onIrAPagina={setPageNumber}
          showPageSizeSelector={true}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageSizeChange={setPageSize}
        />
      )}

      {onVerMas && verMasLabel && (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <ActionButton
            label={verMasLabel}
            variant="info"
            size="md"
            icon="▼"
            onClick={onVerMas}
          />
        </div>
      )}
    </div>
  );
};

export default PanelTablaResumen;