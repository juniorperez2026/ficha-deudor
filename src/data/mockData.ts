import type { DeudorInfo, Documento, SelectOption } from '../types';

export const mockDeudor: DeudorInfo = {
  zona: 'LIMA NORTE',
  cartera: 'CARTERA ACTIVA 2024',
  campana: 'CAMPAÑA Q1-2025',
  nombreRazonSocial: 'JUAN CARLOS QUISPE MAMANI',
  dniRuc: '47823610',
  gradoInstruccion: 'SECUNDARIA COMPLETA',
  edad: 38,
  contacto: 'juan54quispegmail.com',
  asesorAsignado: 'PEDRO SARMIENTO TORVALINO',
  asesorPostVenta: 'CARLOS MENDOZA RIOS',
  asesorComercial: 'ANA FLORES TORRES',
  correoApv: 'cmendoza@avalperu.com',
  correoAc: 'aflores@avalperu.com',
};

export const mockDataPorCliente: Record<string, Documento[]> = {
  // ADEX_INSTITUTO (ID: 178)
  '178': [
    {
      id: 'ADX-001',
      documento: 'PENSION ABRIL',
      estado: 'MORA',
      vencimiento: '2026-04-10',
      moneda: 'PEN',
      importe_inicial: 1200.00,
      deuda_vencida: 1200.00,
      atraso_actual: 12,
      interes_actual: 15.50,
      total_a_pagar: 1215.50,
      rango_actual: 'RANGO 3',
      campana_porc_desc: '15%',
      campana_a_pagar: 1033.18,
      categoria: 'PREGRADO',
      gestor_call: 'RAMOS M.',
      nombre_representante: 'JUAN PEREZ',
      cargo_representante: 'APODERADO',
      fecha_desde: '2024-01-15'
    },
    {
      id: 'ADX-002',
      documento: 'PENSION MARZO',
      estado: 'VENCIDO',
      vencimiento: '2026-03-10',
      moneda: 'PEN',
      importe_inicial: 1200.00,
      deuda_vencida: 1200.00,
      atraso_actual: 43,
      interes_actual: 45.80,
      total_a_pagar: 1245.80,
      rango_actual: 'RANGO 4',
      campana_porc_desc: '10%',
      campana_a_pagar: 1121.22,
      categoria: 'PREGRADO',
      gestor_call: 'RAMOS M.',
      nombre_representante: 'JUAN PEREZ',
      cargo_representante: 'APODERADO',
      fecha_desde: '2024-01-15'
    },
    {
      id: 'ADX-001',
      documento: 'PENSION ABRIL',
      estado: 'MORA',
      vencimiento: '2026-04-10',
      moneda: 'PEN',
      importe_inicial: 1200.00,
      deuda_vencida: 1200.00,
      atraso_actual: 12,
      interes_actual: 15.50,
      total_a_pagar: 1215.50,
      rango_actual: 'RANGO 3',
      campana_porc_desc: '15%',
      campana_a_pagar: 1033.18,
      categoria: 'PREGRADO',
      gestor_call: 'RAMOS M.',
      nombre_representante: 'JUAN PEREZ',
      cargo_representante: 'APODERADO',
      fecha_desde: '2024-01-15'
    },
    {
      id: 'ADX-002',
      documento: 'PENSION MARZO',
      estado: 'VENCIDO',
      vencimiento: '2026-03-10',
      moneda: 'PEN',
      importe_inicial: 1200.00,
      deuda_vencida: 1200.00,
      atraso_actual: 43,
      interes_actual: 45.80,
      total_a_pagar: 1245.80,
      rango_actual: 'RANGO 4',
      campana_porc_desc: '10%',
      campana_a_pagar: 1121.22,
      categoria: 'PREGRADO',
      gestor_call: 'RAMOS M.',
      nombre_representante: 'JUAN PEREZ',
      cargo_representante: 'APODERADO',
      fecha_desde: '2024-01-15'
    },
    {
      id: 'ADX-001',
      documento: 'PENSION ABRIL',
      estado: 'MORA',
      vencimiento: '2026-04-10',
      moneda: 'PEN',
      importe_inicial: 1200.00,
      deuda_vencida: 1200.00,
      atraso_actual: 12,
      interes_actual: 15.50,
      total_a_pagar: 1215.50,
      rango_actual: 'RANGO 3',
      campana_porc_desc: '15%',
      campana_a_pagar: 1033.18,
      categoria: 'PREGRADO',
      gestor_call: 'RAMOS M.',
      nombre_representante: 'JUAN PEREZ',
      cargo_representante: 'APODERADO',
      fecha_desde: '2024-01-15'
    },
    {
      id: 'ADX-002',
      documento: 'PENSION MARZO',
      estado: 'VENCIDO',
      vencimiento: '2026-03-10',
      moneda: 'PEN',
      importe_inicial: 1200.00,
      deuda_vencida: 1200.00,
      atraso_actual: 43,
      interes_actual: 45.80,
      total_a_pagar: 1245.80,
      rango_actual: 'RANGO 4',
      campana_porc_desc: '10%',
      campana_a_pagar: 1121.22,
      categoria: 'PREGRADO',
      gestor_call: 'RAMOS M.',
      nombre_representante: 'JUAN PEREZ',
      cargo_representante: 'APODERADO',
      fecha_desde: '2024-01-15'
    },
    {
      id: 'ADX-001',
      documento: 'PENSION ABRIL',
      estado: 'MORA',
      vencimiento: '2026-04-10',
      moneda: 'PEN',
      importe_inicial: 1200.00,
      deuda_vencida: 1200.00,
      atraso_actual: 12,
      interes_actual: 15.50,
      total_a_pagar: 1215.50,
      rango_actual: 'RANGO 3',
      campana_porc_desc: '15%',
      campana_a_pagar: 1033.18,
      categoria: 'PREGRADO',
      gestor_call: 'RAMOS M.',
      nombre_representante: 'JUAN PEREZ',
      cargo_representante: 'APODERADO',
      fecha_desde: '2024-01-15'
    },
    {
      id: 'ADX-002',
      documento: 'PENSION MARZO',
      estado: 'VENCIDO',
      vencimiento: '2026-03-10',
      moneda: 'PEN',
      importe_inicial: 1200.00,
      deuda_vencida: 1200.00,
      atraso_actual: 43,
      interes_actual: 45.80,
      total_a_pagar: 1245.80,
      rango_actual: 'RANGO 4',
      campana_porc_desc: '10%',
      campana_a_pagar: 1121.22,
      categoria: 'PREGRADO',
      gestor_call: 'RAMOS M.',
      nombre_representante: 'JUAN PEREZ',
      cargo_representante: 'APODERADO',
      fecha_desde: '2024-01-15'
    },
    {
      id: 'ADX-001',
      documento: 'PENSION ABRIL',
      estado: 'MORA',
      vencimiento: '2026-04-10',
      moneda: 'PEN',
      importe_inicial: 1200.00,
      deuda_vencida: 1200.00,
      atraso_actual: 12,
      interes_actual: 15.50,
      total_a_pagar: 1215.50,
      rango_actual: 'RANGO 3',
      campana_porc_desc: '15%',
      campana_a_pagar: 1033.18,
      categoria: 'PREGRADO',
      gestor_call: 'RAMOS M.',
      nombre_representante: 'JUAN PEREZ',
      cargo_representante: 'APODERADO',
      fecha_desde: '2024-01-15'
    },
    {
      id: 'ADX-002',
      documento: 'PENSION MARZO',
      estado: 'VENCIDO',
      vencimiento: '2026-03-10',
      moneda: 'PEN',
      importe_inicial: 1200.00,
      deuda_vencida: 1200.00,
      atraso_actual: 43,
      interes_actual: 45.80,
      total_a_pagar: 1245.80,
      rango_actual: 'RANGO 4',
      campana_porc_desc: '10%',
      campana_a_pagar: 1121.22,
      categoria: 'PREGRADO',
      gestor_call: 'RAMOS M.',
      nombre_representante: 'JUAN PEREZ',
      cargo_representante: 'APODERADO',
      fecha_desde: '2024-01-15'
    }    
  ],

  // ALFIN_BANCO (ID: 201)
  '201': [
    {
      nro: '1',
      cuenta_bt: 'BT-992831',
      calificacion_cliente: 'CPP',
      estado: 'VENCIDO',
      atraso: 45,
      dni: '45882233',
      moneda: 'PEN',
      saldo_total: 4500.80,
      capital: 4000.00,
      requerido: 500.80,
      camp_liqui: 4200.00,
      descuento_especial: 300.80,
      descuento_especial_detalle: 'DSCTO POR CAMPAÑA',
      financiamiento_camp_liq: 3900.00,
      fecha_surt: '2025-11-20',
      num_cuota_total: 24,
      num_cuota_pagado: 18,
      num_cuota_pend: 6,
      num_cuota_sinpago: 3
    },
    {
      nro: '2',
      cuenta_bt: 'BT-992832',
      calificacion_cliente: 'NORMAL',
      estado: 'AL DIA',
      atraso: 0,
      dni: '71233456',
      moneda: 'USD',
      saldo_total: 2500.00,
      capital: 2300.00,
      requerido: 200.00,
      camp_liqui: 2400.00,
      descuento_especial: 100.00,
      descuento_especial_detalle: 'DSCTO POR PRONTO PAGO',
      financiamiento_camp_liq: 2300.00,
      fecha_surt: '2025-12-05',
      num_cuota_total: 12,
      num_cuota_pagado: 12,
      num_cuota_pend: 0,
      num_cuota_sinpago: 0
    }
  ],

  // AMERICATEL (ID: 141)
  '141': [
    {
      id: 'AM-772',
      documento: 'RECIBO INTERNET',
      estado: 'PENDIENTE',
      vencimiento: '2026-03-15',
      moneda: 'PEN',
      importe: 150.00,
      deuda_vencida: 150.00,
      atraso: 5,
      comentario: 'CLIENTE ESPERA PAGO',
      gestion: 'LLAMADA REALIZADA',
      gestor_call: 'LOPEZ K.'
    },
    {
      id: 'AM-773',
      documento: 'RECIBO TELEFONIA',
      estado: 'MORA',
      vencimiento: '2026-02-10',
      moneda: 'PEN',
      importe: 89.90,
      deuda_vencida: 89.90,
      atraso: 38,
      comentario: 'COMPROMISO DE PAGO 20/04',
      gestion: 'PROMESA DE PAGO',
      gestor_call: 'LOPEZ K.'
    }
  ],

  // AVON (ID: 114)
  '114': [
    {
      id: 'AV-0921',
      documento: 'FACTURA C-12',
      importe: 450.00,
      saldo: 200.00,
      tramo: 'TRAMO 2',
      porc_descuento: '15%',
      monto_pagar: 170.00,
      porc_rango1: '10%',
      pago1: 180.00,
      porc_rango2: '20%',
      pago2: 160.00,
      porc_rango3: '30%',
      pago3: 140.00,
      porc_rango4: '40%',
      pago4: 120.00,
      ult_anio_facturacion: '2025',
      ult_camp_facturacion: 'C-12',
      comentarios: 'CONSULTORA ACTIVA',
      estado: 'ACTIVO',
      inicio_fin_zona: 'ZONA NORTE'
    },
    {
      id: 'AV-0922',
      documento: 'FACTURA C-11',
      importe: 380.00,
      saldo: 380.00,
      tramo: 'TRAMO 1',
      porc_descuento: '20%',
      monto_pagar: 304.00,
      porc_rango1: '15%',
      pago1: 323.00,
      porc_rango2: '25%',
      pago2: 285.00,
      porc_rango3: '35%',
      pago3: 247.00,
      porc_rango4: '45%',
      pago4: 209.00,
      ult_anio_facturacion: '2025',
      ult_camp_facturacion: 'C-11',
      comentarios: 'PENDIENTE CONTACTO',
      estado: 'MORA',
      inicio_fin_zona: 'ZONA SUR'
    }
  ],

  // BACKUS_TIENDA (ID: 188)
  '188': [
    {
      id: 'BK-552',
      documento: 'PEDIDO_CERVEZA',
      estado: 'RECHAZADO',
      tipo_gestion: 'TELEFONICA',
      nombre_completo: 'TIENDA DOÑA ROSA',
      comentario: 'CLIENTE MOLESTO POR COBRO',
      obs2: 'REVISAR FACTURA',
      campana_puntos: '1500 pts',
      lc: 'LC-001',
      stratum: 'A',
      nro_usos: 5,
      credito_utilizado: 5000.00,
      pendiente_utilizacion: 1000.00,
      canal: 'MAYORISTA',
      visit_day: 'LUNES',
      visit_week: 'SEMANA 3',
      gestion: 'PENDIENTE',
      deuda_por_vencer: 0.00,
      deuda_vencida: 890.50,
      atraso: 20,
      gestor_call: 'CASTRO R.',
      gestor_camp: 'VARGAS M.'
    },
    {
      id: 'BK-553',
      documento: 'PEDIDO_GASEOSAS',
      estado: 'PENDIENTE',
      tipo_gestion: 'PRESENCIAL',
      nombre_completo: 'TIENDA DOÑA ROSA',
      comentario: 'ESPERA PAGO PROVEEDOR',
      obs2: '',
      campana_puntos: '800 pts',
      lc: 'LC-001',
      stratum: 'A',
      nro_usos: 3,
      credito_utilizado: 3000.00,
      pendiente_utilizacion: 500.00,
      canal: 'MAYORISTA',
      visit_day: 'MIERCOLES',
      visit_week: 'SEMANA 4',
      gestion: 'SEGUIMIENTO',
      deuda_por_vencer: 350.00,
      deuda_vencida: 0.00,
      atraso: 0,
      gestor_call: 'CASTRO R.',
      gestor_camp: 'VARGAS M.'
    }
  ],

  // BBVA (ID: 208)
  '208': [
    {
      id: 'BBVA-001',
      documento: 'FACT-2026-001',
      estado: 'VENCIDO',
      id_comercio: 'COM-45678',
      vencimiento: '2026-02-28',
      correo: 'comercio@email.com',
      motivo: 'FALTA DE PAGO',
      deuda_vencida: 3500.00,
      moneda: 'PEN',
      atraso: 52
    },
    {
      id: 'BBVA-002',
      documento: 'FACT-2026-045',
      estado: 'POR VENCER',
      id_comercio: 'COM-45678',
      vencimiento: '2026-04-30',
      correo: 'comercio@email.com',
      motivo: 'RECHAZO TARJETA',
      deuda_vencida: 1200.00,
      moneda: 'USD',
      atraso: 0
    }
  ],

  // BITEL (ID: 132)
  '132': [
    {
      id: 'BIT-001',
      documento: 'LINEA 987654321',
      estado: 'SUSPENDIDO',
      vencimiento: '2026-03-20',
      moneda: 'PEN',
      importe: 89.90,
      deuda_vencida: 89.90,
      atraso: 31,
      comentario: 'CLIENTE SOLICITA BAJA',
      gestion: 'RETENCION',
      gestor_call: 'MENDOZA A.'
    }
  ],

  // BACKUS_CORP (ID: 27)
  '27': [
    {
      id: 'BC-001',
      gestion: 'COBRANZA',
      documento: 'FACT-001234',
      estado: 'VENCIDO',
      vencimiento: '2026-01-15',
      moneda: 'PEN',
      importe: 15000.00,
      deuda_vencida: 15000.00,
      deuda_vencida_estado: 12000.00,
      sum_envases: 500.00,
      sum_liqui_perce: 300.00,
      atraso: 95,
      comentario: 'CORPORATIVO GRANDE',
      nro_ref_original: 'OC-789',
      tipo: 'CREDITO',
      promesas_pago: 'PAGO PARCIAL 5000',
      gestor_call: 'ORTIZ P.',
      gestor_camp: 'RUIZ L.'
    }
  ],

  // CAFAE (ID: 143)
  '143': [
    {
      id: 'CAF-001',
      documento: 'PRESTAMO-001',
      estado: 'MORA',
      vencimiento: '2025-12-20',
      moneda: 'PEN',
      importe: 5000.00,
      deuda_vencida: 2500.00,
      interes_moratorio: 125.50,
      atraso: 120,
      comentario: 'SOLICITA REFINANCIAMIENTO',
      gestion: 'EN PROCESO',
      gestor_call: 'SALAZAR T.'
    }
  ],

  // CERTUS (ID: 183)
  '183': [
    {
      id: 'CER-001',
      documento: 'MATRICULA 2026-1',
      estado: 'PENDIENTE',
      vencimiento: '2026-02-01',
      moneda: 'PEN',
      importe: 3500.00,
      mora: 150.00,
      deuda_vencida: 3650.00,
      atraso: 78,
      comentario: 'ALUMNO REGULAR',
      porc_dscto_1: '10%',
      monto_final_1: 3285.00,
      porc_dscto_2: '20%',
      monto_final_2: 2920.00,
      porc_dscto_3: '30%',
      monto_final_3: 2555.00,
      porc_dscto_4: '40%',
      monto_final_4: 2190.00,
      porc_dscto_5: '50%',
      monto_final_5: 1825.00,
      gestor_call: 'HUAMAN J.'
    }
  ],

  // CLARO_CORP (ID: 95)
  '95': [
    {
      id: 'CL-001',
      documento: 'SERVICIO CORPORATIVO',
      estado: 'ACTIVO',
      vencimiento: '2026-02-15',
      moneda: 'PEN',
      importe: 2500.00,
      deuda_vencida: 2500.00,
      atraso: 64,
      serv: 'INTERNET DEDICADO',
      comentario: 'RECLAMO EN PROCESO',
      codigo_cliente: 'CLI-9876',
      estado_documento: 'FACTURADO',
      fecha_estado_documento: '2026-02-01',
      estado_pago: 'PENDIENTE',
      status_doc: 'ACTIVO',
      gestor_call: 'QUISPE R.',
      bajaprov: 'NO'
    }
  ],

  // DERRAMA (ID: 200)
  '200': [
    {
      id: 'DER-001',
      documento: 'PRESTAMO PERSONAL',
      estado: 'VIGENTE',
      moneda: 'PEN',
      importe: 15000.00,
      saldo_contractual: 8500.00,
      monto_valor_cuota: 625.00,
      numero_cuotas: 24,
      monto_otorgado: 15000.00,
      fecha_otorgamiento: '2025-01-10',
      sbs_cantidad_empresas: 3,
      primera_cuota: '2025-02-28',
      ultima_cuota: '2027-01-28',
      gestion: 'COBRANZA REGULAR',
      gestor_call: 'FLORES M.'
    }
  ],

  // DIRECTV (ID: 8)
  '8': [
    {
      id: 'DTV-001',
      documento: 'SERVICIO TV',
      estado: 'CORTADO',
      cant_ult_6_meses: 4,
      vencimiento: '2026-01-05',
      moneda: 'PEN',
      importe: 189.90,
      deuda_vencida: 569.70,
      porc_desc: '15%',
      total_por_doc: 484.25,
      fecha_fin_dscto: '2026-04-30',
      fecha_desconexion: '2026-02-10',
      calificacion: 'MALO',
      numero_entidades: 2
    }
  ],

  // DUPREE (ID: 198)
  '198': [
    {
      id: 'DUP-001',
      cod_cliente: 'C-45678',
      documento: 'CREDITO VEHICULAR',
      estado: 'JUDICIAL',
      vencimiento: '2025-08-15',
      moneda: 'USD',
      importe_inicial: 18500.00,
      deuda_vencida: 18500.00,
      atraso_actual: 245,
      base_comentario: 'CLIENTE NO UBICADO',
      marca: 'TOYOTA',
      calificacion: 'PERDIDA',
      cant_empresas: 1,
      edad: 45,
      gestor_call: 'CARDENAS E.'
    }
  ],

  // ELEDE (ID: 202)
  '202': [
    {
      nro: '1',
      codigo_cliente: 'EL-4567',
      nro_factura: 'F001-2345',
      estado: 'VENCIDO',
      fecha_venc: '2025-11-30',
      moneda: 'PEN',
      asig_inicial: 850.00,
      saldo_total: 850.00,
      dias_atraso: 140,
      marca: 'LG',
      compania: 'ELEDE',
      tipo: 'ELECTRODOMESTICO',
      f_factura: '2025-10-15'
    }
  ],

  // WIENER (ID: 138)
  '138': [
    {
      id: 'WIE-001',
      cod_alumno: 'ALU-2024001',
      documento: 'MATRICULA 2025-2',
      estado: 'PENDIENTE',
      vencimiento: '2025-08-15',
      moneda: 'PEN',
      asignacion: 4200.00,
      dias_atraso: 245,
      cuota: 1050.00,
      mora: 320.00,
      total_saldo: 4520.00,
      marca: 'N/A',
      obs_cuota: 'CUOTA 4/4',
      carrera: 'MEDICINA',
      ciclo: 'VIII',
      comentario: 'SOLICITA FRACCIONAMIENTO',
      gestion: 'PENDIENTE APROBACION',
      gestor_call: 'VALDIVIA C.',
      descuento: 0.00
    }
  ],

  // HEINEKEN (ID: 216)
  '216': [
    {
      id: 'HEI-001',
      documento: 'FACT-2025-089',
      estado: 'VENCIDO',
      vencimiento: '2025-12-20',
      importe: 12500.00,
      saldo: 12500.00,
      dias_atraso: 120,
      antiguedad_deuda: '120 días',
      comentario: 'DISTRIBUIDOR MAYORISTA'
    }
  ],

  // MITSUI (ID: 59)
  '59': [
    {
      id: 'MIT-001',
      documento: 'CREDITO VEHICULAR',
      estado: 'VIGENTE',
      nro_cuota: 15,
      vencimiento: '2025-11-10',
      moneda: 'USD',
      importe: 450.00,
      deuda_vencida: 1350.00,
      atraso: 160,
      tipo_credito: 'VEHICULAR',
      cod_acc_prev: 'ACC-123',
      cod_acc_preju: 'PREJ-456',
      ultimo_tramo: 'EXTRAJUDICIAL',
      ultimo_fec_pago: '2025-09-15',
      categoria: 'C',
      nro_reprogramaciones: 1,
      g_whatsapp: 'ACTIVO',
      cuota_actual: 450.00,
      interes_actual: 85.00,
      placa: 'ABC-123',
      num_cuenta: 'CT-7890',
      marca_especial: 'TOYOTA',
      plazo_reprogramado: 36,
      plazo_maximo_reprogramar: 48,
      gestor_call: 'TAPIA L.',
      comentario_reprog: 'REPROGRAMADO POR PANDEMIA',
      tasa_interes: '15%',
      capital_actual: 8500.00
    }
  ],

  // NATURA (ID: 52)
  '52': [
    {
      id: 'NAT-001',
      documento: 'PEDIDO C-15',
      titulo: 'CONSULTORA',
      color: 'ORO',
      cod_cliente: 'NAT-45678',
      orden_pedido: 'OP-2026001',
      ciclo: '15',
      tramo: 'B',
      atraso: 25,
      estado: 'ACTIVO',
      fec_venc: '2026-03-01',
      moneda: 'PEN',
      asignacion: 2500.00,
      saldo: 850.00,
      saldo_corregido: 800.00,
      interes_multa_acumulados: 45.00,
      descuento_saldo_original: 50.00,
      monto_descuento_saldo_original: 800.00,
      monto_minimo_pagar_campana: 400.00,
      descuento_saldo_original_maximo: 100.00,
      monto_minimo_pagar_campana_maximo: 350.00,
      campana: 'VERANO 2026',
      saldo_mmpc: 450.00,
      fecha_vigencia_1: '2026-04-30',
      importe_pagar_planton_1: 750.00,
      camp_pedido_1: 'C-15',
      fecha_vigencia_2: '2026-05-15',
      importe_pagar_planton_2: 700.00,
      camp_pedido_2: 'C-16',
      comentario: 'BUENA CONSULTORA',
      gestionado: 'SI'
    }
  ],

  // NUBYX (ID: 206)
  '206': [
    {
      id: 'NUB-001',
      cod_cliente: 'NUB-9876',
      documento: 'PRESTAMO DIGITAL',
      estado: 'MORA',
      vencimiento: '2025-12-10',
      moneda: 'PEN',
      importe_inicial: 3500.00,
      deuda_vencida: 4200.00,
      atraso_actual: 130,
      base_comentario: 'APP DESINSTALADA',
      calificacion: 'DUDOSO',
      camp_des: '15% DSCTO',
      fin_gest: '2026-05-01',
      gestor_call: 'ZAPATA V.',
      marca: 'NUBYX'
    }
  ],

  // ORIFLAME (ID: 73)
  '73': [
    {
      id: 'ORI-001',
      documento: 'FACTURA C-08',
      estado: 'PENDIENTE',
      vencimiento: '2026-01-20',
      moneda: 'PEN',
      importe: 1800.00,
      saldo_vencido: 850.00,
      capital_oriflame: 750.00,
      cap_actual: 750.00,
      gas_actual: 25.00,
      comentario: 'CONSULTORA LIDER',
      camp_oriferia: 'ORIFERIA 2026',
      dscto_oriferia: 150.00,
      porc_dscto: '20%',
      dscto_oriferia_2: 200.00,
      porc_dscto_2: '25%',
      dscto_oriferia_3: 250.00,
      porc_dscto_3: '30%',
      dscto_oriferia_4: 300.00,
      porc_dscto_4: '35%',
      atraso: 89,
      calificacion: 'NORMAL'
    }
  ],

  // PUCP (ID: 191)
  '191': [
    {
      id: 'PUCP-001',
      cartera: 'PREGRADO',
      cod_cliente: 'ALU-20231234',
      documento: 'BOLETA 2025-2',
      estado: 'PENDIENTE',
      vencimiento: '2025-09-15',
      moneda: 'PEN',
      importe_inicial: 18500.00,
      interes_total: 450.00,
      deuda_vencida: 18950.00,
      gasto_academico: 150.00,
      deuda_vencida_gasto: 19100.00,
      desc_ciclo: 0.00,
      moneda_orig: 'PEN',
      imp_moneda_orig: 18500.00,
      atraso_actual: 215,
      calificacion: 'NORMAL',
      cant_empresas: 2,
      carrera: 'INGENIERIA CIVIL',
      edad: 22,
      gestor_call: 'BENDEZU A.'
    }
  ],

  // PROSEGUR (ID: 146)
  '146': [
    {
      id: 'PRO-001',
      cod_pago: 'PAG-4567',
      documento: 'SERVICIO SEGURIDAD',
      estado: 'VENCIDO',
      vencimiento: '2025-10-15',
      moneda: 'PEN',
      importe: 2500.00,
      deuda_vencida_soles: 2500.00,
      deuda_vencida_dolares: 0.00,
      porc_desc: '10%',
      total_por_doc: 2250.00,
      total_por_cod_pago: 2250.00,
      porc_desc_reactivacion: '15%',
      total_por_doc_reactivacion: 2125.00,
      penalidad: 150.00,
      tramo: '3',
      base: 'CONTRATO',
      producto: 'ALARMA',
      metodo_pago: 'TRANSFERENCIA',
      numero_entidades: 2,
      calificacion: 'CPP',
      razon_social: 'EMPRESA SAC',
      gestor_call: 'SANTOS R.'
    }
  ],

  // UNIQUE (ID: 62)
  '62': [
    {
      nro: '1',
      codigo_consultora: 'CON-45678',
      nro_obligacion: 'OBL-001',
      estado_documento: 'VENCIDO',
      fecha_venc: '2025-11-30',
      moneda: 'PEN',
      importe_inicial: 2500.00,
      deuda_vencida: 2500.00,
      dias_atraso: 140,
      campana: 'BELLEZA 2025',
      numero_entidades: 3,
      calificacion: 'CPP',
      calificacion_status: 'ACTIVO',
      nombre_consultora: 'MARIA GONZALES',
      codigo_directora: 'DIR-123',
      nombre_directora: 'ANA LOPEZ',
      estatus_directora: 'ACTIVA',
      gestor_call_asignado: 'CHAVEZ M.',
      gestor_campo_asignado: 'TORRES L.'
    }
  ],

  // UCSUR (ID: 209)
  '209': [
    {
      id: 'UCS-001',
      documento: 'MATRICULA 2026-1',
      estado: 'PENDIENTE',
      vencimiento: '2026-02-01',
      moneda: 'PEN',
      importe: 5200.00,
      deuda_vencida: 5200.00,
      atraso: 78,
      porc_dscto_1: '10%',
      monto_final_1: 4680.00,
      porc_dscto_2: '20%',
      monto_final_2: 4160.00,
      porc_dscto_3: '30%',
      monto_final_3: 3640.00,
      porc_dscto_4: '40%',
      monto_final_4: 3120.00,
      porc_dscto_5: '50%',
      monto_final_5: 2600.00,
      comentario: 'BECA PARCIAL',
      gestor_call: 'PAZ S.'
    }
  ],

  // VERISURE (ID: 211)
  '211': [
    {
      id: 'VER-001',
      documento: 'CONTRATO ALARMA',
      estado: 'ACTIVO',
      vencimiento: '2026-01-05',
      moneda: 'PEN',
      importe: 189.90,
      deuda_vencida: 379.80,
      subtotal: 189.90,
      atraso: 105,
      contrato: 'CT-45678',
      porc_dscto_1: '10%',
      monto_final_1: 341.82,
      porc_dscto_2: '20%',
      monto_final_2: 303.84,
      porc_dscto_3: '30%',
      monto_final_3: 265.86,
      porc_dscto_4: '40%',
      monto_final_4: 227.88,
      gestor_call: 'ROJAS E.'
    }
  ],

  // VISANET (ID: 94)
  '94': [
    {
      id: 'VIS-001',
      codigo_comercio: 'COM-98765',
      nro_documento: 'F001-4567',
      estado_doc: 'VENCIDO',
      fecha_vencimiento: '2025-12-15',
      moneda: 'PEN',
      importe: 3500.00,
      saldo_soles: 3500.00,
      total_soles_cc: 4200.00,
      saldo_dolares: 0.00,
      total_dolares_cc: 0.00,
      dias_atraso: 125,
      descripcion_motivo_deuda: 'CONTRACARGOS',
      comentario: 'COMERCIO RECLAMA',
      gestion: 'INVESTIGACION',
      gestor_call: 'CESPEDES V.'
    }
  ],

  'DEFAULT': []
};

export const opcionesNP0: SelectOption[] = [
  { id: 'C', label: 'C - Contacto' },
  { id: 'NC', label: 'NC - No Contacto' },
  { id: 'NE', label: 'NE - No Efectivo' },
];

export const opcionesNP1: Record<string, SelectOption[]> = {
  C: [
    { id: 'CP', label: 'CP - Promesa de Pago' },
    { id: 'CR', label: 'CR - Reclamo' },
    { id: 'CN', label: 'CN - Negativa de Pago' },
    { id: 'CI', label: 'CI - Sin Intención' },
  ],
  NC: [
    { id: 'NCA', label: 'NCA - No Atiende' },
    { id: 'NCB', label: 'NCB - Buzón de Voz' },
    { id: 'NCC', label: 'NCC - Apagado' },
    { id: 'NCD', label: 'NCD - Fuera de Servicio' },
  ],
  NE: [
    { id: 'NEA', label: 'NEA - Número Equivocado' },
    { id: 'NEB', label: 'NEB - No es el titular' },
  ],
};

export const opcionesNP2: Record<string, SelectOption[]> = {
  CP: [
    { id: 'CP1', label: 'CP1 - Pago Hoy' },
    { id: 'CP2', label: 'CP2 - Pago Esta Semana' },
    { id: 'CP3', label: 'CP3 - Pago Este Mes' },
  ],
  CR: [
    { id: 'CR1', label: 'CR1 - Reclamo por Cobro' },
    { id: 'CR2', label: 'CR2 - Reclamo por Tasa' },
  ],
  CN: [
    { id: 'CN1', label: 'CN1 - No tiene dinero' },
    { id: 'CN2', label: 'CN2 - No reconoce deuda' },
    { id: 'CN3', label: 'CN3 - Discapacidad' },
  ],
  CI: [{ id: 'CI1', label: 'CI1 - Indiferente' }],
  NCA: [{ id: 'NCA1', label: 'NCA1 - Suena y no atiende' }],
  NCB: [{ id: 'NCB1', label: 'NCB1 - Dejó buzón' }],
  NCC: [{ id: 'NCC1', label: 'NCC1 - Sin señal' }],
  NCD: [{ id: 'NCD1', label: 'NCD1 - Número dado de baja' }],
  NEA: [{ id: 'NEA1', label: 'NEA1 - Número incorrecto' }],
  NEB: [{ id: 'NEB1', label: 'NEB1 - Otra persona' }],
};

export const estadosGestion: SelectOption[] = [
  { id: 'PENDIENTE', label: 'PENDIENTE' },
  { id: 'EN_PROCESO', label: 'EN PROCESO' },
  { id: 'PROMESA', label: 'PROMESA DE PAGO' },
  { id: 'INCUMPLIMIENTO', label: 'INCUMPLIMIENTO' },
  { id: 'PAGADO', label: 'PAGADO' },
  { id: 'PREJUDICIAL', label: 'PREJUDICIAL' },
];

export const tiposGestion: SelectOption[] = [
  { id: 'LLAMADA', label: 'LLAMADA TELEFÓNICA' },
  { id: 'VISITA', label: 'VISITA DOMICILIARIA' },
  { id: 'EMAIL', label: 'CORREO ELECTRÓNICO' },
  { id: 'SMS', label: 'MENSAJE DE TEXTO' },
  { id: 'WHATSAPP', label: 'WHATSAPP' },
  { id: 'CARTA', label: 'CARTA NOTARIAL' },
];

export const botonesAccionPorPerfil: Record<string, string[]> = {
  default: [
    '+ESTADO_CUENTA', '+DATOS_CLIENTE', '+CARTAS', '+ESTADO_DOCUMENTO',
    '+Contratos', '+MejorGestHist', '+GESTION DOCUMENTOS', '+AGENDAS',
    '+PAGOS', '+INF.DEUDOR', '+AVAL', '+EMAIL',
  ],
};

export const botonesEstaticos = [
  'DATOS ADICIONALES', 'TELÉFONOS REFERENCIADOS', 'DIRECCIONES REFERENCIADAS',
  'GESTIÓN REALIZADA', 'ESTADO DE GESTIÓN REALIZADA',
];