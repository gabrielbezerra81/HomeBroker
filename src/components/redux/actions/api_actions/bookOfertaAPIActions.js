import { listarBookOfertaAPI, atualizarBookAPI } from "components/api/API";
import { LISTAR_BOOK_OFERTAS } from "constants/ApiActionTypes";

export const listarBookOfertaOnEnterAction = (codigo_ativo, props) => {
  return async dispatch => {
    document.body.style.cursor = "wait";
    const tabelas = await listarBookOfertaAPI(codigo_ativo);
    document.body.style.cursor = "default";

    if (props) {
      props.eventSource.close();
    }
    setTimeout(() => {
      const source = atualizarBookAPI(dispatch, {}, codigo_ativo, "book");
      dispatch({ type: "nova", payload: source });
    }, 3000);

    dispatch({
      type: LISTAR_BOOK_OFERTAS,
      payload: tabelas
    });
  };
};
