import React from 'react';
import type { GestionFormClaro } from '../../hooks/useFichaGestionForm';

interface Props {
  form: GestionFormClaro;
  setField: <K extends keyof GestionFormClaro>(
    field: K,
    value: GestionFormClaro[K]
  ) => void;
  usuarioActual: string;
  handleAgendar: () => void;
}

const FichaGestionAccionesTomar: React.FC<Props> = ({
  form,
  setField,
  usuarioActual,
  handleAgendar,
}) => {
  return (
    <div className="ficha-block ficha-block--with-side-title">
      <div className="block-side-title-wrapper">
        <div className="block-side-title">ACCIONES A TOMAR</div>
      </div>

      <div className="block-content">
        <div className="form-grid g3 form-grid--inline" style={{ marginBottom: '12px' }}>
          <div className="form-row-inline">
            <label className="form-label form-label--inline">Fecha Compromiso:</label>
            <input
              type="date"
              className="form-input form-input--inline-field"
              value={form.fechaCompromisoPago}
              onChange={(e) => setField('fechaCompromisoPago', e.target.value)}
            />
          </div>

          <div className="form-row-inline">
            <label className="form-label form-label--inline">Compromiso S/.:</label>
            <input
              type="number"
              className="form-input form-input--inline-field"
              placeholder="0.00"
              value={form.compromisoSoles}
              onChange={(e) => setField('compromisoSoles', e.target.value)}
            />
          </div>

          <div className="form-row-inline">
            <label className="form-label form-label--inline">Compromiso $US:</label>
            <input
              type="number"
              className="form-input form-input--inline-field"
              placeholder="0.00"
              value={form.compromisoUSD}
              onChange={(e) => setField('compromisoUSD', e.target.value)}
            />
          </div>
        </div>

        <div
          className="agendar-gestion-row agendar-gestion-row--compact agendar-gestion-row--inline"
          style={{ marginBottom: '12px' }}
        >
          <div className="form-row-inline">
            <label className="form-label form-label--inline">Fecha Nueva Gestión:</label>
            <input
              type="date"
              className="form-input form-input--inline-field"
              value={form.fechaNuevaGestion}
              onChange={(e) => setField('fechaNuevaGestion', e.target.value)}
            />
          </div>

          <div className="form-row-inline">
            <label className="form-label form-label--inline">Hora:</label>
            <input
              type="time"
              className="form-input form-input--inline-field"
              value={form.horaNuevaGestion}
              onChange={(e) => setField('horaNuevaGestion', e.target.value)}
            />
          </div>

          <div className="form-row-inline">
            <label className="form-label form-label--inline">Usuario:</label>
            <input
              type="text"
              className="form-input form-input--inline-field"
              value={usuarioActual}
              readOnly
              disabled
            />
          </div>

          <button
            className="btn btn-primary btn-xs agendar-btn"
            type="button"
            onClick={handleAgendar}
          >
            Agendar
          </button>
        </div>

        <div className="fecha-gestion-row fecha-gestion-row--compact fecha-gestion-row--inline">
          <div className="form-row-inline">
            <label className="form-label form-label--inline">Fecha de Gestión:</label>
            <input
              type="date"
              className="form-input form-input--inline-field"
              value={form.fechaGestion}
              onChange={(e) => setField('fechaGestion', e.target.value)}
            />
          </div>

          <div className="form-row-inline">
            <label className="form-label form-label--inline">Hora:</label>
            <input
              type="time"
              className="form-input form-input--inline-field"
              value={form.horaGestion}
              onChange={(e) => setField('horaGestion', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichaGestionAccionesTomar;