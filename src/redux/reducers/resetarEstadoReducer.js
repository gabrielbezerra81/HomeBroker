import _ from "lodash";
import {
  cloneMultilegTabs,
  cloneMultilegQuotes,
} from "redux/actions/multileg/MultilegActions";

export const resetarEstadoRedux = (
  state,
  estadoInicial,
  omissoes = [],
  reducer,
  limparTudo
) => {
  let mutableProps = {};
  let pick = {};

  if (limparTudo)
    switch (reducer) {
      case "multileg":
        mutableProps = {
          multileg: cloneMultilegTabs(multileg.multileg),
          cotacoesMultileg: cloneMultilegQuotes(multileg.cotacoesMultileg), // cotacoes está sendo mutado
        };
        break;
      case "ordensExec":
        mutableProps = {
          tabelaOrdensExecucao: [],
          eventSourceOrdensExec: null,
        };
        break;
      default:
        break;
    }
  else pick = { ..._.pick(state, [...omissoes]) };

  if (!omissoes.length) return { ...estadoInicial, ...mutableProps };
  if (omissoes.length) {
    return {
      ...pick,
      ..._.omit(estadoInicial, [...omissoes]),
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
    },
  ],
  cotacoesMultileg: [],
};
