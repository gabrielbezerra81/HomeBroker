import { listarBookOfertaAPI } from "api/API";
import { atualizarBookAPI } from "api/ReativosAPI";
import {
  LISTAR_BOOK_OFERTAS,
  ATUALIZAR_SOURCE_EVENT_BOOK_OFERTAS,
} from "constants/ApiActionTypes";
import { getReducerStateBoletas } from "hooks/utils";

export const listarBookOfertaOnEnterAction = ({ codigoAtivo, token }) => {
  return async (dispatch, getState) => {
    const { esource_offersBook } = getReducerStateBoletas(
      getState(),
      "bookOfertaReducer",
    );

    document.body.style.cursor = "wait";
    let tabelasAPI = await listarBookOfertaAPI(codigoAtivo);
    document.body.style.cursor = "default";

    if (
      !tabelasAPI.tabelaOfertasCompra.length &&
      !tabelasAPI.tabelaOfertasVenda.length
    )
      tabelasAPI = {
        tabelaOfertasCompra: new Array(5).fill({ price: "", qtty: "" }, 0, 5),
        tabelaOfertasVenda: new Array(5).fill({ price: "", qtty: "" }, 0, 5),
      };

    if (esource_offersBook) {
      esource_offersBook.close();
    }

    setTimeout(() => {
      const source = atualizarBookAPI({
        dispatch,
        codigos: codigoAtivo,
        tipo: "book",
        token,
      });
      dispatch({ type: ATUALIZAR_SOURCE_EVENT_BOOK_OFERTAS, payload: source });
    }, 3000);
    dispatch({
      type: LISTAR_BOOK_OFERTAS,
      payload: tabelasAPI,
    });
  };
};
