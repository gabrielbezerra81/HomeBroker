import _ from "lodash";
import { cloneMultilegTabs } from "modules/multileg/duck/actions/MultilegActions";

export const resetarEstadoRedux = ({
  state,
  initialState,
  omitions = [],
  reducerName,
  shouldClearAllProps,
}) => {
  let mutableProps = {};
  let pick = {};

  if (shouldClearAllProps)
    switch (reducerName) {
      case "conditionalMultileg":
        const [tab0] = cloneMultilegTabs(conditionalMultileg("CONDIÇÃO"));
        const [tab1] = cloneMultilegTabs(conditionalMultileg("ORDEM"));

        mutableProps = {
          multileg: [tab0, tab1],
          cotacoesMultileg: [], // cotacoes está sendo mutado
        };
        break;
      case "multileg":
        mutableProps = {
          multileg: cloneMultilegTabs(multileg),
          cotacoesMultileg: [], // cotacoes está sendo mutado
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

// MultilegTab
const multileg = [
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
    selectedStrategy: 1,
    market: "",
    editingOrderId: null,
  },
];

const conditionalMultileg = (tabType) => {
  return [
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
      selectedStrategy: 1,
      market: "",
      editingOrderId: null,
      tabType,
    },
  ];
};
