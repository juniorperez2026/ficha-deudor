import { useState } from 'react';
import type { GestionForm } from '../../../shared/types/indexApi';

export type GestionFormClaro = GestionForm & {
  estadoGestionClaro: string;
  motivoNoPago: string;
};

const initialForm: GestionFormClaro = {
  nombreContacto: '',
  cargo: '',
  np0: '',
  np1: '',
  np2: '',
  estadoGestion: '',
  telefono: '',
  tipoGestion: '',
  gestorId: '',
  gestorNombre: '',
  fechaCompromisoPago: '',
  compromisoSoles: '',
  compromisoUSD: '',
  fechaNuevaGestion: '',
  horaNuevaGestion: '',
  fechaGestion: '',
  horaGestion: '',
  gestionTerminada: false,
  observaciones: '',
  estadoGestionClaro: '',
  motivoNoPago: '',
};

export const useFichaGestionForm = () => {
  const [form, setForm] = useState<GestionFormClaro>(initialForm);

  const setField = <K extends keyof GestionFormClaro>(
    field: K,
    value: GestionFormClaro[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNP0Change = (value: string) => {
    setField('np0', value);
    setField('np1', '');
    setField('np2', '');
  };

  const handleNP1Change = (value: string) => {
    setField('np1', value);
    setField('np2', '');
  };

  const resetForm = () => {
    setForm(initialForm);
  };

  return {
    form,
    setField,
    handleNP0Change,
    handleNP1Change,
    resetForm,
  };
};