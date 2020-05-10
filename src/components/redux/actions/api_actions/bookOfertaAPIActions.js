import { listarBookOfertaAPI } from "components/api/API";
import { atualizarBookAPI } from "components/api/ReativosAPI";
import {
  LISTAR_BOOK_OFERTAS,
  ATUALIZAR_SOURCE_EVENT_BOOK_OFERTAS,
} from "constants/ApiActionTypes";

export const listarBookOfertaOnEnterAction = (codigo_ativo, props) => {
  return async (dispatch) => {
    document.body.style.cursor = "wait";
    const tabelasAPI = await listarBookOfertaAPI(codigo_ativo);
    document.body.style.cursor = "default";

    const tabelas = atualizarTabelaAntiga(tabelasAPI);
    if (props) {
      if (props.eventSource) props.eventSource.close();
    }
    setTimeout(() => {
      const source = atualizarBookAPI(dispatch, {}, codigo_ativo, "book");
      dispatch({ type: ATUALIZAR_SOURCE_EVENT_BOOK_OFERTAS, payload: source });
    }, 3000);
    dispatch({
      type: LISTAR_BOOK_OFERTAS,
      payload: tabelas,
    });
  };
};

export const atualizarTabelaAntiga = (tabelaAPI) => {
  let tabelaAntiga = {
    tabelaOfertasCompra: new Array(5).fill({ price: "", qtty: "" }, 0, 5),
    tabelaOfertasVenda: new Array(5).fill({ price: "", qtty: "" }, 0, 5),
  };

  let indiceTabAntiga = 4;
  for (
    let index = tabelaAPI.tabelaOfertasVenda.length - 1;
    index !== -1;
    index--
  ) {
    tabelaAntiga.tabelaOfertasVenda[indiceTabAntiga] =
      tabelaAPI.tabelaOfertasVenda[index];
    indiceTabAntiga -= 1;
  }

  indiceTabAntiga = 0;
  for (let index = 0; index < tabelaAPI.tabelaOfertasCompra.length; index++) {
    tabelaAntiga.tabelaOfertasCompra[indiceTabAntiga] =
      tabelaAPI.tabelaOfertasCompra[index];
    indiceTabAntiga += 1;
  }

  return tabelaAntiga;
};
