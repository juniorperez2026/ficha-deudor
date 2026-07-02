import type { GestionFormClaro } from './useFichaGestionForm';

type SetGestionField = <K extends keyof GestionFormClaro>(
  field: K,
  value: GestionFormClaro[K]
) => void;

interface UseFichaGestionActionsParams {
  form: GestionFormClaro;
  setField: SetGestionField;
  usuarioActual: string;
  onSubmit?: (data: GestionFormClaro) => void;
}

export const useFichaGestionActions = ({
  form,
  setField,
  usuarioActual,
  onSubmit,
}: UseFichaGestionActionsParams) => {
  const handleAgendar = () => {
    if (form.fechaNuevaGestion && form.horaNuevaGestion) {
      const mensaje = `Gestión agendada para: ${form.fechaNuevaGestion} a las ${form.horaNuevaGestion} por ${usuarioActual}`;

      alert(mensaje);
      setField('fechaGestion', form.fechaNuevaGestion);
      setField('horaGestion', form.horaNuevaGestion);
    } else {
      alert('Por favor seleccione fecha y hora para agendar');
    }
  };

  const handleOpenWhatsApp = () => {
    const telefono = form.telefono.replace(/\D/g, '');

    if (!telefono) {
      alert('Por favor ingrese un número de teléfono');
      return;
    }

    const mensaje = encodeURIComponent(
      'Hola, me comunico de [Empresa] respecto a su gestión.'
    );

    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
  };

  const handleGuardar = () => {
    onSubmit?.(form);
  };

  return {
    handleAgendar,
    handleOpenWhatsApp,
    handleGuardar,
  };
};