import {
  ABRIR_FECHAR_MENU_LATERAL,
  LOGAR_DESLOGAR_USUARIO,
  ABRIR_FECHAR_ITEM_BARRA_LATERAL,
  MUDAR_DADOS_LOGIN,
  actionType,
} from "constants/ActionTypes";
import { resetarEstadoRedux } from "redux/reducers/resetarEstadoReducer";

const INITIAL_STATE = {
  usuarioConectado: "",
  menuLateralAberto: false,
  logado: false,
  valorLiquido: "15.000,00",
  valorComprar: "3.500,00",
  ativo: "Bender",
  ordensAberto: false,
  ordensExecucaoAberto: false,
  relatorioDetalhadoAberto: false,
  listaCompletaAberta: false,
  multilegAberto: false,
  thlAberta: false,
  token: {},
  conta: [],
  contaSelecionada: {},

  // inputUsuario: "gabrielAB",
  // inputSenha: "123456789",
  // nomeCadastro: "",
  // usernameCadastro: "",
  // emailCadastro: "",
  // senhaCadastro: "",
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case ABRIR_FECHAR_MENU_LATERAL:
      return { ...state, menuLateralAberto: payload };
    case LOGAR_DESLOGAR_USUARIO:
      return {
        // ...resetarEstadoRedux(state, INITIAL_STATE, [], !payload.logado),
        ...state,
        ...payload,
      };
    case ABRIR_FECHAR_ITEM_BARRA_LATERAL:
      return { ...state, [payload.name]: payload.valor };
    case MUDAR_DADOS_LOGIN:
      return { ...state, [payload.nomeVariavel]: payload.valor };
    case actionType.RESET_REDUX_STATE:
      if (["deslogar"].includes(payload.name))
        return {
          ...resetarEstadoRedux(
            state,
            INITIAL_STATE,
            [
              "ordensExecucaoAberto",
              "relatorioDetalhadoAberto",
              "listaCompletaAberta",
              "multilegAberto",
              "thlAberta",
            ],
            "telaprincipal",
            false,
          ),
        };
      else return state;
    default:
      return state;
  }
};
