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

const HOURS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, '0')
);

const MINUTES = Array.from({ length: 12 }, (_, index) =>
  String(index * 5).padStart(2, '0')
);

const sanitizeDecimalValue = (value: string) => {
  const cleanedValue = value.replace(/[^0-9.]/g, '');
  const [integerPart, ...decimalParts] = cleanedValue.split('.');

  if (decimalParts.length === 0) {
    return integerPart;
  }

  return `${integerPart}.${decimalParts.join('')}`;
};

const getTimeHour = (time: string) => {
  return time?.split(':')[0] ?? '';
};

const getTimeMinute = (time: string) => {
  return time?.split(':')[1] ?? '';
};

const buildTimeValue = (
  currentTime: string,
  type: 'hour' | 'minute',
  value: string
) => {
  const currentHour = getTimeHour(currentTime) || '00';
  const currentMinute = getTimeMinute(currentTime) || '00';

  if (type === 'hour') {
    return `${value}:${currentMinute}`;
  }

  return `${currentHour}:${value}`;
};

const hasValidDate = (date: string) => {
  return Boolean(date && date.trim());
};

const FichaGestionAccionesTomar: React.FC<Props> = ({
  form,
  setField,
  usuarioActual,
  handleAgendar,
}) => {
  const puedeIngresarCompromiso = hasValidDate(form.fechaCompromisoPago);
  const puedeSeleccionarHoraNuevaGestion = hasValidDate(form.fechaNuevaGestion);
  const puedeSeleccionarHoraGestion = hasValidDate(form.fechaGestion);

  const handleFechaCompromisoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    setField('fechaCompromisoPago', value);

    if (!value) {
      setField('compromisoSoles', '');
      setField('compromisoUSD', '');
    }
  };

  const handleFechaNuevaGestionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    setField('fechaNuevaGestion', value);

    if (!value) {
      setField('horaNuevaGestion', '');
    }
  };

  const handleFechaGestionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    setField('fechaGestion', value);

    if (!value) {
      setField('horaGestion', '');
    }
  };

  return (
    <div className="ficha-block ficha-block--with-side-title ficha-block--compact-gestion ficha-block--acciones-tomar">
      <div className="block-side-title-wrapper">
        <div className="block-side-title">ACCIONES A TOMAR</div>
      </div>

      <div className="block-content block-content--compact-gestion">
        <div
          className="form-grid g3 form-grid--inline"
          style={{ marginBottom: '6px' }}
        >
          <div className="form-row-inline">
            <label className="form-label form-label--inline">
              Fecha Compromiso:
            </label>

            <input
              type="date"
              className="form-input form-input--inline-field"
              value={form.fechaCompromisoPago}
              onChange={handleFechaCompromisoChange}
            />
          </div>

          <div className="form-row-inline">
            <label className="form-label form-label--inline">
              Compromiso S/.:
            </label>

            <input
              type="text"
              inputMode="decimal"
              className="form-input form-input--inline-field"
              placeholder="0.00"
              value={form.compromisoSoles}
              disabled={!puedeIngresarCompromiso}
              onChange={(event) =>
                setField(
                  'compromisoSoles',
                  sanitizeDecimalValue(event.target.value)
                )
              }
            />
          </div>

          <div className="form-row-inline">
            <label className="form-label form-label--inline">
              Compromiso $US:
            </label>

            <input
              type="text"
              inputMode="decimal"
              className="form-input form-input--inline-field"
              placeholder="0.00"
              value={form.compromisoUSD}
              disabled={!puedeIngresarCompromiso}
              onChange={(event) =>
                setField(
                  'compromisoUSD',
                  sanitizeDecimalValue(event.target.value)
                )
              }
            />
          </div>
        </div>

        <div
          className="agendar-gestion-row agendar-gestion-row--compact agendar-gestion-row--inline"
          style={{ marginBottom: '6px' }}
        >
          <div className="form-row-inline">
            <label className="form-label form-label--inline">
              Fecha Nueva Gestión:
            </label>

            <input
              type="date"
              className="form-input form-input--inline-field"
              value={form.fechaNuevaGestion}
              onChange={handleFechaNuevaGestionChange}
            />
          </div>

          <div className="form-row-inline form-row-inline--time">
            <label className="form-label form-label--inline">Hora:</label>

            <select
              className="form-input form-input--inline-field"
              value={getTimeHour(form.horaNuevaGestion)}
              disabled={!puedeSeleccionarHoraNuevaGestion}
              onChange={(event) =>
                setField(
                  'horaNuevaGestion',
                  buildTimeValue(
                    form.horaNuevaGestion,
                    'hour',
                    event.target.value
                  )
                )
              }
            >
              <option value="">HH</option>
              {HOURS.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>

            <select
              className="form-input form-input--inline-field"
              value={getTimeMinute(form.horaNuevaGestion)}
              disabled={!puedeSeleccionarHoraNuevaGestion}
              onChange={(event) =>
                setField(
                  'horaNuevaGestion',
                  buildTimeValue(
                    form.horaNuevaGestion,
                    'minute',
                    event.target.value
                  )
                )
              }
            >
              <option value="">MM</option>
              {MINUTES.map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </select>
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
            <label className="form-label form-label--inline">
              Fecha de Gestión:
            </label>

            <input
              type="date"
              className="form-input form-input--inline-field"
              value={form.fechaGestion}
              onChange={handleFechaGestionChange}
            />
          </div>

          <div className="form-row-inline form-row-inline--time">
            <label className="form-label form-label--inline">Hora:</label>

            <select
              className="form-input form-input--inline-field"
              value={getTimeHour(form.horaGestion)}
              disabled={!puedeSeleccionarHoraGestion}
              onChange={(event) =>
                setField(
                  'horaGestion',
                  buildTimeValue(form.horaGestion, 'hour', event.target.value)
                )
              }
            >
              <option value="">HH</option>
              {HOURS.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>

            <select
              className="form-input form-input--inline-field"
              value={getTimeMinute(form.horaGestion)}
              disabled={!puedeSeleccionarHoraGestion}
              onChange={(event) =>
                setField(
                  'horaGestion',
                  buildTimeValue(form.horaGestion, 'minute', event.target.value)
                )
              }
            >
              <option value="">MM</option>
              {MINUTES.map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichaGestionAccionesTomar;