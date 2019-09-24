import { listarBookOfertaAPI } from "components/api/API";
import { LISTAR_BOOK_OFERTAS } from "constants/ApiActionTypes";

export const listarBookOfertaOnEnterAction = codigo_ativo => {
  return async dispatch => {
    const tabelas = await listarBookOfertaAPI(codigo_ativo);

    dispatch({
      type: LISTAR_BOOK_OFERTAS,
      payload: tabelas
    });
  };
};
