import React, { useState, useRef, useEffect } from 'react';
import Table from '../table/Table';
import Modal from '../modals/Modal';
import Paginacion from '../ui/Paginacion';
import { TABLAS_CONFIG, CLIENTE_A_ESQUEMA, BOTONES_POR_CLIENTE } from '../../data/tableConfigs';
import type { Documento } from '../../types';

interface Props {
  documentos: Documento[];
  id_cliente: string;
  onDocumentoClick?: (doc: Documento) => void;
}

// Eliminamos la constante fija REGISTROS_POR_PAGINA

const DocumentosTable: React.FC<Props> = ({
  documentos,
  id_cliente,
  onDocumentoClick
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  // ─── PAGINACIÓN ───
  const [paginaActual, setPaginaActual] = useState(1);
  const [pageSize, setPageSize] = useState(5); // nuevo: tamaño de página, default 5

  const totalPaginas = Math.ceil(documentos.length / pageSize);
  const indiceInicio = (paginaActual - 1) * pageSize;
  const indiceFin = indiceInicio + pageSize;
  const documentosPaginados = documentos.slice(indiceInicio, indiceFin);

  // Resetear a página 1 cuando cambia el total de documentos, el id_cliente o el pageSize
  React.useEffect(() => {
    setPaginaActual(1);
  }, [documentos.length, id_cliente, pageSize]); // agregamos pageSize como dependencia

  const nombreEsquema = CLIENTE_A_ESQUEMA[id_cliente] || CLIENTE_A_ESQUEMA['DEFAULT'];
  const columnas = TABLAS_CONFIG[nombreEsquema];
  const botonesDinamicos = BOTONES_POR_CLIENTE[nombreEsquema] || BOTONES_POR_CLIENTE['DEFAULT'];

  // ─── CARRUSEL DE BOTONES (sin cambios) ───
  const scrollRef = useRef<HTMLDivElement>(null);
  const [puedeScrollIzq, setPuedeScrollIzq] = useState(false);
  const [puedeScrollDer, setPuedeScrollDer] = useState(false);

  const verificarScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setPuedeScrollIzq(el.scrollLeft > 0);
    setPuedeScrollDer(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    verificarScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', verificarScroll);
    window.addEventListener('resize', verificarScroll);
    return () => {
      el.removeEventListener('scroll', verificarScroll);
      window.removeEventListener('resize', verificarScroll);
    };
  }, [botonesDinamicos]);

  const scroll = (direccion: 'izq' | 'der') => {
    const el = scrollRef.current;
    if (!el) return;
    const cantidad = 200;
    el.scrollBy({ left: direccion === 'izq' ? -cantidad : cantidad, behavior: 'smooth' });
  };

  const openModal = (title: string) => {
    setModalTitle(title);
    setModalOpen(true);
  };

  return (
    <div className="ficha-card">
      <div className="documentos-header">
        <span className="section-title">
          DOCUMENTOS A GESTIONAR - {nombreEsquema.replace(/_/g, ' ')}
        </span>
      </div>

      <Table
        columns={columnas}
        data={documentosPaginados}
        onRowClick={onDocumentoClick}
        emptyMessage="No se encontraron documentos para este cliente."
        fitToPanel={false}
      />

      {/* Mostrar paginación solo si hay más de 1 página O si queremos mostrar el selector siempre 
          (opcional: Podríamos mostrarlo siempre; aquí lo mostramos si hay más de 1 página o si pageSize cambia) */}
      {(totalPaginas > 1 || true) && ( // Cambiamos condición para que aparezca el selector incluso con 1 página
        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          totalRegistros={documentos.length}
          indiceInicio={indiceInicio}
          indiceFin={indiceFin}
          onPaginaAnterior={() => setPaginaActual((p) => Math.max(1, p - 1))}
          onPaginaSiguiente={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
          onIrAPagina={setPaginaActual}
          // Nuevas props
          showPageSizeSelector={true}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 30, 50]}
          onPageSizeChange={(newSize) => setPageSize(newSize)}
        />
      )}

      {/* ─── BOTONES CON CARRUSEL MANUAL (sin cambios) ─── */}
      <div className="ficha-block botones-carrusel-wrapper" style={{ marginTop: '12px' }}>
        {puedeScrollIzq && (
          <button
            type="button"
            className="carrusel-flecha carrusel-flecha-izq"
            onClick={() => scroll('izq')}
            aria-label="Ver botones anteriores"
          >
            ‹
          </button>
        )}

        <div className="botones-scroll-container" ref={scrollRef}>
          <div className="botones-estaticos">
            {botonesDinamicos.map((boton) => (
              <button
                key={boton}
                className="btn-est"
                type="button"
                onClick={() => openModal(boton)}
              >
                + {boton}
              </button>
            ))}
          </div>
        </div>

        {puedeScrollDer && (
          <button
            type="button"
            className="carrusel-flecha carrusel-flecha-der"
            onClick={() => scroll('der')}
            aria-label="Ver más botones"
          >
            ›
          </button>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        title={modalTitle}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default DocumentosTable;