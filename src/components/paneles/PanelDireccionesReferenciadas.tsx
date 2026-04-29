import React, { useMemo, useState, useEffect } from 'react';
import Table from '../table/Table';
import ModalRegistrarDireccion from '../modals/accionesRapidas/ModalRegistrarDireccion';
import ModalEditarDireccion from '../modals/accionesRapidas/ModalEditarDireccion';
import { ActionButton } from '../ui';
import Paginacion from '../ui/Paginacion';
import type { Column, DireccionReferenciada, DireccionEditFormData } from '../../types';
import { direccionesReferenciadasMock } from '../../data/direccionesReferenciadas';

interface Props {
  isActive: boolean;
}

// Helper para celdas con wrap
const WrapCell: React.FC<{ children: React.ReactNode; color?: string; weight?: number }> = ({ 
  children, color, weight 
}) => (
  <span style={{
    fontSize: '11px', color: color || '#1a2540', fontWeight: weight || 400,
    display: 'block', whiteSpace: 'normal', wordWrap: 'break-word', lineHeight: '1.4', maxWidth: '100%'
  }}>
    {children}
  </span>
);

// ❌ ELIMINADO: const REGISTROS_POR_PAGINA = 15;

const PanelDireccionesReferenciadas: React.FC<Props> = ({ isActive }) => {
  const [data, setData] = useState<DireccionReferenciada[]>(direccionesReferenciadasMock);
  const [showRegistrar, setShowRegistrar] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [direccionEditar, setDireccionEditar] = useState<DireccionReferenciada | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);

  // ✅ NUEVO: Estado para tamaño de página
  const [pageSize, setPageSize] = useState(5);

  // Estados para los filtros
  const [textFilters, setTextFilters] = useState<Record<string, string>>({});
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  // Aplicar filtros a TODOS los datos (data)
  const datosFiltrados = useMemo(() => {
    let filtered = [...data];

    // Filtros de texto libre (coincidencia parcial)
    Object.entries(textFilters).forEach(([key, text]) => {
      if (text) {
        filtered = filtered.filter(item => {
          const value = item[key as keyof DireccionReferenciada];
          return value != null && String(value).toLowerCase().includes(text.toLowerCase());
        });
      }
    });

    // Filtros de selección exacta (checkboxes)
    Object.entries(selectedFilters).forEach(([key, selectedVals]) => {
      if (selectedVals.length) {
        filtered = filtered.filter(item => {
          const value = item[key as keyof DireccionReferenciada];
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

  const handleEdit = (row: DireccionReferenciada) => {
    setDireccionEditar(row);
    setShowEditar(true);
  };

  const handleAddDireccion = () => {
    setShowRegistrar(true);
  };

  const handleGuardarEdicion = (formData: DireccionEditFormData & { id: string }) => {
    setData((prev) =>
      prev.map((d) =>
        d.id === formData.id
          ? {
              ...d,
              direccion: `${formData.direccion}, ${formData.distrito}`,
              departamento: formData.departamento,
              provincia: formData.provincia,
              distrito: formData.distrito,
              refUbicacion: formData.refUbicacion,
              comentario: formData.comentario,
              llegoDeBase: formData.llegoDeBase,
              tipoDeudor: formData.tipoDeudor,
              nombreAval: formData.nombreAval,
              estado: formData.estado,
              nombre: formData.tipoDeudor,
            }
          : d
      )
    );
  };

  // Definición de columnas con anchos para alineación de filtros
  const columns: Column[] = useMemo(
    () => [
      {
        key: 'direccion',
        label: 'Dirección',
        render: (row: DireccionReferenciada) => <WrapCell>{row.direccion}</WrapCell>,
      },
      {
        key: 'refUbicacion',
        label: 'Ref. Ubicación',
        render: (row: DireccionReferenciada) => <WrapCell>{row.refUbicacion}</WrapCell>,
      },
      {
        key: 'tipoDeudor',
        label: 'Tipo Deudor',
        render: (row: DireccionReferenciada) => (
          <span className={`badge ${row.tipoDeudor === 'Titular' ? 'badge-s' : 'badge-info'}`}>
            {row.tipoDeudor}
          </span>
        ),
      },
      {
        key: 'nombre',
        label: 'Nombre',
        render: (row: DireccionReferenciada) => <WrapCell weight={500}>{row.nombre}</WrapCell>,
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (row: DireccionReferenciada) => {
          const estados: Record<string, string> = {
            OPERATIVO: 'badge-s',
            INACTIVO: 'badge-d',
            PENDIENTE: 'badge-w',
            VERIFICAR: 'badge-info',
            ELIMINADO: 'badge-n',
          };
          const badgeClass = estados[row.estado] || 'badge-n';
          return <span className={`badge ${badgeClass}`}>{row.estado || '—'}</span>;
        },
      },
      {
        key: 'acciones',
        label: 'Editar',
        filterable: false,
        render: (row: DireccionReferenciada) => (
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
          <span className="panel-colapsable-title">DIRECCIONES REFERENCIADAS</span>
        </div>
        <div className="panel-colapsable-body">
          <div style={{ padding: '16px 0' }}>
            {/* Header con información de registros y botón agregar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                Mostrando {indiceInicio + 1}-{indiceFin} de {datosFiltrados.length} dirección(es)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', color: '#6b7a99' }}>
                  Página {paginaActual} de {totalPaginas}
                </span>
                <ActionButton
                  label="Agregar Dirección"
                  variant="primary"
                  size="sm"
                  icon="＋"
                  onClick={handleAddDireccion}
                />
              </div>
            </div>

            <Table
              columns={columns}
              data={datosPaginados}
              emptyMessage="No se encontraron direcciones referenciadas"
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

      <ModalRegistrarDireccion
        isOpen={showRegistrar}
        onClose={() => setShowRegistrar(false)}
      />

      <ModalEditarDireccion
        isOpen={showEditar}
        onClose={() => {
          setShowEditar(false);
          setDireccionEditar(null);
        }}
        direccion={direccionEditar}
        onGuardar={handleGuardarEdicion}
      />
    </>
  );
};

export default PanelDireccionesReferenciadas;