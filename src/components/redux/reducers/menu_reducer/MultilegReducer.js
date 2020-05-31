import {
  ABRIR_FECHAR_ITEM_BARRA_LATERAL,
  LOGAR_DESLOGAR_USUARIO,
} from "constants/ActionTypes";
import {
  MUDAR_TIPO,
  MODIFICAR_VARIAVEL_MULTILEG,
} from "constants/MenuActionTypes";
import { PESQUISAR_ATIVO_MULTILEG_API } from "constants/ApiActionTypes";
import { resetarEstadoRedux } from "components/redux/reducers/resetarEstado";

const INITIAL_STATE = {
  configComplementarAberto: false,
  pesquisandoAtivo: false,
  abaSelecionada: "tab0",
  horaInicial: "",
  horaFinal: "",
  modoExec: "preço",
  apregoarOferta: false,
  multileg: [
    {
      nomeAba: "Ordem 1",
      ativo: "PETR4",
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
  eventSource: null, //Book
  eventSourceCotacao: null,
  setIntervalCotacoesMultileg: null,
  cotacoesMultileg: [],
  cotacoesMultilegID: 0,
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case MUDAR_TIPO:
      return { ...state, tipo: payload };
    case MODIFICAR_VARIAVEL_MULTILEG:
      return { ...state, [payload.nome]: payload.valor };
    case PESQUISAR_ATIVO_MULTILEG_API:
      return { ...state, multileg: payload };

    case ABRIR_FECHAR_ITEM_BARRA_LATERAL:
      if (payload.name === "multilegAberto")
        return resetarEstadoRedux(
          state,
          INITIAL_STATE,
          ["multileg", "cotacoesMultileg"],
          !payload.valor,
          "multileg"
        );
      else return state;

    case LOGAR_DESLOGAR_USUARIO:
      return resetarEstadoRedux(
        state,
        INITIAL_STATE,
        ["multileg", "cotacoesMultileg"],
        !payload.logado,
        "multileg"
      );
    default:
      return state;
  }
};
