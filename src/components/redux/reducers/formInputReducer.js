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
  MUDAR_AJUSTE_PADRAO,
  MUDAR_DISPARO_PRIMEIRO_AJUSTE,
  MUDAR_DISPARO_MAIS_AJUSTE,
  MUDAR_STOP_MAIS_PRIMEIRO_AJUSTE,
  MUDAR_STOP_ANTERIOR_AJUSTE,
  MUDAR_REDUCAO1,
  MUDAR_REDUCAO2,
  MUDAR_GAIN
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
  stopAnteriorAjuste: "0.40",
  reducao1: "0.00",
  reducao2: "0.00",
  gain: "0.00",
  tabelaOrdens: [
    { disparo: 27.5, ajuste: 2.0, stop: 27.0 },
    { disparo: 28.0, ajuste: 0.5, stop: 27.5 },
    { disparo: 28.3, ajuste: 0.3, stop: 27.8 },
    { disparo: 28.4, ajuste: 0.1, stop: 27.9 },
    { disparo: 28.5, ajuste: 0.1, stop: 28 },
    { disparo: 28.6, ajuste: 0.1, stop: 28.1 },
    { disparo: 28.6, ajuste: 0.1, stop: 28.1 },
    { disparo: 28.6, ajuste: 0.1, stop: 28.1 }
  ],
  tabelaOfertasCompra: [],
  tabelaOfertasVenda: []
};
export default namespace => (state = INITIAL_STATE, action) => {
  if (action.payload === "0" || action.payload === 0)
    action.payload = Number(action.payload).toFixed(2);

  switch (action.type) {
    case `${MUDAR_ATIVO}${namespace}`:
      return { ...state, ativo: action.payload };
    case `${MUDAR_ENTRADA_DISPARO}${namespace}`:
      return { ...state, entradaDisparo: action.payload };
    case `${MUDAR_ENTRADA_EXEC}${namespace}`:
      return { ...state, entradaExec: action.payload };
    case `${MUDAR_GAIN_DISPARO}${namespace}`:
      return { ...state, gainDisparo: action.payload };
    case `${MUDAR_GAIN_EXEC}${namespace}`:
      return { ...state, gainExec: action.payload };
    case `${MUDAR_STOP_DISPARO}${namespace}`:
      return { ...state, stopDisparo: action.payload };
    case `${MUDAR_STOP_EXEC}${namespace}`:
      return { ...state, stopExec: action.payload };
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
      return { ...state, inicioDisparo: action.payload };
    case `${MUDAR_AJUSTE_PADRAO}${namespace}`:
      return { ...state, ajustePadrao: action.payload };
    case `${MUDAR_DISPARO_PRIMEIRO_AJUSTE}${namespace}`:
      return { ...state, disparo1Ajuste: action.payload };
    case `${MUDAR_DISPARO_MAIS_AJUSTE}${namespace}`:
      return { ...state, disparoMaisAjuste: action.payload };
    case `${MUDAR_STOP_MAIS_PRIMEIRO_AJUSTE}${namespace}`:
      return { ...state, stopMais1Ajuste: action.payload };
    case `${MUDAR_STOP_ANTERIOR_AJUSTE}${namespace}`:
      return {
        ...state,
        stopAnteriorAjuste: action.payload
      };
    case `${MUDAR_REDUCAO1}${namespace}`:
      return { ...state, reducao1: action.payload };
    case `${MUDAR_REDUCAO2}${namespace}`:
      return { ...state, reducao2: action.payload };
    case `${MUDAR_GAIN}${namespace}`:
      return { ...state, gain: action.payload };
    default:
      return state;
  }
};
