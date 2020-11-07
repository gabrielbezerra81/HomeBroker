export const MUDAR_QTDE_BOOK = "mudar_qtde_book";
export const MUDAR_QTDE = "mudar_qtde";
export const MUDAR_STOPLOSS_BOOK = "mudar_stoploss_book";
export const MUDAR_GAIN_BOOK = "mudar_gain_book";
export const MUDAR_INPUTHEADER_BOOK = "mudar_inputheader_book";

export const MUDAR_ATRIBUTO_BOLETA = "mudar_atributo_boleta";

export const MUDAR_GAIN_DISPARO = "mudar_gain_disparo";
export const MUDAR_GAIN_EXEC = "mudar_gain_exec";
export const MUDAR_STOP_DISPARO = "mudar_stop_disparo";
export const MUDAR_STOP_EXEC = "mudar_stop_exec";
export const MUDAR_VALIDADE_SELECT = "mudar_validade_select";
export const MUDAR_DATA = "mudar_data";
export const LIMPAR_FORMS = "limpar_forms";
export const COMPRAR_AGENDADO = "comprar_agendado";
export const MUDAR_ATIVO = "mudar_ativo";
export const MUDAR_ENTRADA_DISPARO = "mudar_entrada_disparo";
export const MUDAR_ENTRADA_EXEC = "mudar_entrada_exec";
export const MUDAR_ASSINATURA = "mudar_assinatura";

export const MUDAR_PRECO = "mudar_preco";

export const FECHAR_CONFIGURAR_STOP = "fechar_configurar_stop";

export const MUDAR_CHECK_SALVA_ASSINATURA = "mudar_check_salva_assinatura";

export const MUDAR_INICIO_DISPARO = "mudar_inicio_disparo";
export const MUDAR_AJUSTE_PADRAO = "mudar_ajuste_padrao";
export const MUDAR_DISPARO_PRIMEIRO_AJUSTE = "mudar_disparo_primeiro_ajuste";
export const MUDAR_DISPARO_MAIS_AJUSTE = "mudar_disparo_mais_ajuste";
export const MUDAR_STOP_MAIS_PRIMEIRO_AJUSTE =
  "mudar_stop_mais_primeiro_ajuste";
export const MUDAR_STOP_ANTERIOR_AJUSTE = "mudar_stop_anterior_ajuste";
export const MUDAR_AJUSTE_ASSIMETRICO = "mudar_ajuste_assimetrico";
export const ADICIONA_ITEM_TABELA_ORDENS_VENDA =
  "adiciona_item_tabela_ordens_venda";
export const REMOVE_ITEM_TABELA_ORDENS_MOVEL =
  "remove_item_tabela_ordens_movel";

export const MUDAR_REDUCAO1 = "mudar_reducao1";
export const MUDAR_REDUCAO2 = "mudar_reducao2";
export const MUDAR_GAIN = "mudar_gain";
export const ADICIONAR_ITEM_TABELA_REDUCAO = "adicionar_item_tabela_reducao";
export const REMOVE_ITEM_TABELA_GAIN_REDUCAO =
  "remove_item_tabela_gain_reducao";

export const COMPRA_AGENDADA_NAMESPACE = "compraAgendadaReducer";
export const COMPRA_LIMITADA_NAMESPACE = "compraLimitadaReducer";
export const COMPRA_MERCADO_NAMESPACE = "compraMercadoReducer";
export const COMPRA_STARTSTOP_NAMESPACE = "compraStartStopReducer";
export const COMPRA_STARTMOVEL_NAMESPACE = "compraStartMovelReducer";
export const COMPRA_GAINREDUCAO_NAMESPACE = "compraGainReducao";

export const VENDA_AGENDADA_NAMESPACE = "vendaAgendadaReducer";
export const VENDA_LIMITADA_NAMESPACE = "vendaLimitadaReducer";
export const VENDA_MERCADO_NAMESPACE = "vendaMercadoReducer";
export const VENDA_STARTSTOP_NAMESPACE = "vendaStartStopReducer";
export const VENDA_STOPMOVEL_NAMESPACE = "vendaStopMovel";
export const VENDA_GAINREDUCAO_NAMESPACE = "vendaGainReducao";

export const ABRIR_FORMULARIO = "abrir_formulario";
export const FECHAR_FORMULARIO = "fechar_formulario";

export const AUMENTAR_ZINDEX = "aumentar_zindex";

export const MUDAR_INPUT_CONFIGURAR = "mudar_input_configurar";

export const RECEBER_APPKEYLOCAL = "receber_appkeylocal";

//Actions do MainReducer
export const CRIAR_APP = "criar_app";
export const MOSTRAR_APP = "mostrar_app";
export const ATUALIZAR_SHOW = "atualizar_show";
export const ATUALIZAR_DIVKEY = "atualizar_divkey";
export const FECHAR_FORM = "fechar_form";

//tela principal
export const ABRIR_FECHAR_MENU_LATERAL = "abrir_fechar_menu_lateral";
export const LOGAR_DESLOGAR_USUARIO = "logar_deslogar_usuario";
export const ABRIR_FECHAR_ITEM_BARRA_LATERAL =
  "abrir_fechar_item_barra_lateral";
const UPDATE_ONE_SYSTEM_STATE = "update_one_system_state";
const UPDATE_MANY_SYSTEM_STATE = "update_many_system_state";
//

export const ATUALIZAR_EVENT_SOURCE_BOLETAS = "atualizar_event_source_boletas";

//TelaLogin
export const MUDAR_DADOS_LOGIN = "mudar_dados_login";

export const actionType = {
  RESET_REDUX_STATE: "reset_redux_state",
  UPDATE_ONE_SYSTEM_STATE,
  UPDATE_MANY_SYSTEM_STATE,
} as const;

const namespaces = [
  COMPRA_AGENDADA_NAMESPACE,
  COMPRA_LIMITADA_NAMESPACE,
  COMPRA_MERCADO_NAMESPACE,
  COMPRA_STARTSTOP_NAMESPACE,
  COMPRA_STARTMOVEL_NAMESPACE,
  COMPRA_GAINREDUCAO_NAMESPACE,
  VENDA_AGENDADA_NAMESPACE,
  VENDA_LIMITADA_NAMESPACE,
  VENDA_MERCADO_NAMESPACE,
  VENDA_STARTSTOP_NAMESPACE,
  VENDA_STOPMOVEL_NAMESPACE,
  VENDA_GAINREDUCAO_NAMESPACE,
  "bookOfertaReducer",
  "appBoletasReducer",
] as const;

export type NamespacesType = typeof namespaces[number];

export type BoletaNamespace = Exclude<
  NamespacesType,
  "bookOfertaReducer" | "appBoletasReducer"
>;
