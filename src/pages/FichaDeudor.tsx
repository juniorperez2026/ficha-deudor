import React, { useState } from 'react';
import DeudorHeader from '../components/ficha/DeudorHeader';
import AccionesRapidas from '../components/ficha/AccionesRapidas';
import DocumentosTable from '../components/ficha/DocumentosTable';
import FichaGestion from '../components/ficha/FichaGestion';
import PanelDatosAdicionales from '../components/paneles/PanelDatosAdicionales';
import PanelTelefonosReferenciados from '../components/paneles/PanelTelefonosReferenciados';
import PanelDireccionesReferenciadas from '../components/paneles/PanelDireccionesReferenciadas';
import PanelEstadoGestionRealizada from '../components/paneles/PanelEstadoGestionRealizada';
import PanelGestionRealizada from '../components/paneles/PanelGestionRealizada';
import { mockDeudor, mockDataPorCliente } from '../data/mockData';
import type { GestionForm } from '../types';
import '../styles/main.css';
import '../styles/styles.css';

const FichaDeudor: React.FC = () => {
  const [contacto, setContacto] = useState('');
  const [panelActivo, setPanelActivo] = useState<string | null>(null); // ← NUEVO
  
  const id_cliente_actual = "178";
  const datosParaTabla = mockDataPorCliente[id_cliente_actual] || [];
  
  const handleGestionSubmit = (data: GestionForm) => {
    console.log('JSON listo para enviar al backend (SQL/API):', data);
    alert('Gestión guardada. Revisa la consola.');
  };

  // ← NUEVO: Toggle de panel (si ya está activo, lo cierra)
  const handleTogglePanel = (accion: string) => {
    setPanelActivo((actual) => (actual === accion ? null : accion));
  };

  return (
    <div>
      <header className="app-header">
        <div className="app-logo">
          <span className="logo-text">AVAL</span>
          <span className="logo-sub">PERÚ</span>
        </div>
        <nav className="app-nav">
          <span className="nav-item">GESTIÓN DE COBRANZAS</span>
          <span className="nav-sep">›</span>
          <span className="nav-item nav-item--active">FICHA DEUDOR</span>
        </nav>
        <div className="app-user">
          <span className="user-name">Gestor: CARLOS R.</span>
          <span className="user-dot" />
        </div>
      </header>

      <main className="ficha-main ficha-main--two-columns">
        {/* Sidebar izquierdo */}
        <aside className="ficha-sidebar">
          <DeudorHeader 
            data={mockDeudor} 
            contacto={contacto} 
            onContactoChange={setContacto}
            compact={true}
          />
          <AccionesRapidas 
            panelActivo={panelActivo} 
            onTogglePanel={handleTogglePanel} 
          />
        </aside>
        
        {/* Contenido principal */}
        <div className="ficha-content">
          <DocumentosTable 
            id_cliente={id_cliente_actual} 
            documentos={datosParaTabla} 
          />
          {/* ← NUEVO: Panel colapsable debajo de DocumentosTable */}
          <PanelDatosAdicionales isActive={panelActivo === 'DATOS ADICIONALES'} />
          <PanelTelefonosReferenciados isActive={panelActivo === 'TELÉFONOS REFERENCIADOS'} />
          <PanelDireccionesReferenciadas isActive={panelActivo === 'DIRECCIONES REFERENCIADAS'} />
          <PanelGestionRealizada isActive={panelActivo === 'GESTIÓN REALIZADA'} />
          <PanelEstadoGestionRealizada isActive={panelActivo === 'ESTADO DE GESTIÓN REALIZADA'} />
          <FichaGestion onSubmit={handleGestionSubmit} />
        </div>
      </main>
    </div>
  );
};

export default FichaDeudor;