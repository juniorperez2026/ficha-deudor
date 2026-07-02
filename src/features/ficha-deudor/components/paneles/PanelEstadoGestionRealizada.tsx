import React, { useState } from 'react';
import { PanelLayout } from './PanelLayout';
import { useEstadosGestion } from '../../hooks/useEstadosGestion';
import { usePanelEstadoGestionColumns } from '../../hooks/usePanelEstadoGestionColumns';
import PanelTablaResumen from './shared/PanelTablaResumen';
import PanelTablaExpandida from './shared/PanelTablaExpandida';
import PanelResumenEstado from './shared/PanelResumenEstado';

interface Props {
  isActive: boolean;
  id_cliente: string;
  id_cartera: string;
  id_deudor: string;
}

const PanelEstadoGestionRealizada: React.FC<Props> = ({
  isActive,
  id_cliente,
  id_cartera,
  id_deudor,
}) => {
  const {
    // Resumido
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

    // Expandido / Completo
    completo,
    completoLoading,
    completoError,
    completoPageNumber,
    completoPageSize,
    completoTotalRecords,
    completoTotalPages,
    setCompletoPageNumber,
    setCompletoPageSize,
    refetchCompleto,
  } = useEstadosGestion(id_cliente, id_cartera, id_deudor);

  const [vistaExpandida, setVistaExpandida] = useState(false);

  const handleVerMas = () => setVistaExpandida(true);
  const handleVolver = () => setVistaExpandida(false);

  const {
    columnsResumidas,
    columnsExpandidas,
  } = usePanelEstadoGestionColumns();

  if (!isActive) return null;

  if (!vistaExpandida && (isLoading || error)) {
    return (
      <PanelResumenEstado
        title="ESTADO DE GESTIÓN REALIZADA"
        isActive={isActive}
        error={error}
        loadingMessage="Cargando estados de gestión..."
        errorTitle="Error al cargar estados de gestión:"
        onRetry={refetch}
      />
    );
  }

  return (
    <PanelLayout
      title={
        vistaExpandida
          ? 'TODOS LOS ESTADOS DE GESTIÓN'
          : 'ESTADO DE GESTIÓN REALIZADA'
      }
      isActive={isActive}
    >
      {!vistaExpandida ? (
        <PanelTablaResumen
          columns={columnsResumidas}
          data={paginatedData}
          allData={allData}
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalRecords={totalRecords}
          totalPages={totalPages}
          textFilters={textFilters}
          selectedFilters={selectedFilters}
          emptyMessage="No se encontraron estados de gestión"
          itemLabel="estado(s) de gestión"
          verMasLabel="Ver más estados de gestiones"
          setPageNumber={setPageNumber}
          setPageSize={setPageSize}
          onTextFilterChange={onTextFilterChange}
          onSelectedFilterChange={onSelectedFilterChange}
          onVerMas={handleVerMas}
        />
      ) : (
        <PanelTablaExpandida
            columns={columnsExpandidas}
            data={completo}
            isLoading={completoLoading}
            error={completoError}
            pageNumber={completoPageNumber}
            pageSize={completoPageSize}
            totalRecords={completoTotalRecords}
            totalPages={completoTotalPages}
            emptyMessage="No se encontraron estados de gestión históricos"
            itemLabel="estado(s) de gestión"
            loadingMessage="Cargando estados de gestión históricos..."
            errorTitle="Error al cargar estados de gestión históricos:"
            setPageNumber={setCompletoPageNumber}
            setPageSize={setCompletoPageSize}
            onRetry={refetchCompleto}
            onVolver={handleVolver} pageSizeOptions={[]}        />
      )}
    </PanelLayout>
  );
};

export default PanelEstadoGestionRealizada;