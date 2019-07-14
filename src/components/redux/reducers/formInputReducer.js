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
  entradaDisparo: "0.00",
  entradaExec: "0.00",
  valorTotal: "15.52",
  gainDisparo: "0.00",
  gainExec: "0.00",
  stopDisparo: "0.00",
  stopExec: "0.00",
  cotacaoAtual: "0.00",
  validadeSelect: "hoje",
  date: new Date(),
  assinatura: "",
  porcentagem: "9.55",
  preco: "0,00",
  showConfigStop: true,
  checkSalvarAssinatura: true,
  inicioDisparo: "0.00",
  ajustePadrao: "0.00",
  disparo1Ajuste: "0.10",
  disparoMaisAjuste: "0.20",
  stopMais1Ajuste: "0.30",
  stopAnteriorAjuste: "0.40"
};

export default namespace => (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case `${MUDAR_ATIVO}${namespace}`:
      return { ...state, ativo: action.payload };
    case `${MUDAR_ENTRADA_DISPARO}${namespace}`:
      return { ...state, entradaDisparo: Number(action.payload).toFixed(2) };
    case `${MUDAR_ENTRADA_EXEC}${namespace}`:
      return { ...state, entradaExec: Number(action.payload).toFixed(2) };
    case `${MUDAR_GAIN_DISPARO}${namespace}`:
      return { ...state, gainDisparo: Number(action.payload).toFixed(2) };
    case `${MUDAR_GAIN_EXEC}${namespace}`:
      return { ...state, gainExec: Number(action.payload).toFixed(2) };
    case `${MUDAR_STOP_DISPARO}${namespace}`:
      return { ...state, stopDisparo: Number(action.payload).toFixed(2) };
    case `${MUDAR_STOP_EXEC}${namespace}`:
      return { ...state, stopExec: Number(action.payload).toFixed(2) };
    case `${MUDAR_VALIDADE_SELECT}${namespace}`:
      return { ...state, validadeSelect: action.payload };
    case `${MUDAR_DATA}${namespace}`:
      return { ...state, date: action.payload };
    case `${MUDAR_ASSINATURA}${namespace}`:
      return { ...state, assinatura: action.payload };
    case `${LIMPAR_FORMS}${namespace}`:
      return { ...INITIAL_STATE };
    case `${MUDAR_PRECO}${namespace}`:
      return { ...state, preco: action.payload };
    case COMPRAR_AGENDADO:
      return { ...state };
    case `${FECHAR_CONFIGURAR_STOP}${namespace}`:
      return { ...state, showConfigStop: false };
    case `${MUDAR_CHECK_SALVA_ASSINATURA}${namespace}`:
      return { ...state, checkSalvarAssinatura: action.payload };
    case `${MUDAR_INICIO_DISPARO}${namespace}`:
      return { ...state, inicioDisparo: Number(action.payload).toFixed(2) };
    case `${MUDAR_AJUSTE_PADRAO}${namespace}`:
      return { ...state, ajustePadrao: Number(action.payload).toFixed(2) };
    default:
      return state;
  }
};
