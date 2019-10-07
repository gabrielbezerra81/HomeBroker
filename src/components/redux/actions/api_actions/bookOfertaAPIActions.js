import { listarBookOfertaAPI } from "components/api/API";
import { LISTAR_BOOK_OFERTAS } from "constants/ApiActionTypes";

export const listarBookOfertaOnEnterAction = codigo_ativo => {
  return async dispatch => {
    document.body.style.cursor = "wait";
    const tabelas = await listarBookOfertaAPI(codigo_ativo);
    document.body.style.cursor = "default";

    dispatch({
      type: LISTAR_BOOK_OFERTAS,
      payload: tabelas
    });
  };
};
