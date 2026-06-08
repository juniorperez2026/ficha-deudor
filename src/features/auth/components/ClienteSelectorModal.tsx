import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../../../shared/components/modals/Modal';
import { SelectField } from '../../../shared/components/ui';
import { fetchClientesByUsuario } from '../api';
import type { Cliente, Usuario } from '../types';
import { clienteToSelectOptions } from '../types';

interface ClienteSelectorModalProps {
  isOpen: boolean;
  usuario: Usuario;
  onClose: () => void;
  onContinue: (cliente: Cliente) => void;
}

export const ClienteSelectorModal: React.FC<ClienteSelectorModalProps> = ({
  isOpen,
  usuario,
  onClose,
  onContinue,
}) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedClienteId, setSelectedClienteId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !usuario) return;

    setIsLoading(true);
    setError(null);

    fetchClientesByUsuario(usuario.id_usuario)
      .then((response) => {
        if (response.success) {
          setClientes(response.clientes);
          if (response.clientes.length === 1) {
            setSelectedClienteId(response.clientes[0].id_cliente);
          }
        } else {
          setError('No se pudieron cargar los clientes');
        }
      })
      .catch(() => setError('Error al cargar clientes'))
      .finally(() => setIsLoading(false));
  }, [isOpen, usuario]);

  const selectedCliente = clientes.find((c) => c.id_cliente === selectedClienteId);

  const handleContinue = useCallback(() => {
    if (selectedCliente) {
      onContinue(selectedCliente);
    }
  }, [selectedCliente, onContinue]);

  return (
    <Modal
      isOpen={isOpen}
      title="Seleccionar Cliente"
      onClose={onClose}
      size="sm"
      closeOnEsc={false}
    >
      <div className="cliente-selector">
        <div className="cliente-selector__user-info">
          <p>
            <strong>Bienvenido, {usuario?.nombre} {usuario?.apellido}</strong>
          </p>
          <p className="cliente-selector__hint">
            Seleccione el cliente con el que desea trabajar:
          </p>
        </div>

        {isLoading ? (
          <div className="cliente-selector__loading">Cargando clientes...</div>
        ) : error ? (
          <div className="cliente-selector__error">{error}</div>
        ) : (
          <>
            <SelectField
              label="Cliente"
              options={clienteToSelectOptions(clientes)}
              value={selectedClienteId}
              onChange={setSelectedClienteId}
              placeholder="Seleccione un cliente..."
              required
            />

            {selectedCliente && (
              <div className="cliente-selector__detail">
                <span className="cliente-selector__code">{selectedCliente.codigo}</span>
                <span className="cliente-selector__status">
                  {selectedCliente.activa ? '● Activa' : '○ Inactiva'}
                </span>
              </div>
            )}
          </>
        )}

        <div className="cliente-selector__actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            disabled={isLoading}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleContinue}
            disabled={!selectedClienteId || isLoading}
            type="button"
          >
            Continuar
          </button>
        </div>
      </div>
    </Modal>
  );
};