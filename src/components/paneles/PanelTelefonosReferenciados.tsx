import React, { useMemo, useState, useEffect } from 'react';
import Table from '../table/Table';
import { ActionButton } from '../ui/index';
import Paginacion from '../ui/Paginacion';
import type { Column, TelefonoReferenciado, TelefonoFormData } from '../../types/index';
import ModalRegistrarTelefono from '../modals/accionesRapidas/ModalRegistrarTelefono';
import ModalEditarTelefono from '../modals/accionesRapidas/ModalEditarTelefono';
import { telefonosReferenciadosMock } from '../../data/telefonosReferenciados';

interface Props {
  isActive: boolean;
}

// Helper para celdas con wrap
const WrapCell: React.FC<{ children: React.ReactNode; color?: string; weight?: number }> = ({ 
  children, color, weight 
}) => (
  <span
    style={{
      fontSize: '11px',
      color: color || '#1a2540',
      fontWeight: weight || 400,
      display: 'block',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      lineHeight: '1.4',
      maxWidth: '100%',
    }}
  >
    {children}
  </span>
);

// ❌ ELIMINADO: const REGISTROS_POR_PAGINA = 15;

const PanelTelefonosReferenciados: React.FC<Props> = ({ isActive }) => {
  const [data, setData] = useState<TelefonoReferenciado[]>(telefonosReferenciadosMock);
  const [showRegistrar, setShowRegistrar] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [telefonoEditar, setTelefonoEditar] = useState<TelefonoReferenciado | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);

  // ✅ NUEVO: Estado para tamaño de página
  const [pageSize, setPageSize] = useState(5);

  // Estados para los filtros
  const [textFilters, setTextFilters] = useState<Record<string, string>>({});
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  // Aplicar filtros a TODOS los datos
  const datosFiltrados = useMemo(() => {
    let filtered = [...data];

    // Filtros de texto libre (coincidencia parcial)
    Object.entries(textFilters).forEach(([key, text]) => {
      if (text) {
        filtered = filtered.filter(item => {
          const value = item[key as keyof TelefonoReferenciado];
          return value != null && String(value).toLowerCase().includes(text.toLowerCase());
        });
      }
    });

    // Filtros de selección exacta (checkboxes)
    Object.entries(selectedFilters).forEach(([key, selectedVals]) => {
      if (selectedVals.length) {
        filtered = filtered.filter(item => {
          const value = item[key as keyof TelefonoReferenciado];
          return value != null && selectedVals.includes(String(value));
        });
      }
    });

    return filtered;
  }, [data, textFilters, selectedFilters]);

  // ✅ ACTUALIZADO: Paginación con pageSize dinámico
  const totalPaginas = Math.ceil(datosFiltrados.length / pageSize);
  const indiceInicio = (paginaActual - 1) * pageSize;
  const datosPaginados = datosFiltrados.slice(indiceInicio, indiceInicio + pageSize);
  const indiceFin = Math.min(indiceInicio + pageSize, datosFiltrados.length);

  // ✅ ACTUALIZADO: Resetear página cuando cambian filtros, datos o pageSize
  useEffect(() => {
    setPaginaActual(1);
  }, [datosFiltrados.length, pageSize]); // ← Agregado pageSize

  // Resetear filtros y página al cerrar el panel
  useEffect(() => {
    if (!isActive) {
      setTextFilters({});
      setSelectedFilters({});
      setPaginaActual(1);
    }
  }, [isActive]);

  const handleEdit = (row: TelefonoReferenciado) => {
    setTelefonoEditar(row);
    setShowEditar(true);
  };

  const handleAddTelefono = () => {
    setShowRegistrar(true);
  };

  const handleGuardarEdicion = (formData: TelefonoFormData & { id: string }) => {
    setData((prev) =>
      prev.map((t) =>
        t.id === formData.id
          ? {
              ...t,
              numero: formData.numero,
              anexo: formData.anexo,
              estado: formData.resultado,
              operadorTelefonico: formData.operadorTelefonico,
              refUbicacion: formData.ubicacion,
              prioridad: parseInt(formData.prioridad) || 0,
              horario: formData.horarioGestion,
              fuente: formData.fuenteBusqueda,
              referencia: formData.referencia,
              reclamoIndecopi: formData.reclamoIndecopi,
            }
          : t
      )
    );
  };

  // Definición de columnas con anchos para alineación de filtros
  const columns: Column[] = useMemo(
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
        render: (row: TelefonoReferenciado) => <WrapCell>{row.horario}</WrapCell>,
      },
      {
        key: 'refUbicacion',
        label: 'Ref. Ubicación',
        render: (row: TelefonoReferenciado) => <WrapCell>{row.refUbicacion}</WrapCell>,
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (row: TelefonoReferenciado) => (
          <span
            style={{
              padding: '3px 8px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: 600,
              color: row.estado === 'OPERATIVO' ? '#166534' : '#374151',
              backgroundColor: row.estado === 'OPERATIVO' ? '#dcfce7' : '#f3f4f6',
              display: 'inline-block',
            }}
          >
            {row.estado || '—'}
          </span>
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
        render: (row: TelefonoReferenciado) => <WrapCell weight={500}>{`${row.contactados}%`}</WrapCell>,
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
        render: (row: TelefonoReferenciado) => <WrapCell>{row.fuente}</WrapCell>,
      },
      {
        key: 'ordenSearch',
        label: 'Orden Search',
      },
      {
        key: 'acciones',
        label: 'Editar',
        filterable: false,
        render: (row: TelefonoReferenciado) => (
          <ActionButton
            label=""
            variant="primary"
            size="sm"
            icon="✎"
            onClick={() => handleEdit(row)}
          />
        ),
      },
    ],
    []
  );

  if (!isActive) return null;

  return (
    <>
      <div className="ficha-card panel-colapsable">
        <div className="panel-colapsable-header">
          <span className="panel-colapsable-title">TELÉFONOS REFERENCIADOS</span>
        </div>
        <div className="panel-colapsable-body">
          <div style={{ padding: '16px 0' }}>
            {/* Header con contador y botón agregar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                Mostrando {indiceInicio + 1}-{indiceFin} de {datosFiltrados.length} teléfono(s)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', color: '#6b7a99' }}>
                  Página {paginaActual} de {totalPaginas}
                </span>
                <ActionButton
                  label="Agregar Teléfono"
                  variant="primary"
                  size="sm"
                  icon="＋"
                  onClick={handleAddTelefono}
                />
              </div>
            </div>

            <Table
              columns={columns}
              data={datosPaginados}
              emptyMessage="No se encontraron teléfonos referenciados"
              enableColumnFilters={true}
              allData={data}
              textFilters={textFilters}
              selectedFilters={selectedFilters}
              onTextFilterChange={(colKey, text) => setTextFilters(prev => ({ ...prev, [colKey]: text }))}
              onSelectedFilterChange={(colKey, selected) => setSelectedFilters(prev => ({ ...prev, [colKey]: selected }))}
            />

            {/* ✅ ACTUALIZADO: Paginación con selector de tamaño */}
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              totalRegistros={datosFiltrados.length}
              indiceInicio={indiceInicio}
              indiceFin={indiceFin}
              onPaginaAnterior={() => setPaginaActual((p) => Math.max(1, p - 1))}
              onPaginaSiguiente={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
              onIrAPagina={setPaginaActual}
              // ✅ NUEVO: Props para selector de tamaño de página
              showPageSizeSelector={true}
              pageSize={pageSize}
              pageSizeOptions={[5, 10, 30, 50]}
              onPageSizeChange={(newSize) => setPageSize(newSize)}
            />
          </div>
        </div>
      </div>

      {/* Modales internos (registrar/editar) se mantienen como modales */}
      <ModalRegistrarTelefono
        isOpen={showRegistrar}
        onClose={() => setShowRegistrar(false)}
      />
      <ModalEditarTelefono
        isOpen={showEditar}
        onClose={() => {
          setShowEditar(false);
          setTelefonoEditar(null);
        }}
        telefono={telefonoEditar}
        onGuardar={handleGuardarEdicion}
      />
    </>
  );
};

export default PanelTelefonosReferenciados;