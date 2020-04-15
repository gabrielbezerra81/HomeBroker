import {
  ABRIR_FECHAR_MENU_LATERAL,
  LOGAR_DESLOGAR_USUARIO,
  ABRIR_FECHAR_ITEM_BARRA_LATERAL,
  MUDAR_DADOS_LOGIN,
} from "constants/ActionTypes";

const INITIAL_STATE = {
  usuarioConectado: "Gabriel Alencar",
  menuLateralAberto: false,
  logado: true,
  valorLiquido: "15.000,00",
  valorComprar: "3.500,00",
  ativo: "Bender",
  ordensAberto: false,
  ordensExecucaoAberto: false,
  relatorioDetalhadoAberto: false,
  listaCompletaAberta: false,
  multilegAberto: false,
  thlAberta: true,
  inputUsuario: "gabrielAB",
  inputSenha: "123456789",
  token: {
    tokenType: "Bearer",
    accessToken:
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJnYWJyaWVsQUIiLCJpYXQiOjE1ODY5ODMxNjMsImV4cCI6MTU4NzA2OTU2M30.QhLSYNjEnM2dCfcYxo2FuyUj51sE6dxcsg-heH2toxIiFsYLEXXD-O2XlLwN8CXy-YLI-dNg1k7U9M6DA2__0A",
  },
  nomeCadastro: "Gabriel",
  usernameCadastro: "gabrielAB",
  emailCadastro: "gabrielAB@gmail.com",
  senhaCadastro: "123456789",
  conta: [
    {
      id: 1,
      numero: "12345-6",
      nome: null,
      preferencia: null,
      gateway: "MT5",
      saldo: null,
      sigla: "XPI",
      corretora: "XP INVESTIMENTOS",
    },
  ],
  contaSelecionada: {
    id: 1,
    numero: "12345-6",
    nome: null,
    preferencia: null,
    gateway: "MT5",
    saldo: null,
    sigla: "XPI",
    corretora: "XP INVESTIMENTOS",
  },
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
        menuLateralAberto: false,
        conta: action.payload.conta,
        contaSelecionada: action.payload.contaSelecionada,
      };
    case ABRIR_FECHAR_ITEM_BARRA_LATERAL:
      return { ...state, [action.payload.name]: action.payload.valor };
    case MUDAR_DADOS_LOGIN:
      return { ...state, [action.payload.nomeVariavel]: action.payload.valor };
    default:
      return state;
  }
};
