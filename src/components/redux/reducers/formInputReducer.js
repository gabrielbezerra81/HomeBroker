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
  MUDAR_GAIN,
  MUDAR_AJUSTE_ASSIMETRICO,
  ADICIONAR_ITEM_TABELA_REDUCAO,
  ADICIONA_ITEM_TABELA_ORDENS_VENDA,
  REMOVE_ITEM_TABELA_GAIN_REDUCAO,
  REMOVE_ITEM_TABELA_ORDENS_MOVEL
} from "../../../constants/ActionTypes";

const INITIAL_STATE = {
  resultadoAtivo: "PETR4, PETROBRAS",
  ativo: "",
  entradaDisparo: "",
  entradaExec: "",
  valorTotal: "",
  gainDisparo: "",
  gainExec: "",
  stopDisparo: "",
  stopExec: "",
  cotacaoAtual: "",
  validadeSelect: "hoje",
  date: new Date(),
  assinatura: "",
  porcentagem: "0.00",
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
  tabelaOfertasCompra: [],
  tabelaOfertasVenda: [],
  tabelaGainReducao: []
};

const formatarNumero = value => {
  value = value.split(".").join("");

  if (value.length > 2) {
    value =
      value.substring(0, value.length - 2) +
      "." +
      value.substring(value.length - 2, value.length);
  }

  return value;
};

export default namespace => (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case `${MUDAR_ATIVO}${namespace}`:
      return { ...state, ativo: action.payload };
    case `${MUDAR_ENTRADA_DISPARO}${namespace}`:
      return { ...state, entradaDisparo: formatarNumero(action.payload) };
    case `${MUDAR_ENTRADA_EXEC}${namespace}`:
      return { ...state, entradaExec: formatarNumero(action.payload)  };
    case `${MUDAR_GAIN_DISPARO}${namespace}`:
      return { ...state, gainDisparo: formatarNumero(action.payload)  };
    case `${MUDAR_GAIN_EXEC}${namespace}`:
      return { ...state, gainExec: formatarNumero(action.payload)  };
    case `${MUDAR_STOP_DISPARO}${namespace}`:
      return { ...state, stopDisparo: formatarNumero(action.payload)  };
    case `${MUDAR_STOP_EXEC}${namespace}`:
      return { ...state, stopExec: formatarNumero(action.payload)  };
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
      return { ...state, inicioDisparo: formatarNumero(action.payload)  };
    case `${MUDAR_AJUSTE_PADRAO}${namespace}`:
      return { ...state, ajustePadrao: formatarNumero(action.payload)  };
    case `${MUDAR_DISPARO_PRIMEIRO_AJUSTE}${namespace}`:
      return { ...state, disparo1Ajuste: formatarNumero(action.payload)  };
    case `${MUDAR_DISPARO_MAIS_AJUSTE}${namespace}`:
      return { ...state, disparoMaisAjuste: formatarNumero(action.payload)  };
    case `${MUDAR_STOP_MAIS_PRIMEIRO_AJUSTE}${namespace}`:
      return { ...state, stopMais1Ajuste: formatarNumero(action.payload)  };
    case `${MUDAR_STOP_ANTERIOR_AJUSTE}${namespace}`:
      return {
        ...state,
        stopAnteriorAjuste: formatarNumero(action.payload) 
      };
    case `${MUDAR_REDUCAO1}${namespace}`:
      return { ...state, reducao1: formatarNumero(action.payload)  };
    case `${MUDAR_REDUCAO2}${namespace}`:
      return { ...state, reducao2: formatarNumero(action.payload)  };
    case `${MUDAR_GAIN}${namespace}`:
      return { ...state, gain: formatarNumero(action.payload)  };
    case `${MUDAR_AJUSTE_ASSIMETRICO}${namespace}`:
      return { ...state, ajusteAssimetrico: formatarNumero(action.payload)  };
    case `${ADICIONAR_ITEM_TABELA_REDUCAO}${namespace}`:
      return { ...state, tabelaGainReducao: action.payload };
    case `${ADICIONA_ITEM_TABELA_ORDENS_VENDA}${namespace}`:
      return { ...state, tabelaOrdens: action.payload };
    case `${REMOVE_ITEM_TABELA_GAIN_REDUCAO}${namespace}`:
      return { ...state, tabelaGainReducao: action.payload };
    case `${REMOVE_ITEM_TABELA_ORDENS_MOVEL}${namespace}`:
      return { ...state, tabelaOrdens: action.payload };
    default:
      return state;
  }
};
