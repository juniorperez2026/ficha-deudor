import type { Column } from '../types';

// =======================
// HELPERS
// =======================
const renderMoney = (val: number) =>
  val?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) ?? '0.00';

const renderAtraso = (dias: number) => (
  <span style={{ color: 'red', fontWeight: 'bold' }}>
    {dias}d
  </span>
);

// =======================
// CONFIG TABLAS
// =======================
export const TABLAS_CONFIG: Record<string, Column[]> = {

  ADEX_INSTITUTO: [
    { key: 'id', label: 'Id' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe_inicial', label: 'Importe Inicial', render: r => renderMoney(r.importe_inicial) },
    { key: 'deuda_vencida', label: 'Deuda Vencida', render: r => renderMoney(r.deuda_vencida) },
    { key: 'atraso_actual', label: 'Atraso Actual', render: r => renderAtraso(r.atraso_actual) },
    { key: 'interes_actual', label: 'Interés Actual', render: r => renderMoney(r.interes_actual) },
    { key: 'total_a_pagar', label: 'Total A Pagar', render: r => renderMoney(r.total_a_pagar) },
    { key: 'rango_actual', label: 'Rango Actual' },
    { key: 'campana_porc_desc', label: 'Campaña % Desc' },
    { key: 'campana_a_pagar', label: 'Campaña A Pagar', render: r => renderMoney(r.campana_a_pagar) },
    { key: 'categoria', label: 'Categoría' },
    { key: 'gestor_call', label: 'Gestor Call' },
    { key: 'nombre_representante', label: 'Nombre Representante' },
    { key: 'cargo_representante', label: 'Cargo Representante' },
    { key: 'fecha_desde', label: 'Fecha desde' }
  ],

  ALFIN_BANCO: [
    { key: 'nro', label: 'NRO' },
    { key: 'cuenta_bt', label: 'Cuenta BT' },
    { key: 'calificacion_cliente', label: 'Calificación Cliente' },
    { key: 'estado', label: 'Estado' },
    { key: 'atraso', label: 'Atraso', render: r => renderAtraso(r.atraso) },
    { key: 'dni', label: 'DNI' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'saldo_total', label: 'Saldo Total', render: r => renderMoney(r.saldo_total) },
    { key: 'capital', label: 'Capital', render: r => renderMoney(r.capital) },
    { key: 'requerido', label: 'Requerido', render: r => renderMoney(r.requerido) },
    { key: 'camp_liqui', label: 'Camp. Liqui', render: r => renderMoney(r.camp_liqui) },
    { key: 'descuento_especial', label: 'Descuento Especial', render: r => renderMoney(r.descuento_especial) },
    { key: 'descuento_especial_detalle', label: 'Descuento Espec. Detalle' },
    { key: 'financiamiento_camp_liq', label: 'Financiamiento / Camp. Liq', render: r => renderMoney(r.financiamiento_camp_liq) },
    { key: 'fecha_surt', label: 'Fecha Surt' },
    { key: 'num_cuota_total', label: 'Núm. Cuota Total' },
    { key: 'num_cuota_pagado', label: 'Núm. Cuota Pagado' },
    { key: 'num_cuota_pend', label: 'Núm. Cuota Pend.' },
    { key: 'num_cuota_sinpago', label: 'Núm. Cuota Sin Pago' }
  ],

  AMERICATEL: [
    { key: 'id', label: 'Id' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe', label: 'Importe', render: r => renderMoney(r.importe) },
    { key: 'deuda_vencida', label: 'Deuda Vencida', render: r => renderMoney(r.deuda_vencida) },
    { key: 'atraso', label: 'Atraso', render: r => renderAtraso(r.atraso) },
    { key: 'comentario', label: 'Comentario' },
    { key: 'gestion', label: 'Gestión' },
    { key: 'gestor_call', label: 'Gestor Call' }
  ],

  AVON: [
    { key: 'id', label: 'Id' },
    { key: 'documento', label: 'Documento' },
    { key: 'importe', label: 'Importe', render: r => renderMoney(r.importe) },
    { key: 'saldo', label: 'Saldo', render: r => renderMoney(r.saldo) },
    { key: 'tramo', label: 'Tramo' },
    { key: 'porc_descuento', label: '% Descuento' },
    { key: 'monto_pagar', label: 'Monto a Pagar', render: r => renderMoney(r.monto_pagar) },
    { key: 'porc_rango1', label: '% Rango 1' },
    { key: 'pago1', label: 'Pago 1', render: r => renderMoney(r.pago1) },
    { key: 'porc_rango2', label: '% Rango 2' },
    { key: 'pago2', label: 'Pago 2', render: r => renderMoney(r.pago2) },
    { key: 'porc_rango3', label: '% Rango 3' },
    { key: 'pago3', label: 'Pago 3', render: r => renderMoney(r.pago3) },
    { key: 'porc_rango4', label: '% Rango 4' },
    { key: 'pago4', label: 'Pago 4', render: r => renderMoney(r.pago4) },
    { key: 'ult_anio_facturacion', label: 'Últ. Año Facturación' },
    { key: 'ult_camp_facturacion', label: 'Últ. Camp. Facturación' },
    { key: 'comentarios', label: 'Comentarios' },
    { key: 'estado', label: 'Estado' },
    { key: 'inicio_fin_zona', label: 'Inicio - Fin (Zona)' }
  ],

  BACKUS_TIENDA: [
    { key: 'id', label: 'Id' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'tipo_gestion', label: 'Tipo Gestión' },
    { key: 'nombre_completo', label: 'Nombre Completo' },
    { key: 'comentario', label: 'Comentario' },
    { key: 'obs2', label: 'OBS 2' },
    { key: 'campana_puntos', label: 'Campaña Puntos' },
    { key: 'lc', label: 'LC' },
    { key: 'stratum', label: 'Stratum' },
    { key: 'nro_usos', label: 'Nro Usos' },
    { key: 'credito_utilizado', label: 'Crédito Utilizado', render: r => renderMoney(r.credito_utilizado) },
    { key: 'pendiente_utilizacion', label: 'Pendiente de Utilización', render: r => renderMoney(r.pendiente_utilizacion) },
    { key: 'canal', label: 'Canal' },
    { key: 'visit_day', label: 'Visit Day' },
    { key: 'visit_week', label: 'Visit Week' },
    { key: 'gestion', label: 'Gestión' },
    { key: 'deuda_por_vencer', label: 'Deuda Por Vencer', render: r => renderMoney(r.deuda_por_vencer) },
    { key: 'deuda_vencida', label: 'Deuda Vencida', render: r => renderMoney(r.deuda_vencida) },
    { key: 'atraso', label: 'Atraso', render: r => renderAtraso(r.atraso) },
    { key: 'gestor_call', label: 'Gestor Call' },
    { key: 'gestor_camp', label: 'Gestor Camp' }
  ],

  BBVA: [
    { key: 'id', label: 'Id' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'id_comercio', label: 'ID Comercio' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'correo', label: 'Correo' },
    { key: 'motivo', label: 'Motivo' },
    { key: 'deuda_vencida', label: 'Deuda Vencida', render: r => renderMoney(r.deuda_vencida) },
    { key: 'moneda', label: 'Moneda' },
    { key: 'atraso', label: 'Atraso', render: r => renderAtraso(r.atraso) }
  ],

  BITEL: [
    { key: 'id', label: 'Id' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe', label: 'Importe', render: r => renderMoney(r.importe) },
    { key: 'deuda_vencida', label: 'Deuda Vencida', render: r => renderMoney(r.deuda_vencida) },
    { key: 'atraso', label: 'Atraso', render: r => renderAtraso(r.atraso) },
    { key: 'comentario', label: 'Comentario' },
    { key: 'gestion', label: 'Gestión' },
    { key: 'gestor_call', label: 'Gestor Call' }
  ],

  BACKUS_CORP: [
    { key: 'id', label: 'Id' },
    { key: 'gestion', label: 'Gestión' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe', label: 'Importe', render: r => renderMoney(r.importe) },
    { key: 'deuda_vencida', label: 'Deuda Vencida', render: r => renderMoney(r.deuda_vencida) },
    { key: 'deuda_vencida_estado', label: 'Deuda Vencida x Estado', render: r => renderMoney(r.deuda_vencida_estado) },
    { key: 'sum_envases', label: 'Sum. Envases', render: r => renderMoney(r.sum_envases) },
    { key: 'sum_liqui_perce', label: 'Sum. Liqui. Perce.', render: r => renderMoney(r.sum_liqui_perce) },
    { key: 'atraso', label: 'Atraso', render: r => renderAtraso(r.atraso) },
    { key: 'comentario', label: 'Comentario' },
    { key: 'nro_ref_original', label: 'Nro. Ref. Original' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'promesas_pago', label: 'Promesas de Pago' },
    { key: 'gestor_call', label: 'Gestor Call' },
    { key: 'gestor_camp', label: 'Gestor Camp' }
  ],

  CAFAE: [
    { key: 'id', label: 'Id' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe', label: 'Importe', render: r => renderMoney(r.importe) },
    { key: 'deuda_vencida', label: 'Deuda Vencida', render: r => renderMoney(r.deuda_vencida) },
    { key: 'interes_moratorio', label: 'Interés Moratorio', render: r => renderMoney(r.interes_moratorio) },
    { key: 'atraso', label: 'Atraso', render: r => renderAtraso(r.atraso) },
    { key: 'comentario', label: 'Comentario' },
    { key: 'gestion', label: 'Gestión' },
    { key: 'gestor_call', label: 'Gestor Call' }
  ],

  CERTUS: [
    { key: 'id', label: 'Id' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe', label: 'Importe', render: r => renderMoney(r.importe) },
    { key: 'mora', label: 'Mora', render: r => renderMoney(r.mora) },
    { key: 'deuda_vencida', label: 'Deuda Vencida', render: r => renderMoney(r.deuda_vencida) },
    { key: 'atraso', label: 'Atraso', render: r => renderAtraso(r.atraso) },
    { key: 'comentario', label: 'Comentario' },
    { key: 'porc_dscto_1', label: '% Dscto. 1' },
    { key: 'monto_final_1', label: 'Monto Final 1', render: r => renderMoney(r.monto_final_1) },
    { key: 'porc_dscto_2', label: '% Dscto. 2' },
    { key: 'monto_final_2', label: 'Monto Final 2', render: r => renderMoney(r.monto_final_2) },
    { key: 'porc_dscto_3', label: '% Dscto. 3' },
    { key: 'monto_final_3', label: 'Monto Final 3', render: r => renderMoney(r.monto_final_3) },
    { key: 'porc_dscto_4', label: '% Dscto. 4' },
    { key: 'monto_final_4', label: 'Monto Final 4', render: r => renderMoney(r.monto_final_4) },
    { key: 'porc_dscto_5', label: '% Dscto. 5' },
    { key: 'monto_final_5', label: 'Monto Final 5', render: r => renderMoney(r.monto_final_5) },
    { key: 'gestor_call', label: 'Gestor Call' }
  ],

  CLARO_CORP: [
    { key: 'id', label: 'Id' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe', label: 'Importe', render: r => renderMoney(r.importe) },
    { key: 'deuda_vencida', label: 'Deuda Vencida', render: r => renderMoney(r.deuda_vencida) },
    { key: 'atraso', label: 'Atraso', render: r => renderAtraso(r.atraso) },
    { key: 'serv', label: 'Serv.' },
    { key: 'comentario', label: 'Comentario' },
    { key: 'codigo_cliente', label: 'Código Cliente' },
    { key: 'estado_documento', label: 'Estado Documento' },
    { key: 'fecha_estado_documento', label: 'Fecha Estado Documento' },
    { key: 'estado_pago', label: 'Estado Pago' },
    { key: 'status_doc', label: 'Status Doc.' },
    { key: 'gestor_call', label: 'Gestor Call' },
    { key: 'bajaprov', label: 'BAJAPROV' }
  ],

  DERRAMA: [
    { key: 'id', label: 'Id' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe', label: 'Importe', render: r => renderMoney(r.importe) },
    { key: 'saldo_contractual', label: 'Saldo Contractual', render: r => renderMoney(r.saldo_contractual) },
    { key: 'monto_valor_cuota', label: 'Monto Valor Cuota', render: r => renderMoney(r.monto_valor_cuota) },
    { key: 'numero_cuotas', label: 'Número Cuotas' },
    { key: 'monto_otorgado', label: 'Monto Otorgado', render: r => renderMoney(r.monto_otorgado) },
    { key: 'fecha_otorgamiento', label: 'Fecha Otorgamiento' },
    { key: 'sbs_cantidad_empresas', label: 'SBS Cantidad Empresas' },
    { key: 'primera_cuota', label: 'Primera Cuota' },
    { key: 'ultima_cuota', label: 'Última Cuota' },
    { key: 'gestion', label: 'Gestión' },
    { key: 'gestor_call', label: 'Gestor Call' }
  ],

  DIRECTV: [
    { key: 'id', label: 'Id' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'cant_ult_6_meses', label: 'Cant. últ. 6 meses' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe', label: 'Importe', render: r => renderMoney(r.importe) },
    { key: 'deuda_vencida', label: 'Deuda Vencida', render: r => renderMoney(r.deuda_vencida) },
    { key: 'porc_desc', label: '% Desc.' },
    { key: 'total_por_doc', label: 'Total por Doc.', render: r => renderMoney(r.total_por_doc) },
    { key: 'fecha_fin_dscto', label: 'Fecha Fin Dscto.' },
    { key: 'fecha_desconexion', label: 'Fecha de Desconexión' },
    { key: 'calificacion', label: 'Calificación' },
    { key: 'numero_entidades', label: 'Número Entidades' }
  ],

  DUPREE: [
    { key: 'id', label: 'Id' },
    { key: 'cod_cliente', label: 'Cód. Cliente' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe_inicial', label: 'Importe Inicial', render: r => renderMoney(r.importe_inicial) },
    { key: 'deuda_vencida', label: 'Deuda Vencida', render: r => renderMoney(r.deuda_vencida) },
    { key: 'atraso_actual', label: 'Atraso Actual', render: r => renderAtraso(r.atraso_actual) },
    { key: 'base_comentario', label: 'Base Comentario' },
    { key: 'marca', label: 'Marca' },
    { key: 'calificacion', label: 'Calificación' },
    { key: 'cant_empresas', label: 'Cant. Empresas' },
    { key: 'edad', label: 'Edad' },
    { key: 'gestor_call', label: 'Gestor Call' }
  ],

  ELEDE: [
    { key: 'nro', label: 'NRO' },
    { key: 'codigo_cliente', label: 'Código Cliente' },
    { key: 'nro_factura', label: 'Nro. Factura' },
    { key: 'estado', label: 'Estado' },
    { key: 'fecha_venc', label: 'Fecha Venc.' },
    { key: 'moneda', label: 'Moneda' },
    { key: 'asig_inicial', label: 'Asig. Inicial', render: r => renderMoney(r.asig_inicial) },
    { key: 'saldo_total', label: 'Saldo Total', render: r => renderMoney(r.saldo_total) },
    { key: 'dias_atraso', label: 'Días Atraso', render: r => renderAtraso(r.dias_atraso) },
    { key: 'marca', label: 'Marca' },
    { key: 'compania', label: 'Compañía' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'f_factura', label: 'F. Factura' }
  ],

  WIENER: [
    { key: 'id', label: 'Id' },
    { key: 'cod_alumno', label: 'Cód. Alumno' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'asignacion', label: 'Asignación', render: r => renderMoney(r.asignacion) },
    { key: 'dias_atraso', label: 'Días Atraso', render: r => renderAtraso(r.dias_atraso) },
    { key: 'cuota', label: 'Cuota', render: r => renderMoney(r.cuota) },
    { key: 'mora', label: 'Mora', render: r => renderMoney(r.mora) },
    { key: 'total_saldo', label: 'Total Saldo', render: r => renderMoney(r.total_saldo) },
    { key: 'marca', label: 'Marca' },
    { key: 'obs_cuota', label: 'Obs. Cuota' },
    { key: 'carrera', label: 'Carrera' },
    { key: 'ciclo', label: 'Ciclo' },
    { key: 'comentario', label: 'Comentario' },
    { key: 'gestion', label: 'Gestión' },
    { key: 'gestor_call', label: 'Gestor Call' },
    { key: 'descuento', label: 'Descuento', render: r => renderMoney(r.descuento) }
  ],

  HEINEKEN: [
    { key: 'id', label: 'Id' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'importe', label: 'Importe', render: r => renderMoney(r.importe) },
    { key: 'saldo', label: 'Saldo', render: r => renderMoney(r.saldo) },
    { key: 'dias_atraso', label: 'Días de Atraso', render: r => renderAtraso(r.dias_atraso) },
    { key: 'antiguedad_deuda', label: 'Antigüedad de Deuda' },
    { key: 'comentario', label: 'Comentario' }
  ],

  MITSUI: [
    { key: 'id', label: 'Id' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'nro_cuota', label: 'Nro. Cuota' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe', label: 'Importe', render: r => renderMoney(r.importe) },
    { key: 'deuda_vencida', label: 'Deuda Vencida', render: r => renderMoney(r.deuda_vencida) },
    { key: 'atraso', label: 'Atraso', render: r => renderAtraso(r.atraso) },
    { key: 'tipo_credito', label: 'Tipo de Crédito' },
    { key: 'cod_acc_prev', label: 'COD ACC PREV' },
    { key: 'cod_acc_preju', label: 'COD ACC PREJU' },
    { key: 'ultimo_tramo', label: 'Último Tramo' },
    { key: 'ultimo_fec_pago', label: 'Último Fec. Pago' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'nro_reprogramaciones', label: 'Nro. Reprogramaciones' },
    { key: 'g_whatsapp', label: 'G. WhatsApp' },
    { key: 'cuota_actual', label: 'Cuota Actual', render: r => renderMoney(r.cuota_actual) },
    { key: 'interes_actual', label: 'Interés Actual', render: r => renderMoney(r.interes_actual) },
    { key: 'placa', label: 'Placa' },
    { key: 'num_cuenta', label: 'Núm. Cuenta' },
    { key: 'marca_especial', label: 'Marca Especial' },
    { key: 'plazo_reprogramado', label: 'Plazo Reprogramado' },
    { key: 'plazo_maximo_reprogramar', label: 'Plazo Máximo a Reprogramar' },
    { key: 'gestor_call', label: 'Gestor Call' },
    { key: 'comentario_reprog', label: 'Comentario Reprogramación' },
    { key: 'tasa_interes', label: 'Tasa Interés' },
    { key: 'capital_actual', label: 'Capital Actual', render: r => renderMoney(r.capital_actual) }
  ],

  NATURA: [
    { key: 'id', label: 'Id' },
    { key: 'documento', label: 'Documento' },
    { key: 'titulo', label: 'Título' },
    { key: 'color', label: 'Color' },
    { key: 'cod_cliente', label: 'Cód. Cliente' },
    { key: 'orden_pedido', label: 'Orden de Pedido' },
    { key: 'ciclo', label: 'Ciclo' },
    { key: 'tramo', label: 'Tramo' },
    { key: 'atraso', label: 'Atraso', render: r => renderAtraso(r.atraso) },
    { key: 'estado', label: 'Estado' },
    { key: 'fec_venc', label: 'Fec. Venc.' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'asignacion', label: 'Asignación', render: r => renderMoney(r.asignacion) },
    { key: 'saldo', label: 'Saldo', render: r => renderMoney(r.saldo) },
    { key: 'saldo_corregido', label: 'Saldo Corregido', render: r => renderMoney(r.saldo_corregido) },
    { key: 'interes_multa_acumulados', label: 'Interés Multa Acumulados', render: r => renderMoney(r.interes_multa_acumulados) },
    { key: 'descuento_saldo_original', label: 'Descuento Saldo Original', render: r => renderMoney(r.descuento_saldo_original) },
    { key: 'monto_descuento_saldo_original', label: 'Monto Descuento Saldo Original', render: r => renderMoney(r.monto_descuento_saldo_original) },
    { key: 'monto_minimo_pagar_campana', label: 'Monto Mínimo Pagar Campaña', render: r => renderMoney(r.monto_minimo_pagar_campana) },
    { key: 'descuento_saldo_original_maximo', label: 'Descuento Saldo Original Máximo', render: r => renderMoney(r.descuento_saldo_original_maximo) },
    { key: 'monto_minimo_pagar_campana_maximo', label: 'Monto Mínimo Pagar Campaña Máximo', render: r => renderMoney(r.monto_minimo_pagar_campana_maximo) },
    { key: 'campana', label: 'Campaña' },
    { key: 'saldo_mmpc', label: 'Saldo M.M.P.C.', render: r => renderMoney(r.saldo_mmpc) },
    { key: 'fecha_vigencia_1', label: 'Fecha Vigencia 1' },
    { key: 'importe_pagar_planton_1', label: 'Importe Pagar Plantón 1', render: r => renderMoney(r.importe_pagar_planton_1) },
    { key: 'camp_pedido_1', label: 'Camp. Pedido 1' },
    { key: 'fecha_vigencia_2', label: 'Fecha Vigencia 2' },
    { key: 'importe_pagar_planton_2', label: 'Importe Pagar Plantón 2', render: r => renderMoney(r.importe_pagar_planton_2) },
    { key: 'camp_pedido_2', label: 'Camp. Pedido 2' },
    { key: 'comentario', label: 'Comentario' },
    { key: 'gestionado', label: 'Gestionado' }
  ],

  NUBYX: [
    { key: 'id', label: 'Id' },
    { key: 'cod_cliente', label: 'Cód. Cliente' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe_inicial', label: 'Importe Inicial', render: r => renderMoney(r.importe_inicial) },
    { key: 'deuda_vencida', label: 'Deuda Vencida', render: r => renderMoney(r.deuda_vencida) },
    { key: 'atraso_actual', label: 'Atraso Actual', render: r => renderAtraso(r.atraso_actual) },
    { key: 'base_comentario', label: 'Base Comentario' },
    { key: 'calificacion', label: 'Calificación' },
    { key: 'camp_des', label: 'Camp. Des.' },
    { key: 'fin_gest', label: 'Fin Gest.' },
    { key: 'gestor_call', label: 'Gestor Call' },
    { key: 'marca', label: 'Marca' }
  ],

  ORIFLAME: [
    { key: 'id', label: 'Id' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe', label: 'Importe', render: r => renderMoney(r.importe) },
    { key: 'saldo_vencido', label: 'Saldo Vencido', render: r => renderMoney(r.saldo_vencido) },
    { key: 'capital_oriflame', label: 'Capital Oriflame', render: r => renderMoney(r.capital_oriflame) },
    { key: 'cap_actual', label: 'Cap. Actual', render: r => renderMoney(r.cap_actual) },
    { key: 'gas_actual', label: 'Gas. Actual', render: r => renderMoney(r.gas_actual) },
    { key: 'comentario', label: 'Comentario' },
    { key: 'camp_oriferia', label: 'Camp. Oriferia' },
    { key: 'dscto_oriferia', label: 'Dscto. Oriferia', render: r => renderMoney(r.dscto_oriferia) },
    { key: 'porc_dscto', label: '% Dscto.' },
    { key: 'dscto_oriferia_2', label: 'Dscto. Oriferia 2', render: r => renderMoney(r.dscto_oriferia_2) },
    { key: 'porc_dscto_2', label: '% Dscto. 2' },
    { key: 'dscto_oriferia_3', label: 'Dscto. Oriferia 3', render: r => renderMoney(r.dscto_oriferia_3) },
    { key: 'porc_dscto_3', label: '% Dscto. 3' },
    { key: 'dscto_oriferia_4', label: 'Dscto. Oriferia 4', render: r => renderMoney(r.dscto_oriferia_4) },
    { key: 'porc_dscto_4', label: '% Dscto. 4' },
    { key: 'atraso', label: 'Atraso', render: r => renderAtraso(r.atraso) },
    { key: 'calificacion', label: 'Calificación' }
  ],

  PUCP: [
    { key: 'id', label: 'Id' },
    { key: 'cartera', label: 'Cartera' },
    { key: 'cod_cliente', label: 'Cód. Cliente' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe_inicial', label: 'Importe Inicial', render: r => renderMoney(r.importe_inicial) },
    { key: 'interes_total', label: 'Interés Total', render: r => renderMoney(r.interes_total) },
    { key: 'deuda_vencida', label: 'Deuda Vencida', render: r => renderMoney(r.deuda_vencida) },
    { key: 'gasto_academico', label: 'Gasto Académico', render: r => renderMoney(r.gasto_academico) },
    { key: 'deuda_vencida_gasto', label: 'Deuda Vencida + Gasto Académico', render: r => renderMoney(r.deuda_vencida_gasto) },
    { key: 'desc_ciclo', label: 'Desc. Ciclo', render: r => renderMoney(r.desc_ciclo) },
    { key: 'moneda_orig', label: 'Moneda Orig.' },
    { key: 'imp_moneda_orig', label: 'Imp. Moneda Orig.', render: r => renderMoney(r.imp_moneda_orig) },
    { key: 'atraso_actual', label: 'Atraso Actual', render: r => renderAtraso(r.atraso_actual) },
    { key: 'calificacion', label: 'Calificación' },
    { key: 'cant_empresas', label: 'Cant. Empresas' },
    { key: 'carrera', label: 'Carrera' },
    { key: 'edad', label: 'Edad' },
    { key: 'gestor_call', label: 'Gestor Call' }
  ],

  PROSEGUR: [
    { key: 'id', label: 'Id' },
    { key: 'cod_pago', label: 'Cód. Pago' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe', label: 'Importe', render: r => renderMoney(r.importe) },
    { key: 'deuda_vencida_soles', label: 'Deuda Vencida Soles', render: r => renderMoney(r.deuda_vencida_soles) },
    { key: 'deuda_vencida_dolares', label: 'Deuda Vencida Dólares', render: r => renderMoney(r.deuda_vencida_dolares) },
    { key: 'porc_desc', label: '% Desc.' },
    { key: 'total_por_doc', label: 'Total por Doc.', render: r => renderMoney(r.total_por_doc) },
    { key: 'total_por_cod_pago', label: 'Total por Cód. Pago', render: r => renderMoney(r.total_por_cod_pago) },
    { key: 'porc_desc_reactivacion', label: '% Desc. con Reactivación' },
    { key: 'total_por_doc_reactivacion', label: 'Total por Doc. con Reactivación', render: r => renderMoney(r.total_por_doc_reactivacion) },
    { key: 'penalidad', label: 'Penalidad', render: r => renderMoney(r.penalidad) },
    { key: 'tramo', label: 'Tramo' },
    { key: 'base', label: 'Base' },
    { key: 'producto', label: 'Producto' },
    { key: 'metodo_pago', label: 'Método Pago' },
    { key: 'numero_entidades', label: 'Número Entidades' },
    { key: 'calificacion', label: 'Calificación' },
    { key: 'razon_social', label: 'Razón Social' },
    { key: 'gestor_call', label: 'Gestor Call' }
  ],

  UNIQUE: [
    { key: 'nro', label: 'Nro' },
    { key: 'codigo_consultora', label: 'Código Consultora' },
    { key: 'nro_obligacion', label: 'Nro. de Obligación' },
    { key: 'estado_documento', label: 'Estado Documento' },
    { key: 'fecha_venc', label: 'Fecha Venc.' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe_inicial', label: 'Importe Inicial', render: r => renderMoney(r.importe_inicial) },
    { key: 'deuda_vencida', label: 'Deuda Vencida', render: r => renderMoney(r.deuda_vencida) },
    { key: 'dias_atraso', label: 'Días Atraso', render: r => renderAtraso(r.dias_atraso) },
    { key: 'campana', label: 'Campaña' },
    { key: 'numero_entidades', label: 'Número Entidades' },
    { key: 'calificacion', label: 'Calificación' },
    { key: 'calificacion_status', label: 'Calificación Status' },
    { key: 'nombre_consultora', label: 'Nombre Consultora' },
    { key: 'codigo_directora', label: 'Código Directora' },
    { key: 'nombre_directora', label: 'Nombre Directora' },
    { key: 'estatus_directora', label: 'Estatus Directora' },
    { key: 'gestor_call_asignado', label: 'Gestor Call Asignado' },
    { key: 'gestor_campo_asignado', label: 'Gestor Campo Asignado' }
  ],

  UCSUR: [
    { key: 'id', label: 'Id' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe', label: 'Importe', render: r => renderMoney(r.importe) },
    { key: 'deuda_vencida', label: 'Deuda Vencida', render: r => renderMoney(r.deuda_vencida) },
    { key: 'atraso', label: 'Atraso', render: r => renderAtraso(r.atraso) },
    { key: 'porc_dscto_1', label: '% Dscto. 1' },
    { key: 'monto_final_1', label: 'Monto Final 1', render: r => renderMoney(r.monto_final_1) },
    { key: 'porc_dscto_2', label: '% Dscto. 2' },
    { key: 'monto_final_2', label: 'Monto Final 2', render: r => renderMoney(r.monto_final_2) },
    { key: 'porc_dscto_3', label: '% Dscto. 3' },
    { key: 'monto_final_3', label: 'Monto Final 3', render: r => renderMoney(r.monto_final_3) },
    { key: 'porc_dscto_4', label: '% Dscto. 4' },
    { key: 'monto_final_4', label: 'Monto Final 4', render: r => renderMoney(r.monto_final_4) },
    { key: 'porc_dscto_5', label: '% Dscto. 5' },
    { key: 'monto_final_5', label: 'Monto Final 5', render: r => renderMoney(r.monto_final_5) },
    { key: 'comentario', label: 'Comentario' },
    { key: 'gestor_call', label: 'Gestor Call' }
  ],

  VERISURE: [
    { key: 'id', label: 'Id' },
    { key: 'documento', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'vencimiento', label: 'Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe', label: 'Importe', render: r => renderMoney(r.importe) },
    { key: 'deuda_vencida', label: 'Deuda Vencida', render: r => renderMoney(r.deuda_vencida) },
    { key: 'subtotal', label: 'Subtotal', render: r => renderMoney(r.subtotal) },
    { key: 'atraso', label: 'Atraso', render: r => renderAtraso(r.atraso) },
    { key: 'contrato', label: 'Contrato' },
    { key: 'porc_dscto_1', label: '% Dscto. 1' },
    { key: 'monto_final_1', label: 'Monto Final 1', render: r => renderMoney(r.monto_final_1) },
    { key: 'porc_dscto_2', label: '% Dscto. 2' },
    { key: 'monto_final_2', label: 'Monto Final 2', render: r => renderMoney(r.monto_final_2) },
    { key: 'porc_dscto_3', label: '% Dscto. 3' },
    { key: 'monto_final_3', label: 'Monto Final 3', render: r => renderMoney(r.monto_final_3) },
    { key: 'porc_dscto_4', label: '% Dscto. 4' },
    { key: 'monto_final_4', label: 'Monto Final 4', render: r => renderMoney(r.monto_final_4) },
    { key: 'gestor_call', label: 'Gestor Call' }
  ],

  VISANET: [
    { key: 'id', label: 'Id' },
    { key: 'codigo_comercio', label: 'Código Comercio' },
    { key: 'nro_documento', label: 'Nro. Documento' },
    { key: 'estado_doc', label: 'Estado Doc.' },
    { key: 'fecha_vencimiento', label: 'Fecha Vencimiento' },
    { key: 'moneda', label: 'Mon.' },
    { key: 'importe', label: 'Importe', render: r => renderMoney(r.importe) },
    { key: 'saldo_soles', label: 'Saldo Soles', render: r => renderMoney(r.saldo_soles) },
    { key: 'total_soles_cc', label: 'Total Soles CC', render: r => renderMoney(r.total_soles_cc) },
    { key: 'saldo_dolares', label: 'Saldo Dólares', render: r => renderMoney(r.saldo_dolares) },
    { key: 'total_dolares_cc', label: 'Total Dólares CC', render: r => renderMoney(r.total_dolares_cc) },
    { key: 'dias_atraso', label: 'Días Atraso', render: r => renderAtraso(r.dias_atraso) },
    { key: 'descripcion_motivo_deuda', label: 'Descripción Motivo Deuda' },
    { key: 'comentario', label: 'Comentario' },
    { key: 'gestion', label: 'Gestión' },
    { key: 'gestor_call', label: 'Gestor Call' }
  ],

  DEFAULT: [
    { key: 'documento', label: 'Documento' },
    { key: 'importe', label: 'Importe' },
    { key: 'atraso', label: 'Atraso' }
  ]
};

// =======================
// CONFIG BOTONES POR CLIENTE
// =======================
export const BOTONES_POR_CLIENTE: Record<string, string[]> = {
  ADEX_INSTITUTO: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'Contratos',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'AVAL',
    'EMAIL'
  ],
  
  ALFIN_BANCO: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'EMAIL'
  ],
  
  AMERICATEL: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'Contratos',
    'MejorGestHist',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'EMAIL'
  ],
  
  AVON: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'EMAIL'
  ],
  
  BACKUS_TIENDA: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'Contratos',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'AVAL',
    'EMAIL'
  ],
  
  BBVA: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'Contratos',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'EMAIL'
  ],
  
  BITEL: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'MejorGestHist',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'EMAIL'
  ],
  
  BACKUS_CORP: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'Contratos',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'AVAL',
    'EMAIL'
  ],
  
  CAFAE: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'EMAIL'
  ],
  
  CERTUS: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'Contratos',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'EMAIL'
  ],
  
  CLARO_CORP: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'Contratos',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'AVAL',
    'EMAIL'
  ],
  
  DERRAMA: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'EMAIL'
  ],
  
  DIRECTV: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'Contratos',
    'MejorGestHist',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'EMAIL'
  ],
  
  DUPREE: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'AVAL',
    'EMAIL'
  ],
  
  ELEDE: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'EMAIL'
  ],
  
  WIENER: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'Contratos',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'EMAIL'
  ],
  
  HEINEKEN: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'AVAL',
    'EMAIL'
  ],
  
  MITSUI: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'Contratos',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'AVAL',
    'EMAIL'
  ],
  
  NATURA: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'MejorGestHist',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'EMAIL'
  ],
  
  NUBYX: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'Contratos',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'AVAL',
    'EMAIL'
  ],
  
  ORIFLAME: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'MejorGestHist',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'EMAIL'
  ],
  
  PUCP: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'Contratos',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'EMAIL'
  ],
  
  PROSEGUR: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'Contratos',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'AVAL',
    'EMAIL'
  ],
  
  UNIQUE: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'EMAIL'
  ],
  
  UCSUR: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'Contratos',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'EMAIL'
  ],
  
  VERISURE: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'Contratos',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'AVAL',
    'EMAIL'
  ],
  
  VISANET: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'MejorGestHist',
    'GESTION DOCUMENTOS',
    'AGENDAS',
    'PAGOS',
    'INF.DEUDOR',
    'AVAL',
    'EMAIL'
  ],
  
  DEFAULT: [
    'ESTADO_CUENTA',
    'DATOS_CLIENTE',
    'CARTAS',
    'ESTADO_DOCUMENTO',
    'PAGOS',
    'EMAIL'
  ]
};

// =======================
// MAPEO ID → ESQUEMA
// =======================
export const CLIENTE_A_ESQUEMA: Record<string, string> = {
  '178': 'ADEX_INSTITUTO',
  '201': 'ALFIN_BANCO',
  '141': 'AMERICATEL',
  '114': 'AVON',
  '188': 'BACKUS_TIENDA',
  '208': 'BBVA',
  '132': 'BITEL',
  '27': 'BACKUS_CORP',
  '143': 'CAFAE',
  '183': 'CERTUS',
  '95': 'CLARO_CORP',
  '200': 'DERRAMA',
  '8': 'DIRECTV',
  '198': 'DUPREE',
  '202': 'ELEDE',
  '138': 'WIENER',
  '216': 'HEINEKEN',
  '59': 'MITSUI',
  '52': 'NATURA',
  '206': 'NUBYX',
  '73': 'ORIFLAME',
  '191': 'PUCP',
  '146': 'PROSEGUR',
  '62': 'UNIQUE',
  '209': 'UCSUR',
  '211': 'VERISURE',
  '94': 'VISANET',

  DEFAULT: 'DEFAULT'
};