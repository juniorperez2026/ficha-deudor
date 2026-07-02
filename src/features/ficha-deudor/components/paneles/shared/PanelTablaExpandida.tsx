import Table from '../../../../../shared/components/table/Table';
import { ActionButton } from '../../../../../shared/components/ui';
import Paginacion from '../../../../../shared/components/ui/Paginacion';
import type { Column } from '../../../../../shared/types';

interface Props<TData> {
  columns: Column<TData>[];
  data: TData[];
  isLoading: boolean;
  error?: string | null;
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  emptyMessage: string;
  itemLabel: string;
  loadingMessage: string;
  errorTitle: string;
  pageSizeOptions: number[];
  setPageNumber: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  onRetry: () => void;
  onVolver: () => void;
}

const PanelTablaExpandida = <TData,>({
  columns,
  data,
  isLoading,
  error,
  pageNumber,
  pageSize,
  totalRecords,
  totalPages,
  emptyMessage,
  itemLabel,
  loadingMessage,
  errorTitle,
  pageSizeOptions,
  setPageNumber,
  setPageSize,
  onRetry,
  onVolver,
}: Props<TData>) => {
  const indiceInicio = (pageNumber - 1) * pageSize;
  const indiceFin = Math.min(pageNumber * pageSize, totalRecords);

  return (
    <div
      style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
          Mostrando {indiceInicio + 1}-{indiceFin} de {totalRecords}{' '}
          {itemLabel}
        </span>

        <ActionButton
          label="Volver"
          variant="secondary"
          size="sm"
          icon="◀"
          onClick={onVolver}
        />
      </div>

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <span>{loadingMessage}</span>
        </div>
      ) : error ? (
        <div style={{ padding: '2rem', color: '#c00' }}>
          <p style={{ marginBottom: 12 }}>{errorTitle}</p>

          <p style={{ fontSize: '0.9em', color: '#666', marginBottom: 16 }}>
            {error}
          </p>

          <button
            onClick={onRetry}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
            type="button"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={data}
            emptyMessage={emptyMessage}
            enableColumnFilters={false}
            fitToPanel={false}
          />

          {totalPages > 1 && (
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
        </>
      )}
    </div>
  );
};

export default PanelTablaExpandida;