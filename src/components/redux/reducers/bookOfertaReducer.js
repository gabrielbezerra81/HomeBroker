import {
  MUDAR_QTDE_BOOK,
  MUDAR_STOPLOSS_BOOK,
  MUDAR_GAIN_BOOK,
  MUDAR_INPUTHEADER_BOOK,
  LIMPAR_FORMS
} from "constants/ActionTypes";
import { LISTAR_BOOK_OFERTAS } from "constants/ApiActionTypes";

const INITIAL_STATE = {
  qtde: "",
  erro: "",
  stopLoss: 0,
  gain: 0,
  inputHeader: "",
  tabelaOfertasCompra: [],
  tabelaOfertasVenda: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MUDAR_QTDE_BOOK:
      return { ...state, qtde: action.payload.qtde, erro: action.payload.erro };
    case MUDAR_STOPLOSS_BOOK:
      return { ...state, stopLoss: action.payload };
    case MUDAR_GAIN_BOOK:
      return { ...state, gain: action.payload };
    case MUDAR_INPUTHEADER_BOOK:
      return { ...state, inputHeader: action.payload };
    case LIMPAR_FORMS:
      return { ...state, qtde: "" };
    case LISTAR_BOOK_OFERTAS:
      return {
        ...state,
        tabelaOfertasCompra: action.payload.tabelaOfertasCompra,
        tabelaOfertasVenda: action.payload.tabelaOfertasVenda
      };
    default:
      return state;
  }
};
