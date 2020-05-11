import { listarBookOfertaAPI } from "components/api/API";
import { atualizarBookAPI } from "components/api/ReativosAPI";
import {
  LISTAR_BOOK_OFERTAS,
  ATUALIZAR_SOURCE_EVENT_BOOK_OFERTAS,
} from "constants/ApiActionTypes";

export const listarBookOfertaOnEnterAction = (codigo_ativo, props) => {
  return async (dispatch) => {
    document.body.style.cursor = "wait";
    let tabelasAPI = await listarBookOfertaAPI(codigo_ativo);
    document.body.style.cursor = "default";

    if (
      !tabelasAPI.tabelaOfertasCompra.length &&
      !tabelasAPI.tabelaOfertasVenda.length
    )
      tabelasAPI = {
        tabelaOfertasCompra: new Array(5).fill({ price: "", qtty: "" }, 0, 5),
        tabelaOfertasVenda: new Array(5).fill({ price: "", qtty: "" }, 0, 5),
      };
    if (props) {
      if (props.eventSource) props.eventSource.close();
    }
    setTimeout(() => {
      const source = atualizarBookAPI(dispatch, {}, codigo_ativo, "book");
      dispatch({ type: ATUALIZAR_SOURCE_EVENT_BOOK_OFERTAS, payload: source });
    }, 3000);
    dispatch({
      type: LISTAR_BOOK_OFERTAS,
      payload: tabelasAPI,
    });
  };
};
