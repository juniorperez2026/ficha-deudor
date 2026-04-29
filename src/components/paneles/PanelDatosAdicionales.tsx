import React, { useMemo, useState, useEffect, useRef } from 'react';
import Table from '../table/Table';
import Paginacion from '../ui/Paginacion';
import type { Column, DatoAdicional } from '../../types/index';
import { datosAdicionalesMock } from '../../data/datosAdicionales';

interface Props {
  isActive: boolean;
}

const WrapCell: React.FC<{ children: React.ReactNode; color?: string; weight?: number }> = ({ 
  children, color, weight 
}) => (
  <span style={{
    fontSize: '11px',
    color: color || '#1a2540',
    fontWeight: weight || 400,
    display: 'block',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    lineHeight: '1.4',
    maxWidth: '100%'
  }}>
    {children}
  </span>
);

// ❌ ELIMINADO: const REGISTROS_POR_PAGINA = 15;

const PanelDatosAdicionales: React.FC<Props> = ({ isActive }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  
  // ✅ NUEVO: Estado para tamaño de página (igual que DocumentosTable)
  const [pageSize, setPageSize] = useState(5);

  const [textFilters, setTextFilters] = useState<Record<string, string>>({});
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const columns: Column[] = useMemo(() => [
    { key: 'recibo', label: 'Recibo', render: (row: DatoAdicional) => <WrapCell weight={600}>{row.recibo}</WrapCell> },
    { key: 'telefono', label: 'Teléfono', render: (row: DatoAdicional) => <WrapCell weight={500}>{row.telefono}</WrapCell> },
    { key: 'servicio', label: 'Servicio', render: (row: DatoAdicional) => <WrapCell>{row.servicio}</WrapCell> },
    {
      key: 'estadoServicio',
      label: 'Estado de Servicio',
      render: (row: DatoAdicional) => {
        const estados: Record<string, { color: string; bg: string }> = {
          Activo: { color: '#166534', bg: '#dcfce7' },
          Suspendido: { color: '#854d0e', bg: '#fef9c3' },
          Cancelado: { color: '#991b1b', bg: '#fee2e2' }
        };
        const estilo = estados[row.estadoServicio] || { color: '#374151', bg: '#f3f4f6' };
        return (
          <span style={{
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 600,
            color: estilo.color,
            backgroundColor: estilo.bg,
            display: 'inline-block'
          }}>
            {row.estadoServicio}
          </span>
        );
      }
    },
    { key: 'motivo', label: 'Motivo', render: (row: DatoAdicional) => <WrapCell>{row.motivo}</WrapCell> },
    { key: 'codCliente', label: 'Cod. Cliente', render: (row: DatoAdicional) => <WrapCell weight={500}>{row.codCliente}</WrapCell> }
  ], []);

  // 🔍 FILTROS (sin cambios)
  const datosFiltrados = useMemo(() => {
    let filtered = [...datosAdicionalesMock];

    Object.entries(textFilters).forEach(([key, text]) => {
      if (text) {
        filtered = filtered.filter(item => {
          const value = item[key as keyof DatoAdicional];
          return value != null && String(value).toLowerCase().includes(text.toLowerCase());
        });
      }
    });

    Object.entries(selectedFilters).forEach(([key, selectedVals]) => {
      if (selectedVals.length) {
        filtered = filtered.filter(item => {
          const value = item[key as keyof DatoAdicional];
          return value != null && selectedVals.includes(String(value));
        });
      }
    });

    return filtered;
  }, [textFilters, selectedFilters]);

  // 📄 PAGINACIÓN (actualizado con pageSize dinámico)
  const totalPaginas = Math.ceil(datosFiltrados.length / pageSize);
  const indiceInicio = (paginaActual - 1) * pageSize;
  const datosPaginados = datosFiltrados.slice(indiceInicio, indiceInicio + pageSize);
  const indiceFin = Math.min(indiceInicio + pageSize, datosFiltrados.length);

  // ✅ ACTUALIZADO: Resetear página cuando cambian filtros, datos o pageSize
  useEffect(() => {
    setPaginaActual(1);
  }, [datosFiltrados.length, pageSize]); // ← Agregado pageSize como dependencia

  useEffect(() => {
    if (!isActive) {
      setTextFilters({});
      setSelectedFilters({});
      setPaginaActual(1);
    }
  }, [isActive]);

  const handleRowClick = (row: DatoAdicional) => {
    console.log('Fila seleccionada:', row);
  };

  if (!isActive) return null;

  return (
    <div className="ficha-card panel-colapsable">
      <div className="panel-colapsable-header">
        <span className="panel-colapsable-title">DATOS ADICIONALES</span>
      </div>

      <div className="panel-colapsable-body">
        <div style={{ padding: '16px 0' }}>
          <Table
            columns={columns}
            data={datosPaginados}
            onRowClick={handleRowClick}
            emptyMessage="No se encontraron datos adicionales"
            enableColumnFilters={true}
            allData={datosAdicionalesMock}
            textFilters={textFilters}
            selectedFilters={selectedFilters}
            onTextFilterChange={(colKey, text) =>
              setTextFilters(prev => ({ ...prev, [colKey]: text }))
            }
            onSelectedFilterChange={(colKey, selected) =>
              setSelectedFilters(prev => ({ ...prev, [colKey]: selected }))
            }
          />

          {/* ✅ ACTUALIZADO: Paginación con selector de tamaño */}
          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            totalRegistros={datosFiltrados.length}
            indiceInicio={indiceInicio}
            indiceFin={indiceFin}
            onPaginaAnterior={() => setPaginaActual(p => Math.max(1, p - 1))}
            onPaginaSiguiente={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
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
  );
};

export default PanelDatosAdicionales;