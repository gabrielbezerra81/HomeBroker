import {
  MUDAR_GAIN_DISPARO,
  MUDAR_GAIN_EXEC,
  MUDAR_STOP_DISPARO,
  MUDAR_STOP_EXEC,
  MUDAR_VALIDADE_SELECT,
  MUDAR_DATA,
  LIMPAR_FORMS,
  COMPRAR_AGENDADO,
  MUDAR_ASSINATURA,
  MUDAR_ATIVO,
  MUDAR_ENTRADA_DISPARO,
  MUDAR_ENTRADA_EXEC,
  MUDAR_PRECO,
  FECHAR_CONFIGURAR_STOP,
  MUDAR_CHECK_SALVA_ASSINATURA,
  MUDAR_INICIO_DISPARO,
  MUDAR_AJUSTE_PADRAO
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
  validadeSelect: "hoje",
  date: new Date(),
  assinatura: "",
  porcentagem: 9.55,
  preco: 0.0,
  showConfigStop: true,
  checkSalvarAssinatura: true,
  inicioDisparo: 0,
  ajustePadrao: 0
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MUDAR_ATIVO:
      return { ...state, ativo: action.payload };
    case MUDAR_ENTRADA_DISPARO:
      return { ...state, entradaDisparo: action.payload };
    case MUDAR_ENTRADA_EXEC:
      return { ...state, entradaExec: action.payload };
    case MUDAR_GAIN_DISPARO:
      return { ...state, gainDisparo: action.payload };
    case MUDAR_GAIN_EXEC:
      return { ...state, gainExec: action.payload };
    case MUDAR_STOP_DISPARO:
      return { ...state, stopDisparo: action.payload };
    case MUDAR_STOP_EXEC:
      return { ...state, stopExec: action.payload };
    case MUDAR_VALIDADE_SELECT:
      return { ...state, validadeSelect: action.payload };
    case MUDAR_DATA:
      return { ...state, date: action.payload };
    case MUDAR_ASSINATURA:
      return { ...state, assinatura: action.payload };
    case LIMPAR_FORMS:
      return { ...INITIAL_STATE };
    case MUDAR_PRECO:
      return { ...state, preco: action.payload };
    case COMPRAR_AGENDADO:
      return { ...state };
    case FECHAR_CONFIGURAR_STOP:
      return { ...state, showConfigStop: false };
    case MUDAR_CHECK_SALVA_ASSINATURA:
      return { ...state, checkSalvarAssinatura: action.payload };
    case MUDAR_INICIO_DISPARO:
      return { ...state, inicioDisparo: action.payload };
    case MUDAR_AJUSTE_PADRAO:
      return { ...state, ajustePadrao: action.payload };
    default:
      return state;
  }
};
