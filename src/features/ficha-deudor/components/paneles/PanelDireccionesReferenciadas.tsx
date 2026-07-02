import React, { useCallback, useState } from 'react';
import ModalRegistrarDireccion from '../modals/accionesRapidas/ModalRegistrarDireccion';
import ModalEditarDireccion from '../modals/accionesRapidas/ModalEditarDireccion';
import { ActionButton } from '../../../../shared/components/ui';
import { PanelLayout } from './PanelLayout';
import {
  useDireccionById,
  useDireccionesReferenciadas,
} from '../../hooks/useDireccionesReferenciadas';
import { usePanelDireccionesReferenciadasColumns } from '../../hooks/usePanelDireccionesReferenciadasColumns';
import type {
  DireccionReferenciada,
  DireccionEditFormData,
  DireccionFormData,
} from '../../../../shared/types';
import PanelTablaResumen from './shared/PanelTablaResumen';
import PanelResumenEstado from './shared/PanelResumenEstado';

interface Props {
  isActive: boolean;
  id_cliente: string;
  id_deudor: string;
  id_usuario: string;
}

const PanelDireccionesReferenciadas: React.FC<Props> = ({
  isActive,
  id_cliente,
  id_deudor,
  id_usuario,
}) => {
  const {
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
    create,
    update,
  } = useDireccionesReferenciadas(id_cliente, id_deudor, id_usuario);

  const [showRegistrar, setShowRegistrar] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [direccionEditarId, setDireccionEditarId] = useState<string | null>(null);

  const { data: direccionByIdData } = useDireccionById(direccionEditarId);

  const handleEdit = useCallback((row: DireccionReferenciada) => {
    setDireccionEditarId(row.id);
    setShowEditar(true);
  }, []);

  const handleCloseEditar = useCallback(() => {
    setShowEditar(false);
    setDireccionEditarId(null);
  }, []);

  const handleGuardarEdicion = useCallback(
    async (formData: DireccionEditFormData) => {
      try {
        await update(formData.id, formData);
        handleCloseEditar();
      } catch {
        alert('No se pudo guardar la edición de la dirección.');
      }
    },
    [update, handleCloseEditar]
  );

  const handleRegistrar = useCallback(
    async (formData: DireccionFormData) => {
      try {
        await create(formData);
        setShowRegistrar(false);
      } catch {
        alert('No se pudo registrar la dirección.');
      }
    },
    [create]
  );

  const { columns } = usePanelDireccionesReferenciadasColumns({
    onEdit: handleEdit,
  });

  if (!isActive) return null;

  if (isLoading || error) {
    return (
      <PanelResumenEstado
        title="DIRECCIONES REFERENCIADAS"
        isActive={isActive}
        error={error}
        loadingMessage="Cargando direcciones..."
        errorTitle="Error al cargar direcciones:"
        onRetry={refetch}
      />
    );
  }

  return (
    <>
      <PanelLayout title="DIRECCIONES REFERENCIADAS" isActive={isActive}>
        <PanelTablaResumen
          columns={columns}
          data={paginatedData}
          allData={allData}
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalRecords={totalRecords}
          totalPages={totalPages}
          textFilters={textFilters}
          selectedFilters={selectedFilters}
          emptyMessage="No se encontraron direcciones referenciadas"
          itemLabel="dirección(es)"
          setPageNumber={setPageNumber}
          setPageSize={setPageSize}
          onTextFilterChange={onTextFilterChange}
          onSelectedFilterChange={onSelectedFilterChange}
          headerRight={
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: '#6b7a99' }}>
                Página {pageNumber} de {totalPages}
              </span>

              <ActionButton
                label="Agregar Dirección"
                variant="primary"
                size="sm"
                icon="＋"
                onClick={() => setShowRegistrar(true)}
              />
            </div>
          }
        />
      </PanelLayout>

      <ModalRegistrarDireccion
        isOpen={showRegistrar}
        onClose={() => setShowRegistrar(false)}
        onRegistrar={handleRegistrar}
      />

      <ModalEditarDireccion
        isOpen={showEditar}
        onClose={handleCloseEditar}
        direccionId={direccionEditarId}
        direccionData={direccionByIdData}
        onGuardar={handleGuardarEdicion}
      />
    </>
  );
};

export default PanelDireccionesReferenciadas;