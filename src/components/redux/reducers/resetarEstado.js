import _ from "lodash";

export const resetarEstadoRedux = (
  state,
  estadoInicial,
  omissoes = [],
  condicao = true,
  reducer,
  limparTudo = true
) => {
  if (!condicao) return state;

  let mutableProps = {};

  if (limparTudo)
    switch (reducer) {
      case "multileg":
        mutableProps = { ...multileg, cotacoesMultileg: [] }; // cotacoes está sendo mutado
        break;
      case "ordensExec":
        mutableProps = { tabelaOrdensExecucao: [] };
        break;
      default:
        break;
    }
  if (condicao && !omissoes.length)
    return { ...estadoInicial, ...mutableProps };
  if (condicao && omissoes.length) {
    return {
      ..._.pick(state, [...omissoes]),
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
};

/*
  const initial_state = {};
  Object.keys(state).forEach((key) => {
    let valorVazio = null;
    const valorAtual = state[key];

    if (Array.isArray(valorAtual)) valorVazio = [];
    else {
      switch (typeof valorAtual) {
        case "number":
          valorVazio = 0;
          break;
        case "string":
          valorVazio = "";
          break;
        case "boolean":
          valorVazio = false;
          break;
        case "object":
          valorVazio = null;
          break;
        default:
          break;
      }
    }
    initial_state[key] = valorVazio;
  });
*/
