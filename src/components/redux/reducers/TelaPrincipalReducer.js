import {
  ABRIR_FECHAR_MENU_LATERAL,
  LOGAR_DESLOGAR_USUARIO,
  ABRIR_FECHAR_ITEM_BARRA_LATERAL,
  MUDAR_DADOS_LOGIN,
} from "constants/ActionTypes";
import { resetarEstadoRedux } from "components/redux/reducers/resetarEstado";

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
  inputUsuario: "gabrielAB",
  inputSenha: "123456789",
  token: {},
  nomeCadastro: "",
  usernameCadastro: "",
  emailCadastro: "",
  senhaCadastro: "",
  conta: [],
  contaSelecionada: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ABRIR_FECHAR_MENU_LATERAL:
      return { ...state, menuLateralAberto: action.payload };
    case LOGAR_DESLOGAR_USUARIO:
      return {
        ...resetarEstadoRedux(state, INITIAL_STATE, [], !action.payload.logado),
        ...action.payload,
        inputSenha: "",
        // ...resetarEstado(!action.payload.logado),// inverter quando usar nova função
      };
    case ABRIR_FECHAR_ITEM_BARRA_LATERAL:
      return { ...state, [action.payload.name]: action.payload.valor };
    case MUDAR_DADOS_LOGIN:
      return { ...state, [action.payload.nomeVariavel]: action.payload.valor };
    default:
      return state;
  }
};
