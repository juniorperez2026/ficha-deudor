import { useCallback } from 'react';
import type { GestionRealizada } from '../../../shared/types/indexApi';
import type { useGestionesRealizadas } from './useGestionesRealizadas';

type GestionesRealizadasState = ReturnType<typeof useGestionesRealizadas>;

interface UsePanelGestionRealizadaActionsParams {
  setVistaExpandida: React.Dispatch<React.SetStateAction<boolean>>;
  setResumido: GestionesRealizadasState['setResumido'];
}

export const usePanelGestionRealizadaActions = ({
  setVistaExpandida,
  setResumido,
}: UsePanelGestionRealizadaActionsParams) => {
  const handleVerMas = useCallback(() => {
    setVistaExpandida(true);
  }, [setVistaExpandida]);

  const handleVolver = useCallback(() => {
    setVistaExpandida(false);
  }, [setVistaExpandida]);

  const handleEliminar = useCallback(
    (row: GestionRealizada) => {
      if (window.confirm(`¿Eliminar gestión N° ${row.nro}?`)) {
        setResumido((prev) => prev.filter((gestion) => gestion.id !== row.id));
      }
    },
    [setResumido]
  );

  return {
    handleVerMas,
    handleVolver,
    handleEliminar,
  };
};