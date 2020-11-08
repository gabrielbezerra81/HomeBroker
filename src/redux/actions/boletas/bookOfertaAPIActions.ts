import { listarBookOfertaAPI } from "api/API";
import { atualizarBookAPI } from "api/ReativosAPI";
import { UPDATE_MANY_OFFER_BOOK } from "constants/ActionTypes";
import { ATUALIZAR_SOURCE_EVENT_BOOK_OFERTAS } from "constants/ApiActionTypes";
import { Token } from "types/system/system";
import { BoletasThunkAction } from "types/ThunkActions";

interface ListBookProps {
  codigoAtivo: string;
  token: Token;
}

interface BookTableResponse {
  tabelaOfertasCompra: Array<{
    price: number | "";
    qtty: number | "";
  }>;
  tabelaOfertasVenda: Array<{
    price: number | "";
    qtty: number | "";
  }>;
  success: boolean;
}

export const listarBookOfertaOnEnterAction = ({
  codigoAtivo,
  token,
}: ListBookProps): BoletasThunkAction => {
  return async (dispatch) => {
    document.body.style.cursor = "wait";

    const data: BookTableResponse = await listarBookOfertaAPI(codigoAtivo);

    document.body.style.cursor = "default";

    let bookTables = {
      tabelaOfertasCompra: data.tabelaOfertasCompra,
      tabelaOfertasVenda: data.tabelaOfertasVenda,
    };

    let searchedSymbol = codigoAtivo;
    let shouldAlert = false;

    if (
      !bookTables.tabelaOfertasCompra.length &&
      !bookTables.tabelaOfertasVenda.length
    ) {
      bookTables = {
        tabelaOfertasCompra: new Array(5).fill({ price: "", qtty: "" }, 0, 5),
        tabelaOfertasVenda: new Array(5).fill({ price: "", qtty: "" }, 0, 5),
      };

      shouldAlert = true;
    }

    dispatch({
      type: UPDATE_MANY_OFFER_BOOK,
      payload: {
        tabelaOfertasCompra: bookTables.tabelaOfertasCompra,
        tabelaOfertasVenda: bookTables.tabelaOfertasVenda,
        searchedSymbol,
      },
    });

    if (shouldAlert) {
      alert("Não há book de ofertas disponível");
    }
  };
};

export const startReactiveOffersBookUpdateAction = (
  token: Token,
): BoletasThunkAction => {
  return (dispatch, getState) => {
    const {
      bookOfertaReducer: { esource_offersBook, searchedSymbol },
    } = getState();

    if (esource_offersBook) {
      esource_offersBook.close();
    }

    setTimeout(() => {
      const source = atualizarBookAPI({
        dispatch,
        symbol: searchedSymbol,
        token,
      });
      dispatch({ type: ATUALIZAR_SOURCE_EVENT_BOOK_OFERTAS, payload: source });
    }, 3000);
  };
};

export const startProactiveOffersBookUpdateAction = (): BoletasThunkAction => {
  return (dispatch, getState) => {
    const {
      bookOfertaReducer: { esource_offersBook, searchedSymbol },
    } = getState();

    if (esource_offersBook) {
      esource_offersBook.close();
    }

    setTimeout(() => {
      // dispatch({ type: ATUALIZAR_SOURCE_EVENT_BOOK_OFERTAS, payload: source });
    }, 3000);
  };
};
