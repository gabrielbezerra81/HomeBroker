import { actionType } from "constants/ActionTypes";
import {
  MUDAR_TIPO,
  MODIFICAR_VARIAVEL_MULTILEG,
} from "constants/MenuActionTypes";
import { PESQUISAR_ATIVO_MULTILEG_API } from "constants/ApiActionTypes";
import { resetarEstadoRedux } from "redux/reducers/resetarEstadoReducer";

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
      ativo: "",
      ativoAtual: "",
      variacao: 0,
      opcoes: [],
      strikeSelecionado: 0,
      codigoAberto: false,
      vencimento: [],
      vencimentoSelecionado: "",
      preco: "",
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
    case actionType.RESET_REDUX_STATE:
      if (["multilegAberto", "deslogar"].includes(payload.name))
        return {
          ...resetarEstadoRedux(
            state,
            INITIAL_STATE,
            ["multileg", "cotacoesMultileg"],
            "multileg",
            payload.limparReducer
          ),
        };
      else return state;
    default:
      return state;
  }
};
