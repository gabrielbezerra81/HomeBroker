import {
  ABRIR_FECHAR_MENU_LATERAL,
  LOGAR_DESLOGAR_USUARIO,
  ABRIR_FECHAR_ITEM_BARRA_LATERAL,
  MUDAR_DADOS_LOGIN,
} from "constants/ActionTypes";

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
  nomeCadastro: "Gabriel",
  usernameCadastro: "gabrielAB",
  emailCadastro: "gabrielAB@gmail.com",
  senhaCadastro: "123456789",
  conta: [],
  contaSelecionada: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ABRIR_FECHAR_MENU_LATERAL:
      return { ...state, menuLateralAberto: action.payload };
    case LOGAR_DESLOGAR_USUARIO:
      return {
        ...state,
        usuarioConectado: action.payload.usuarioConectado,
        logado: action.payload.logado,
        conta: action.payload.conta,
        contaSelecionada: action.payload.contaSelecionada,
        inputSenha: "",
        ...resetarEstado(action.payload.logado),
      };
    case ABRIR_FECHAR_ITEM_BARRA_LATERAL:
      return { ...state, [action.payload.name]: action.payload.valor };
    case MUDAR_DADOS_LOGIN:
      return { ...state, [action.payload.nomeVariavel]: action.payload.valor };
    default:
      return state;
  }
};

const resetarEstado = (logado) => {
  if (!logado) return INITIAL_STATE;
  return {};
};
