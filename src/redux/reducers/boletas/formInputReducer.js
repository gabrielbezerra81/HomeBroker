import {
  MUDAR_VALIDADE_SELECT,
  MUDAR_DATA,
  LIMPAR_FORMS,
  COMPRAR_AGENDADO,
  MUDAR_ASSINATURA,
  MUDAR_ATIVO,
  FECHAR_CONFIGURAR_STOP,
  MUDAR_CHECK_SALVA_ASSINATURA,
  ADICIONAR_ITEM_TABELA_REDUCAO,
  ADICIONA_ITEM_TABELA_ORDENS_VENDA,
  REMOVE_ITEM_TABELA_GAIN_REDUCAO,
  REMOVE_ITEM_TABELA_ORDENS_MOVEL,
  MUDAR_INPUT_CONFIGURAR,
  MUDAR_QTDE,
  MUDAR_ATRIBUTO_BOLETA,
  ATUALIZAR_EVENT_SOURCE_BOLETAS,
} from "constants/ActionTypes";
import { PESQUISAR_ATIVO_BOLETA_API } from "constants/ApiActionTypes";

const INITIAL_STATE = {
  dadosPesquisa: {
    resultadoAtivo: "",
    strike: 19.02,
    tipo: "",
    model: "",
    vencimento: "",
    cotacaoAtual: "",
    porcentagem: "",
    ultimoHorario: "",
    stepQtde: 100,
    market: "",
  },
  pesquisandoAtivo: false,
  ativo: "PETR4",
  entradaDisparo: "",
  entradaExec: "",
  valorTotal: "",
  gainDisparo: "",
  gainExec: "",
  stopDisparo: "",
  stopExec: "",
  validadeSelect: "DAY",
  date: new Date(),
  assinatura: "",
  preco: "",
  showConfigStop: true,
  checkSalvarAssinatura: true,
  inicioDisparo: "",
  ajustePadrao: "",
  disparo1Ajuste: "",
  disparoMaisAjuste: "",
  stopMais1Ajuste: "",
  stopAnteriorAjuste: "",
  reducao1: "",
  reducao2: "",
  gain: "",
  ajusteAssimetrico: "",
  tabelaOrdens: [],
  tabelaOrdensSimulacao: [],
  tabelaGainReducao: [],
  gainDisparoConfig1: "",
  gainExecConfig1: "",
  stopDisparoConfig1: "",
  stopExecConfig1: "",
  gainDisparoConfig2: "",
  gainExecConfig2: "",
  stopDisparoConfig2: "",
  stopExecConfig2: "",
  qtde: "",
  erro: "",
  eventSourceCotacao: null,
};

export default (namespace) => (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case `${MUDAR_ATIVO}${namespace}`:
      return { ...state, ativo: action.payload };
    case `${MUDAR_ATRIBUTO_BOLETA}${namespace}`:
      return { ...state, [action.atributo]: action.valor };
    case `${MUDAR_VALIDADE_SELECT}${namespace}`:
      return { ...state, validadeSelect: action.payload };
    case `${MUDAR_DATA}${namespace}`:
      return { ...state, date: action.payload };
    case `${MUDAR_ASSINATURA}${namespace}`:
      return { ...state, assinatura: action.payload };
    case `${LIMPAR_FORMS}${namespace}`:
      return { ...INITIAL_STATE };
    case COMPRAR_AGENDADO:
      return { ...state };
    case `${FECHAR_CONFIGURAR_STOP}${namespace}`:
      return { ...state, showConfigStop: false };
    case `${MUDAR_CHECK_SALVA_ASSINATURA}${namespace}`:
      return { ...state, checkSalvarAssinatura: action.payload };
    case `${ADICIONAR_ITEM_TABELA_REDUCAO}${namespace}`:
      return { ...state, tabelaGainReducao: action.payload };
    case `${ADICIONA_ITEM_TABELA_ORDENS_VENDA}${namespace}`:
      return {
        ...state,
        [action.payload.nome]: action.payload.valor,
        ajusteAssimetrico: "",
      };
    case `${REMOVE_ITEM_TABELA_GAIN_REDUCAO}${namespace}`:
      return { ...state, tabelaGainReducao: action.payload };
    case `${REMOVE_ITEM_TABELA_ORDENS_MOVEL}${namespace}`:
      return { ...state, tabelaOrdens: action.payload };
    case `${MUDAR_INPUT_CONFIGURAR}${namespace}`:
      return { ...state, [action.name]: action.payload };
    case `${MUDAR_QTDE}${namespace}`:
      return { ...state, qtde: action.payload.qtde, erro: action.payload.erro };
    case `${PESQUISAR_ATIVO_BOLETA_API}${namespace}`:
      return { ...state, dadosPesquisa: action.payload };
    case `${ATUALIZAR_EVENT_SOURCE_BOLETAS}${namespace}`:
      return { ...state, eventSourceCotacao: action.payload };
    default:
      return state;
  }
};

export const formatarNumero = (
  value,
  casaDecimal,
  separadorOrigem,
  separadorResultado,
) => {
  value = value.split(separadorOrigem);
  if (value[1] && value[1].length === 1) {
    //value[1] = value[1] * 10;
  }
  value = value.join("");

  if (value.length > 2) {
    value =
      value.substring(0, value.length - casaDecimal) +
      separadorResultado +
      value.substring(value.length - casaDecimal, value.length);

    return value;
  }
  if (value.length > 1) {
    value =
      value.substring(0, value.length - 1) +
      separadorResultado +
      value.substring(value.length - 1, value.length);
    return value;
  }

  return value;
};

/*
const formatarPreco = value => {
  value = value.split(",").join("");

  if (value.length > 2) {
    value =
      value.substring(0, value.length - 2) +
      "," +
      value.substring(value.length - 2, value.length);
  }

  return value;
};
*/
