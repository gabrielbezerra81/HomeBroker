import {
  MUDAR_GAIN_DISPARO_COMPRA_AGENDADA,
  MUDAR_GAIN_EXEC_COMPRA_AGENDADA,
  MUDAR_STOP_DISPARO_COMPRA_AGENDADA,
  MUDAR_STOP_EXEC_COMPRA_AGENDADA,
  MUDAR_VALIDADE_CHECK_COMPRA_AGENDADA,
  MUDAR_DATA_COMPRA_AGENDADA,
  LIMPAR_COMPRA_AGENDADA,
  COMPRAR_AGENDADO,
  MUDAR_ASSINATURA_COMPRA_AGENDADA,
  MUDAR_ATIVO_COMPRA_AGENDADA,
  MUDAR_ENTRADA_DISPARO_COMPRA_AGENDADA,
  MUDAR_ENTRADA_EXEC_COMPRA_AGENDADA,
  MUDAR_PRECO_COMPRA_LIMITADA,
  FECHAR_CONFIGURAR_STOP
} from "../../../constants/ActionTypes";

const INITIAL_STATE = {
  ativo: "",
  entradaDisparo: 0,
  entradaExec: 0,
  valorTotal: 0,
  gainDisparo: 0,
  gainExec: 0,
  stopDisparo: 0,
  stopExec: 0,
  cotacaoAtual: 0,
  validadeChecked: true,
  date: new Date(),
  assinatura: "",
  porcentagem: 9.55,
  preco: 0.0,
  showConfigStop: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MUDAR_ATIVO_COMPRA_AGENDADA:
      return { ...state, ativo: action.payload };
    case MUDAR_ENTRADA_DISPARO_COMPRA_AGENDADA:
      return { ...state, entradaDisparo: action.payload };
    case MUDAR_ENTRADA_EXEC_COMPRA_AGENDADA:
      return { ...state, entradaExec: action.payload };
    case MUDAR_GAIN_DISPARO_COMPRA_AGENDADA:
      return { ...state, gainDisparo: action.payload };
    case MUDAR_GAIN_EXEC_COMPRA_AGENDADA:
      return { ...state, gainExec: action.payload };
    case MUDAR_STOP_DISPARO_COMPRA_AGENDADA:
      return { ...state, stopDisparo: action.payload };
    case MUDAR_STOP_EXEC_COMPRA_AGENDADA:
      return { ...state, stopExec: action.payload };
    case MUDAR_VALIDADE_CHECK_COMPRA_AGENDADA:
      return { ...state, validadeChecked: action.payload };
    case MUDAR_DATA_COMPRA_AGENDADA:
      return { ...state, date: action.payload };
    case MUDAR_ASSINATURA_COMPRA_AGENDADA:
      return { ...state, assinatura: action.payload };
    case LIMPAR_COMPRA_AGENDADA:
      return { ...INITIAL_STATE };
    case MUDAR_PRECO_COMPRA_LIMITADA:
      return { ...state, preco: action.payload };
    case COMPRAR_AGENDADO:
      return { ...state };
    case FECHAR_CONFIGURAR_STOP:
      return { ...state, showConfigStop: false };
    default:
      return state;
  }
};
