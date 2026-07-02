import React from 'react';
import {
  useFichaGestionForm,
  type GestionFormClaro,
} from '../../hooks/useFichaGestionForm';
import { useFichaGestionCatalogos } from '../../hooks/useFichaGestionCatalogos';
import { useFichaGestionActions } from '../../hooks/useFichaGestionActions';
import FichaGestionDatosPrincipales from '../ficha-gestion/FichaGestionDatosPrincipales';
import FichaGestionAccionesTomar from '../ficha-gestion/FichaGestionAccionesTomar';
import FichaGestionResultadosLlamada from '../ficha-gestion/FichaGestionResultadosLlamada';

interface Props {
  idCliente: string;
  idCartera: string;
  idContrato: string;
  onSubmit?: (data: GestionFormClaro) => void;
}

const ID_CLIENTE_CLARO = '95';
const USUARIO_ACTUAL = 'CARLOS R. (Gestor)';

const FichaGestion: React.FC<Props> = ({
  idCliente,
  idCartera,
  idContrato,
  onSubmit,
}) => {
  const {
    form,
    setField,
    handleNP0Change,
    handleNP1Change,
    resetForm,
  } = useFichaGestionForm();

  const {
    estadosOptions,
    isLoadingEstados,
    errorEstados,

    tiposOptions,
    isLoadingTipos,
    errorTipos,

    np0Options,
    isLoadingNP0,
    errorNP0,

    np1Options,
    isLoadingNP1,
    errorNP1,

    np2Options,
    isLoadingNP2,
    errorNP2,

    estadoGestionClaroOptions,
    isLoadingEstadoGestionClaro,
    errorEstadoGestionClaro,

    motivoNoPagoOptions,
    isLoadingMotivoNoPago,
    errorMotivoNoPago,
  } = useFichaGestionCatalogos(
    idCliente,
    idCartera,
    idContrato,
    form.np0,
    form.np1
  );

  const mostrarCamposClaro = String(idCliente) === ID_CLIENTE_CLARO;

  const {
    handleAgendar,
    handleOpenWhatsApp,
    handleGuardar,
  } = useFichaGestionActions({
    form,
    setField,
    usuarioActual: USUARIO_ACTUAL,
    onSubmit,
  });

  return (
    <div className="ficha-card">
      <div className="ficha-gestion-header">
        <span className="fg-title">FICHA DE GESTIÓN</span>
      </div>

      <FichaGestionDatosPrincipales
        form={form}
        setField={setField}
        handleNP0Change={handleNP0Change}
        handleNP1Change={handleNP1Change}
        handleOpenWhatsApp={handleOpenWhatsApp}
        estadosOptions={estadosOptions}
        isLoadingEstados={isLoadingEstados}
        errorEstados={errorEstados}
        tiposOptions={tiposOptions}
        isLoadingTipos={isLoadingTipos}
        errorTipos={errorTipos}
        np0Options={np0Options}
        isLoadingNP0={isLoadingNP0}
        errorNP0={errorNP0}
        np1Options={np1Options}
        isLoadingNP1={isLoadingNP1}
        errorNP1={errorNP1}
        np2Options={np2Options}
        isLoadingNP2={isLoadingNP2}
        errorNP2={errorNP2}
      />

      <FichaGestionAccionesTomar
        form={form}
        setField={setField}
        usuarioActual={USUARIO_ACTUAL}
        handleAgendar={handleAgendar}
      />

      <FichaGestionResultadosLlamada
        form={form}
        setField={setField}
        mostrarCamposClaro={mostrarCamposClaro}
        estadoGestionClaroOptions={estadoGestionClaroOptions}
        isLoadingEstadoGestionClaro={isLoadingEstadoGestionClaro}
        errorEstadoGestionClaro={errorEstadoGestionClaro}
        motivoNoPagoOptions={motivoNoPagoOptions}
        isLoadingMotivoNoPago={isLoadingMotivoNoPago}
        errorMotivoNoPago={errorMotivoNoPago}
        resetForm={resetForm}
        handleGuardar={handleGuardar}
      />
    </div>
  );
};

export default FichaGestion;