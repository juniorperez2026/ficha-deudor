import React, { useCallback, useState } from 'react';
import { ActionButton } from '../../../../shared/components/ui';
import { PanelLayout } from './PanelLayout';
import { useTelefonosReferenciados } from '../../hooks/useTelefonosReferenciados';
import { usePanelTelefonosReferenciadosColumns } from '../../hooks/usePanelTelefonosReferenciadosColumns';
import type {
  TelefonoReferenciado,
  TelefonoFormData,
} from '../../../../shared/types';
import ModalRegistrarTelefono from '../modals/accionesRapidas/ModalRegistrarTelefono';
import ModalEditarTelefono from '../modals/accionesRapidas/ModalEditarTelefono';
import PanelTablaResumen from './shared/PanelTablaResumen';
import PanelResumenEstado from './shared/PanelResumenEstado';

interface Props {
  isActive: boolean;
  id_cliente: string;
  id_deudor: string;
  id_usuario: string;
}

const PanelTelefonosReferenciados: React.FC<Props> = ({
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
  } = useTelefonosReferenciados(id_cliente, id_deudor, id_usuario);

  const [showRegistrar, setShowRegistrar] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [telefonoEditarId, setTelefonoEditarId] = useState<number | null>(null);

  const handleEdit = useCallback((row: TelefonoReferenciado) => {
    setTelefonoEditarId(row.id);
    setShowEditar(true);
  }, []);

  const handleCloseEditar = useCallback(() => {
    setShowEditar(false);
    setTelefonoEditarId(null);
  }, []);

  const handleGuardarEdicion = useCallback(
    async (formData: TelefonoFormData) => {
      try {
        await update(formData.id, formData);
        handleCloseEditar();
      } catch {
        alert('No se pudo guardar la edición del teléfono.');
      }
    },
    [update, handleCloseEditar]
  );

  const handleRegistrar = useCallback(
    async (formData: TelefonoFormData) => {
      try {
        await create(formData);
        setShowRegistrar(false);
      } catch {
        alert('No se pudo registrar el teléfono.');
      }
    },
    [create]
  );

  const { columns } = usePanelTelefonosReferenciadosColumns({
    onEdit: handleEdit,
  });

  if (!isActive) return null;

  if (isLoading || error) {
    return (
      <PanelResumenEstado
        title="TELÉFONOS REFERENCIADOS"
        isActive={isActive}
        error={error}
        loadingMessage="Cargando teléfonos..."
        errorTitle="Error al cargar teléfonos:"
        onRetry={refetch}
      />
    );
  }

  return (
    <>
      <PanelLayout title="TELÉFONOS REFERENCIADOS" isActive={isActive}>
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
          emptyMessage="No se encontraron teléfonos referenciados"
          itemLabel="teléfono(s)"
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
                label="Agregar Teléfono"
                variant="primary"
                size="sm"
                icon="＋"
                onClick={() => setShowRegistrar(true)}
              />
            </div>
          }
        />
      </PanelLayout>

      <ModalRegistrarTelefono
        isOpen={showRegistrar}
        onClose={() => setShowRegistrar(false)}
        onRegistrar={handleRegistrar}
      />

      <ModalEditarTelefono
        isOpen={showEditar}
        onClose={handleCloseEditar}
        telefonoId={telefonoEditarId}
        onGuardar={handleGuardarEdicion}
      />
    </>
  );
};

export default PanelTelefonosReferenciados;