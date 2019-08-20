import {
  ABRIR_FECHAR_MENU_LATERAL,
  LOGAR_DESLOGAR_USUARIO,
  ABRIR_FECHAR_ITEM_BARRA_LATERAL
} from "constants/ActionTypes";

const INITIAL_STATE = {
  usuarioConectado: "Gabriel Alencar",
  menuLateralAberto: true,
  logado: true,
  valorLiquido: "15.000,00",
  valorComprar: "3.500,00",
  ativo: "Bender",
  ordensAberto: false,
  ordensExecucaoAberto: false,
  posicaoAberta: false,
  relatorioDetalhadoAberto: false,
  listaCompletaAberta: false,
  multilegAberto: false,
  ativoFiltrarOrdens: "",
  mercadoFiltrarOrdens: "",
  contaFiltrarOrdens: "",
  statusFiltrarOrdens: "",
  dataFiltrarOrdens: "",
  ofertaFiltrarOrdens: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ABRIR_FECHAR_MENU_LATERAL:
      return { ...state, menuLateralAberto: action.payload };
    case LOGAR_DESLOGAR_USUARIO:
      return {
        ...state,
        usuarioConectado: action.payload.usuarioConectado,
        logado: action.payload.logado
      };
    case ABRIR_FECHAR_ITEM_BARRA_LATERAL:
      return { ...state, [action.payload.name]: action.payload.valor };
    default:
      return state;
  }
};