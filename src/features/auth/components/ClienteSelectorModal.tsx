import React, { useEffect, useCallback, useReducer } from 'react';
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

interface ClienteSelectorState {
  clientes: Cliente[];
  selectedClienteId: string;
  isLoading: boolean;
  error: string | null;
}

type ClienteSelectorAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; clientes: Cliente[] }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'SELECT_CLIENTE'; clienteId: string }
  | { type: 'RESET' };

const initialState: ClienteSelectorState = {
  clientes: [],
  selectedClienteId: '',
  isLoading: false,
  error: null,
};

function clienteSelectorReducer(
  state: ClienteSelectorState,
  action: ClienteSelectorAction
): ClienteSelectorState {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        clientes: [],
        selectedClienteId: '',
        isLoading: true,
        error: null,
      };

    case 'LOAD_SUCCESS':
      return {
        ...state,
        clientes: action.clientes,
        selectedClienteId:
          action.clientes.length === 1 ? action.clientes[0].id_cliente : '',
        isLoading: false,
        error: null,
      };

    case 'LOAD_ERROR':
      return {
        ...state,
        clientes: [],
        selectedClienteId: '',
        isLoading: false,
        error: action.error,
      };

    case 'SELECT_CLIENTE':
      return {
        ...state,
        selectedClienteId: action.clienteId,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export const ClienteSelectorModal: React.FC<ClienteSelectorModalProps> = ({
  isOpen,
  usuario,
  onClose,
  onContinue,
}) => {
  const [state, dispatch] = useReducer(clienteSelectorReducer, initialState);

  const { clientes, selectedClienteId, isLoading, error } = state;

  useEffect(() => {
    if (!isOpen || !usuario) {
      dispatch({ type: 'RESET' });
      return;
    }

    let isMounted = true;

    const loadClientes = async () => {
      dispatch({ type: 'LOAD_START' });

      try {
        const response = await fetchClientesByUsuario(usuario.id_usuario);

        if (!isMounted) return;

        if (response.success) {
          dispatch({
            type: 'LOAD_SUCCESS',
            clientes: response.clientes,
          });
        } else {
          dispatch({
            type: 'LOAD_ERROR',
            error: 'No se pudieron cargar los clientes',
          });
        }
      } catch {
        if (!isMounted) return;

        dispatch({
          type: 'LOAD_ERROR',
          error: 'Error al cargar clientes',
        });
      }
    };

    void loadClientes();

    return () => {
      isMounted = false;
    };
  }, [isOpen, usuario]);

  const selectedCliente = clientes.find(
    (cliente) => cliente.id_cliente === selectedClienteId
  );

  const handleContinue = useCallback(() => {
    if (selectedCliente) {
      onContinue(selectedCliente);
    }
  }, [selectedCliente, onContinue]);

  const handleSelectCliente = useCallback((clienteId: string) => {
    dispatch({
      type: 'SELECT_CLIENTE',
      clienteId,
    });
  }, []);

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
            <strong>
              Bienvenido, {usuario?.nombre} {usuario?.apellido}
            </strong>
          </p>

          <p className="cliente-selector__hint">
            Seleccione el cliente con el que desea trabajar:
          </p>
        </div>

        {isLoading ? (
          <div className="cliente-selector__loading">
            Cargando clientes...
          </div>
        ) : error ? (
          <div className="cliente-selector__error">{error}</div>
        ) : (
          <>
            <SelectField
              label="Cliente"
              options={clienteToSelectOptions(clientes)}
              value={selectedClienteId}
              onChange={handleSelectCliente}
              placeholder="Seleccione un cliente..."
              required
            />

            {selectedCliente && (
              <div className="cliente-selector__detail">
                <span className="cliente-selector__code">
                  {selectedCliente.codigo}
                </span>

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