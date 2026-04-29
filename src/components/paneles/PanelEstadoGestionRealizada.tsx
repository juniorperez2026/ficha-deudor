import React, { useMemo, useState, useEffect } from 'react';
import Table from '../table/Table';
import DeudorHeaderBlock from '../ficha/DeudorHeaderBlock';
import { ActionButton } from '../ui';
import Paginacion from '../ui/Paginacion';
import type { Column, EstadoGestion, EstadoGestionCompleta } from '../../types';
import { estadosGestionMock, estadosGestionCompletasMock } from '../../data/estadosGestion';
import { deudorHeaderMock } from '../../data/deudorHeaderMock';

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
      color: color || '#5a6680',
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

const PanelEstadoGestionRealizada: React.FC<Props> = ({ isActive }) => {
  const [data] = useState<EstadoGestion[]>(estadosGestionMock);
  const [vistaExpandida, setVistaExpandida] = useState(false);
  
  // ✅ NUEVO: Estados para tamaño de página (uno por vista)
  const [pageSizeResumida, setPageSizeResumida] = useState(5);
  const [pageSizeExpandida, setPageSizeExpandida] = useState(5);

  // --- Estado filtros vista resumida ---
  const [textFiltersResumida, setTextFiltersResumida] = useState<Record<string, string>>({});
  const [selectedFiltersResumida, setSelectedFiltersResumida] = useState<Record<string, string[]>>({});
  
  // --- Estado filtros vista expandida ---
  const [textFiltersExpandida, setTextFiltersExpandida] = useState<Record<string, string>>({});
  const [selectedFiltersExpandida, setSelectedFiltersExpandida] = useState<Record<string, string[]>>({});

  // --- Aplicar filtros a datos resumidos ---
  const datosFiltradosResumida = useMemo(() => {
    let filtered = [...data];
    Object.entries(textFiltersResumida).forEach(([key, text]) => {
      if (text) {
        filtered = filtered.filter(item => {
          const value = item[key as keyof EstadoGestion];
          return value != null && String(value).toLowerCase().includes(text.toLowerCase());
        });
      }
    });
    Object.entries(selectedFiltersResumida).forEach(([key, selectedVals]) => {
      if (selectedVals.length) {
        filtered = filtered.filter(item => {
          const value = item[key as keyof EstadoGestion];
          return value != null && selectedVals.includes(String(value));
        });
      }
    });
    return filtered;
  }, [data, textFiltersResumida, selectedFiltersResumida]);

  // --- Paginación vista resumida con pageSize dinámico ---
  const totalPaginasResumida = Math.ceil(datosFiltradosResumida.length / pageSizeResumida);
  const [paginaResumida, setPaginaResumida] = useState(1);
  const indiceInicioResumida = (paginaResumida - 1) * pageSizeResumida;
  const datosPaginadosResumida = datosFiltradosResumida.slice(indiceInicioResumida, indiceInicioResumida + pageSizeResumida);
  const indiceFinResumida = Math.min(indiceInicioResumida + pageSizeResumida, datosFiltradosResumida.length);

  // --- Aplicar filtros a datos expandidos ---
  const datosFiltradosExpandida = useMemo(() => {
    let filtered = [...estadosGestionCompletasMock];
    Object.entries(textFiltersExpandida).forEach(([key, text]) => {
      if (text) {
        filtered = filtered.filter(item => {
          const value = item[key as keyof EstadoGestionCompleta];
          return value != null && String(value).toLowerCase().includes(text.toLowerCase());
        });
      }
    });
    Object.entries(selectedFiltersExpandida).forEach(([key, selectedVals]) => {
      if (selectedVals.length) {
        filtered = filtered.filter(item => {
          const value = item[key as keyof EstadoGestionCompleta];
          return value != null && selectedVals.includes(String(value));
        });
      }
    });
    return filtered;
  }, [textFiltersExpandida, selectedFiltersExpandida]);

  // --- Paginación vista expandida con pageSize dinámico ---
  const totalPaginasExpandida = Math.ceil(datosFiltradosExpandida.length / pageSizeExpandida);
  const [paginaExpandida, setPaginaExpandida] = useState(1);
  const indiceInicioExpandida = (paginaExpandida - 1) * pageSizeExpandida;
  const datosPaginadosExpandida = datosFiltradosExpandida.slice(indiceInicioExpandida, indiceInicioExpandida + pageSizeExpandida);
  const indiceFinExpandida = Math.min(indiceInicioExpandida + pageSizeExpandida, datosFiltradosExpandida.length);

  // ✅ ACTUALIZADO: Resetear página cuando cambian filtros o pageSize (cada vista independiente)
  useEffect(() => {
    setPaginaResumida(1);
  }, [datosFiltradosResumida.length, pageSizeResumida]); // ← Agregado pageSizeResumida

  useEffect(() => {
    setPaginaExpandida(1);
  }, [datosFiltradosExpandida.length, pageSizeExpandida]); // ← Agregado pageSizeExpandida

  // Resetear filtros, páginas y pageSizes al cerrar panel o cambiar de vista
  useEffect(() => {
    if (!isActive) {
      setTextFiltersResumida({});
      setSelectedFiltersResumida({});
      setTextFiltersExpandida({});
      setSelectedFiltersExpandida({});
      setPaginaResumida(1);
      setPaginaExpandida(1);
      setPageSizeResumida(5);      // ← Resetear a default
      setPageSizeExpandida(5);     // ← Resetear a default
      setVistaExpandida(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (vistaExpandida) {
      setPaginaExpandida(1);
    } else {
      setPaginaResumida(1);
    }
  }, [vistaExpandida]);

  const handleVerMas = () => {
    setVistaExpandida(true);
  };

  const handleVolver = () => {
    setVistaExpandida(false);
  };

  // --- Columnas vista resumida (con widths) ---
  const columnsResumidas: Column[] = useMemo(
    () => [
      { key: 'nro', label: 'Nro', render: (row: EstadoGestion) => <span style={{ fontWeight: 700, color: '#1a2540' }}>{row.nro}</span> },
      { key: 'fecha', label: 'Fecha'},
      { key: 'operador', label: 'Operador', render: (row: EstadoGestion) => <WrapCell>{row.operador}</WrapCell> },
      { key: 'documento', label: 'Documento'},
      { key: 'operacion', label: 'Operación', render: (row: EstadoGestion) => <span className="badge badge-info" style={{ fontSize: '10px', textTransform: 'uppercase' }}>{row.operacion}</span> },
      { key: 'resultado', label: 'Resultado', render: (row: EstadoGestion) => <WrapCell color={row.resultado.includes('Contactado') ? '#166534' : '#991b1b'} weight={500}>{row.resultado}</WrapCell> },
      { key: 'comentario', label: 'Comentario', render: (row: EstadoGestion) => <WrapCell>{row.comentario}</WrapCell> },
    ],
    []
  );

  // --- Columnas vista expandida (con widths) ---
  const columnsExpandidas: Column[] = useMemo(
    () => [
      { key: 'nro', label: 'Nro', render: (row: EstadoGestionCompleta) => <span style={{ fontWeight: 700, color: '#1a2540' }}>{row.nro}</span> },
      { key: 'cliente', label: 'Cliente', render: (row: EstadoGestionCompleta) => <WrapCell>{row.cliente}</WrapCell> },
      { key: 'cartera', label: 'Cartera', render: (row: EstadoGestionCompleta) => <WrapCell>{row.cartera}</WrapCell> },
      { key: 'campana', label: 'Campaña'},
      { key: 'fecha', label: 'Fecha'},
      { key: 'gestor', label: 'Gestor', render: (row: EstadoGestionCompleta) => <WrapCell>{row.gestor}</WrapCell> },
      { key: 'documento', label: 'Documento'},
      { key: 'operacion', label: 'Operación', render: (row: EstadoGestionCompleta) => <span className="badge badge-info" style={{ fontSize: '10px', textTransform: 'uppercase' }}>{row.operacion}</span> },
      { key: 'resultado', label: 'Resultado', render: (row: EstadoGestionCompleta) => <WrapCell color={row.resultado.includes('Contactado') ? '#166534' : '#991b1b'} weight={500}>{row.resultado}</WrapCell> },
      { key: 'comentario', label: 'Comentario', render: (row: EstadoGestionCompleta) => <WrapCell>{row.comentario}</WrapCell> },
    ],
    []
  );

  if (!isActive) return null;

  return (
    <div className="ficha-card panel-colapsable">
      <div className="panel-colapsable-header">
        <span className="panel-colapsable-title">
          {vistaExpandida ? 'TODOS LOS ESTADOS DE GESTIÓN' : 'ESTADO DE GESTIÓN REALIZADA'}
        </span>
      </div>
      <div className="panel-colapsable-body">
        {!vistaExpandida ? (
          // ─── VISTA RESUMIDA ───
          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                {datosFiltradosResumida.length} estado(s) de gestión filtrado(s)
              </span>
            </div>

            <Table
              columns={columnsResumidas}
              data={datosPaginadosResumida}
              emptyMessage="No se encontraron estados de gestión"
              enableColumnFilters={true}
              allData={data}
              textFilters={textFiltersResumida}
              selectedFilters={selectedFiltersResumida}
              onTextFilterChange={(colKey, text) => setTextFiltersResumida(prev => ({ ...prev, [colKey]: text }))}
              onSelectedFilterChange={(colKey, selected) => setSelectedFiltersResumida(prev => ({ ...prev, [colKey]: selected }))}
            />

            {/* ✅ ACTUALIZADO: Paginación con selector de tamaño */}
            <Paginacion
              paginaActual={paginaResumida}
              totalPaginas={totalPaginasResumida}
              totalRegistros={datosFiltradosResumida.length}
              indiceInicio={indiceInicioResumida}
              indiceFin={indiceFinResumida}
              onPaginaAnterior={() => setPaginaResumida(p => Math.max(1, p - 1))}
              onPaginaSiguiente={() => setPaginaResumida(p => Math.min(totalPaginasResumida, p + 1))}
              onIrAPagina={setPaginaResumida}
              // ✅ NUEVO: Props para selector de tamaño de página
              showPageSizeSelector={true}
              pageSize={pageSizeResumida}
              pageSizeOptions={[5, 10, 30, 50]}
              onPageSizeChange={(newSize) => setPageSizeResumida(newSize)}
            />

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <ActionButton
                label="Ver más estados de gestiones"
                variant="info"
                size="md"
                icon="▼"
                onClick={handleVerMas}
              />
            </div>
          </div>
        ) : (
          // ─── VISTA EXPANDIDA ───
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <DeudorHeaderBlock data={deudorHeaderMock} layout="compact" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                  {datosFiltradosExpandida.length} estado(s) de gestión en total (filtrados)
                </span>
                <ActionButton label="Volver" variant="secondary" size="sm" icon="◀" onClick={handleVolver} />
              </div>

              <Table
                columns={columnsExpandidas}
                data={datosPaginadosExpandida}
                emptyMessage="No se encontraron estados de gestión"
                enableColumnFilters={true}
                allData={estadosGestionCompletasMock}
                textFilters={textFiltersExpandida}
                selectedFilters={selectedFiltersExpandida}
                onTextFilterChange={(colKey, text) => setTextFiltersExpandida(prev => ({ ...prev, [colKey]: text }))}
                onSelectedFilterChange={(colKey, selected) => setSelectedFiltersExpandida(prev => ({ ...prev, [colKey]: selected }))}
              />

              {/* ✅ ACTUALIZADO: Paginación con selector de tamaño */}
              <Paginacion
                paginaActual={paginaExpandida}
                totalPaginas={totalPaginasExpandida}
                totalRegistros={datosFiltradosExpandida.length}
                indiceInicio={indiceInicioExpandida}
                indiceFin={indiceFinExpandida}
                onPaginaAnterior={() => setPaginaExpandida(p => Math.max(1, p - 1))}
                onPaginaSiguiente={() => setPaginaExpandida(p => Math.min(totalPaginasExpandida, p + 1))}
                onIrAPagina={setPaginaExpandida}
                // ✅ NUEVO: Props para selector de tamaño de página
                showPageSizeSelector={true}
                pageSize={pageSizeExpandida}
                pageSizeOptions={[5, 10, 30, 50]}
                onPageSizeChange={(newSize) => setPageSizeExpandida(newSize)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelEstadoGestionRealizada;