import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Table from '../../../../shared/components/table/Table';
import { ActionButton } from '../../../../shared/components/ui';
import Paginacion from '../../../../shared/components/ui/Paginacion';
import { WrapCell } from '../../../../shared/components/ui/WrapCell';
import { useEmailsByDeudor } from '../../hooks/popups/useEmailsByDeudor';
import type { Column, Email, EmailFormData, EmailEditFormData, DeudorInfo } from '../../../../shared/types';
import ModalRegistrarEmail from '../modals/popups/email/ModalRegistrarEmail';
import ModalEditarEmail from '../modals/popups/email/ModalEditarEmail';
import { createEmail, updateEmail } from '../../api/popups/emailsApi';

const ESTADOS_BADGE: Record<string, string> = {
  ACTIVO: 'badge-s',
  INACTIVO: 'badge-d',
};

const formatFecha = (fechaIso: string): string => {
  if (!fechaIso) return '—';
  const d = new Date(fechaIso);
  if (isNaN(d.getTime())) return fechaIso;
  return d.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const EmailDeudorPopup: React.FC = () => {
  const { id_cliente, id_deudor, id_usuario } = useParams<{
    id_cliente: string;
    id_deudor: string;
    id_usuario: string;
  }>();

  const [searchParams] = useSearchParams();
  const nombre = decodeURIComponent(searchParams.get('nombre') || '');
  const documento = decodeURIComponent(searchParams.get('documento') || '');
  const deudorData: DeudorInfo | null = nombre
  ? {
      nombreRazonSocial: nombre,
      dniRuc: documento,
      gradoInstruccion: '',
      edad: '',
      contacto: '',
      asesorPostVenta: '',
      asesorComercial: '',
      correoApv: '',
      correoAc: '',
    }
  : null;
    
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
  } = useEmailsByDeudor(id_cliente ?? '', id_deudor ?? '');

  const [showRegistrar, setShowRegistrar] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [emailEditarId, setEmailEditarId] = useState<string | null>(null);

  const handleClose = () => {
    window.close();
  };

  const handleEdit = useCallback((row: Email) => {
    setEmailEditarId(row.id);
    setShowEditar(true);
  }, []);

  const handleNuevo = () => {
    setShowRegistrar(true);
  };

  const handleRegistrar = async (formData: EmailFormData) => {
    try {
      if (!id_cliente || !id_deudor || !id_usuario) {
        console.error('Faltan parámetros:', { id_cliente, id_deudor, id_usuario });
        return;
      }
      await createEmail(id_cliente, id_deudor, id_usuario, formData);
      setShowRegistrar(false);
      refetch();
    } catch (err) {
      console.error('Error al registrar email:', err);
    }
  };

  const handleGuardarEdicion = async (formData: EmailEditFormData) => {
    try {
      if (!id_cliente || !id_deudor || !id_usuario || !emailEditarId) {
        console.error('Faltan parámetros para editar');
        return;
      }
      await updateEmail(id_cliente, id_deudor, id_usuario, emailEditarId, formData, formData.dFecRegistro);
      setShowEditar(false);
      setEmailEditarId(null);
      refetch();
    } catch (err) {
      console.error('Error al guardar edición:', err);
    }
  };

  const columns: Column[] = useMemo(
    () => [
      {
        key: 'id',
        label: 'Id',
        width: '80px',
        render: (row: Email) => <span>{row.id}</span>,
      },
      {
        key: 'email',
        label: 'Email',
        render: (row: Email) => <WrapCell>{row.email}</WrapCell>,
      },
      {
        key: 'fechaActivacion',
        label: 'Fecha Registro',
        width: '120px',
        render: (row: Email) => <span>{formatFecha(row.fechaActivacion)}</span>,
      },
      {
        key: 'estado',
        label: 'Estado',
        width: '90px',
        render: (row: Email) => {
          const badgeClass = ESTADOS_BADGE[row.estado] || '';
          return <span className={`badge ${badgeClass}`}>{row.estado || '—'}</span>;
        },
      },
      {
        key: 'status',
        label: 'Status',
        width: '110px',
        render: (row: Email) => <span>{row.status || '—'}</span>,
      },
      {
        key: 'fuente',
        label: 'Fuente',
        render: (row: Email) => <span>{row.fuente || '—'}</span>,
      },
      {
        key: 'baseCliente',
        label: 'Base Cliente',
        render: (row: Email) => <span>{row.baseCliente || '—'}</span>,
      },
      {
        key: 'contacto',
        label: 'Contacto',
        render: (row: Email) => <span>{row.contacto || '—'}</span>,
      },
      {
        key: 'prioridad',
        label: 'Prioridad',
        width: '80px',
        render: (row: Email) => <span>{row.prioridad}</span>,
      },
      {
        key: 'comentario',
        label: 'Comentario',
        render: (row: Email) => <WrapCell>{row.comentario || '—'}</WrapCell>,
      },
      {
        key: 'acciones',
        label: 'Editar',
        width: '55px',
        filterable: false,
        render: (row: Email) => (
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
    [handleEdit]
  );

  const indiceInicio = (pageNumber - 1) * pageSize;
  const indiceFin = Math.min(pageNumber * pageSize, totalRecords);

  if (isLoading) {
    return (
      <div className="popup-loading">
        <div className="popup-loading-spinner" />
        <p>Cargando emails...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="popup-error">
        <div className="popup-error-icon">⚠</div>
        <h4>Error al cargar emails</h4>
        <p>{error}</p>
        <div className="popup-error-actions">
          <button className="btn btn-primary" onClick={refetch}>
            Reintentar
          </button>
          <button className="btn btn-secondary" onClick={handleClose}>
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ─── HEADER ESTILO APP ─── */}
      <header className="app-header">
        <div className="app-logo">
          <span className="logo-text">EMAIL</span>
          <span className="logo-sub">DEUDOR</span>
        </div>
        <nav className="app-nav">
          <span className="nav-item">GESTIÓN DE COBRANZAS</span>
          <span className="nav-sep">›</span>
          <span className="nav-item nav-item--active">EMAILS</span>
        </nav>
        <div className="app-user">
          {nombre && (
            <span className="user-name" title={documento || undefined}>
              {nombre}
              {documento && <span className="user-doc"> — {documento}</span>}
            </span>
          )}
        </div>
      </header>

      {/* ─── CONTENIDO ─── */}
      <main className="popup-main">
        {/* Toolbar */}
        <div className="popup-toolbar">
          <div className="toolbar-info">
            <span className="toolbar-count">
              Mostrando <strong>{indiceInicio + 1}-{indiceFin}</strong> de <strong>{totalRecords}</strong> email(s)
            </span>
            <span className="toolbar-page">
              Página {pageNumber} de {totalPages}
            </span>
          </div>
          <ActionButton
            label="Agregar Email"
            variant="primary"
            size="sm"
            icon="＋"
            onClick={handleNuevo}
          />
        </div>

        {/* Tabla */}
        <div className="popup-table-wrapper">
          <Table
            columns={columns}
            data={paginatedData}
            emptyMessage="No se encontraron emails"
            enableColumnFilters={true}
            allData={allData}
            textFilters={textFilters}
            selectedFilters={selectedFilters}
            onTextFilterChange={onTextFilterChange}
            onSelectedFilterChange={onSelectedFilterChange}
          />
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="popup-pagination">
            <Paginacion
              paginaActual={pageNumber}
              totalPaginas={totalPages}
              totalRegistros={totalRecords}
              indiceInicio={indiceInicio}
              indiceFin={indiceFin}
              onPaginaAnterior={() => setPageNumber(Math.max(1, pageNumber - 1))}
              onPaginaSiguiente={() => setPageNumber(Math.min(totalPages, pageNumber + 1))}
              onIrAPagina={setPageNumber}
              showPageSizeSelector={true}
              pageSize={pageSize}
              pageSizeOptions={[5, 10, 30, 50]}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </main>

      {/* ─── MODALES ─── */}
      <ModalRegistrarEmail
        isOpen={showRegistrar}
        onClose={() => setShowRegistrar(false)}
        onRegistrar={handleRegistrar}
        deudorData={deudorData}
      />

      <ModalEditarEmail
        isOpen={showEditar}
        onClose={() => {
          setShowEditar(false);
          setEmailEditarId(null);
        }}
        emailId={emailEditarId}
        onGuardar={handleGuardarEdicion}
        deudorData={deudorData}
      />
    </>
  );
};

export default EmailDeudorPopup;