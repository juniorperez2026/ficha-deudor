import React, { useMemo, useState } from 'react';
import Modal from '../Modal';
import Table from '../../table/Table';
import DeudorHeaderBlock from '../../ficha/DeudorHeaderBlock';
import { ActionButton } from '../../ui';
import Paginacion from '../../ui/Paginacion';  // ← IMPORTAR (igual que en txt2)
import type { Column, EstadoGestion, EstadoGestionCompleta } from '../../../types';
import { estadosGestionMock } from '../../../data/estadosGestion';
import { estadosGestionCompletasMock } from '../../../data/estadosGestion';
import { deudorHeaderMock } from '../../../data/deudorHeaderMock';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Helper para celdas con wrap
const WrapCell: React.FC<{ children: React.ReactNode; color?: string; weight?: number }> = ({ 
  children, 
  color, 
  weight 
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

const REGISTROS_POR_PAGINA = 15;

const ModalEstadoGestionRealizada: React.FC<Props> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<EstadoGestion[]>(estadosGestionMock);
  const [vistaExpandida, setVistaExpandida] = useState(false);
  
  // Paginación vista resumida
  const [paginaResumida, setPaginaResumida] = useState(1);
  const totalPaginasResumida = Math.ceil(data.length / REGISTROS_POR_PAGINA);
  const indiceInicioResumida = (paginaResumida - 1) * REGISTROS_POR_PAGINA;
  const indiceFinResumida = indiceInicioResumida + REGISTROS_POR_PAGINA;
  const datosPaginadosResumida = data.slice(indiceInicioResumida, indiceFinResumida);

  // Paginación vista expandida
  const [paginaExpandida, setPaginaExpandida] = useState(1);
  const totalPaginasExpandida = Math.ceil(estadosGestionCompletasMock.length / REGISTROS_POR_PAGINA);
  const indiceInicioExpandida = (paginaExpandida - 1) * REGISTROS_POR_PAGINA;
  const indiceFinExpandida = indiceInicioExpandida + REGISTROS_POR_PAGINA;
  const datosPaginadosExpandida = estadosGestionCompletasMock.slice(indiceInicioExpandida, indiceFinExpandida);

  // Resetear páginas al cambiar de vista o abrir modal
  React.useEffect(() => {
    if (isOpen) {
      setPaginaResumida(1);
      setPaginaExpandida(1);
    }
  }, [isOpen, vistaExpandida]);

  const handleVerMas = () => {
    setVistaExpandida(true);
    setPaginaExpandida(1);
  };

  const handleVolver = () => {
    setVistaExpandida(false);
    setPaginaResumida(1);
  };

  // ─── COLUMNAS VISTA RESUMIDA ───
  const columnsResumidas: Column[] = useMemo(
    () => [
      {
        key: 'nro',
        label: 'Nro',
        width: '50px',
        render: (row: EstadoGestion) => (
          <span style={{ fontWeight: 700, color: '#1a2540' }}>{row.nro}</span>
        ),
      },
      {
        key: 'fecha',
        label: 'Fecha',
        width: '130px',
      },
      {
        key: 'operador',
        label: 'Operador',
        width: '130px',
        render: (row: EstadoGestion) => <WrapCell>{row.operador}</WrapCell>,
      },
      {
        key: 'documento',
        label: 'Documento',
        width: '110px',
      },
      {
        key: 'operacion',
        label: 'Operación',
        width: '140px',
        render: (row: EstadoGestion) => (
          <span
            style={{
              padding: '3px 8px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: 600,
              color: '#1a5fa8',
              backgroundColor: '#e6f0fb',
              display: 'inline-block',
              textTransform: 'uppercase',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              maxWidth: '130px',
            }}
          >
            {row.operacion}
          </span>
        ),
      },
      {
        key: 'resultado',
        label: 'Resultado',
        width: '180px',
        render: (row: EstadoGestion) => (
          <WrapCell 
            color={row.resultado.includes('Contactado') ? '#166534' : '#991b1b'} 
            weight={500}
          >
            {row.resultado}
          </WrapCell>
        ),
      },
      {
        key: 'comentario',
        label: 'Comentario',
        width: '280px',
        render: (row: EstadoGestion) => <WrapCell>{row.comentario}</WrapCell>,
      },
    ],
    []
  );

  // ─── COLUMNAS VISTA EXPANDIDA ───
  const columnsCompletas: Column[] = useMemo(
    () => [
      {
        key: 'nro',
        label: 'Nro',
        width: '50px',
        render: (row: EstadoGestionCompleta) => (
          <span style={{ fontWeight: 700, color: '#1a2540' }}>{row.nro}</span>
        ),
      },
      {
        key: 'cliente',
        label: 'Cliente',
        width: '130px',
        render: (row: EstadoGestionCompleta) => <WrapCell>{row.cliente}</WrapCell>,
      },
      {
        key: 'cartera',
        label: 'Cartera',
        width: '130px',
        render: (row: EstadoGestionCompleta) => <WrapCell>{row.cartera}</WrapCell>,
      },
      {
        key: 'campana',
        label: 'Campaña',
        width: '80px',
      },
      {
        key: 'fecha',
        label: 'Fecha',
        width: '120px',
      },
      {
        key: 'gestor',
        label: 'Gestor',
        width: '120px',
        render: (row: EstadoGestionCompleta) => <WrapCell>{row.gestor}</WrapCell>,
      },
      {
        key: 'documento',
        label: 'Documento',
        width: '100px',
      },
      {
        key: 'operacion',
        label: 'Operación',
        width: '120px',
        render: (row: EstadoGestionCompleta) => (
          <span
            style={{
              padding: '3px 8px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: 600,
              color: '#1a5fa8',
              backgroundColor: '#e6f0fb',
              display: 'inline-block',
              textTransform: 'uppercase',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              maxWidth: '110px',
            }}
          >
            {row.operacion}
          </span>
        ),
      },
      {
        key: 'resultado',
        label: 'Resultado',
        width: '160px',
        render: (row: EstadoGestionCompleta) => (
          <WrapCell 
            color={row.resultado.includes('Contactado') ? '#166534' : '#991b1b'} 
            weight={500}
          >
            {row.resultado}
          </WrapCell>
        ),
      },
      {
        key: 'comentario',
        label: 'Comentario',
        width: '220px',
        render: (row: EstadoGestionCompleta) => <WrapCell>{row.comentario}</WrapCell>,
      },
    ],
    []
  );

  return (
    <Modal
      isOpen={isOpen}
      title={vistaExpandida ? 'TODOS LOS ESTADOS DE GESTIÓN' : 'ESTADO DE GESTIÓN REALIZADA'}
      onClose={onClose}
      size={vistaExpandida ? 'full' : 'xl'}
    >
      {!vistaExpandida ? (
        // ─── VISTA RESUMIDA CON PAGINACIÓN ───
        <div style={{ padding: '16px 0' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
              {data.length} estado(s) de gestión registrado(s)
            </span>
          </div>

          <Table
            columns={columnsResumidas}
            data={datosPaginadosResumida}
            emptyMessage="No se encontraron estados de gestión"
          />

          <Paginacion
            paginaActual={paginaResumida}
            totalPaginas={totalPaginasResumida}
            totalRegistros={data.length}
            indiceInicio={indiceInicioResumida}
            indiceFin={indiceFinResumida}
            onPaginaAnterior={() => setPaginaResumida((p) => Math.max(1, p - 1))}
            onPaginaSiguiente={() => setPaginaResumida((p) => Math.min(totalPaginasResumida, p + 1))}
            onIrAPagina={setPaginaResumida}
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
        // ─── VISTA EXPANDIDA CON PAGINACIÓN ───
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <DeudorHeaderBlock data={deudorHeaderMock} layout="compact" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                {estadosGestionCompletasMock.length} estado(s) de gestión en total
              </span>
              <ActionButton
                label="Volver"
                variant="secondary"
                size="sm"
                icon="◀"
                onClick={handleVolver}
              />
            </div>

            <div className="table-scroll">
              <Table
                columns={columnsCompletas}
                data={datosPaginadosExpandida}
                emptyMessage="No se encontraron estados de gestión"
              />
            </div>

            <Paginacion
              paginaActual={paginaExpandida}
              totalPaginas={totalPaginasExpandida}
              totalRegistros={estadosGestionCompletasMock.length}
              indiceInicio={indiceInicioExpandida}
              indiceFin={indiceFinExpandida}
              onPaginaAnterior={() => setPaginaExpandida((p) => Math.max(1, p - 1))}
              onPaginaSiguiente={() => setPaginaExpandida((p) => Math.min(totalPaginasExpandida, p + 1))}
              onIrAPagina={setPaginaExpandida}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModalEstadoGestionRealizada;