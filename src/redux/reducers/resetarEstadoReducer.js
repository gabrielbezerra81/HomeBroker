import _ from "lodash";
import {
  cloneMultilegTabs,
  cloneMultilegQuotes,
} from "redux/actions/multileg/MultilegActions";

export const resetarEstadoRedux = ({
  state,
  initialState,
  omitions = [],
  reducerName,
  shouldClearAllProps,
  shouldClearEventSources = false,
}) => {
  let mutableProps = {};
  let pick = {};

  if (shouldClearEventSources) {
    Object.keys(state).forEach((key) => {
      if (key.toLowerCase().includes("source") && state[key])
        state[key].close();
      if (key.toLowerCase().includes("interval") && state[key])
        clearInterval(state[key]);
    });
  }

  if (shouldClearAllProps)
    switch (reducerName) {
      case "multileg":
        mutableProps = {
          multileg: cloneMultilegTabs(multileg.multileg),
          cotacoesMultileg: cloneMultilegQuotes(multileg.cotacoesMultileg), // cotacoes está sendo mutado
        };
        break;
      case "ordensExec":
        mutableProps = {
          tabelaOrdensExecucao: [],
          esource_ordersExec: null,
        };
        break;
      case "thl":
        break;
      default:
        break;
    }
  else pick = { ..._.pick(state, [...omitions]) };

  if (!omitions.length) return { ...initialState, ...mutableProps };
  if (omitions.length) {
    return {
      ...pick,
      ..._.omit(initialState, [...omitions]),
      ...mutableProps,
    };
  }
};

const multileg = {
  multileg: [
    {
      nomeAba: "Ordem 1",
      ativo: "",
      ativoAtual: "",
      valor: 0,
      variacao: 0,
      opcoes: [],
      strikeSelecionado: "",
      vencimento: [],
      vencimentoSelecionado: "",
      preco: "",
      total: "",
      validadeSelect: "DAY",
      date: new Date(),
      tabelaMultileg: [],
      isAlertOpen: false,
      operator: "Less",
      param: "Bid",
      comment: "",
    },
  ],
  cotacoesMultileg: [],
};
