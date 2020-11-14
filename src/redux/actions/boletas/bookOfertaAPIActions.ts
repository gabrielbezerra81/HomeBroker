import { listarBookOfertaAPI } from "api/API";
import { getProactiveOffersBookAPI } from "api/proactive/ProativosAPI";
import { atualizarBookAPI } from "api/reactive/ReativosAPI";
import { UPDATE_MANY_OFFER_BOOK } from "constants/ActionTypes";
import { ATUALIZAR_SOURCE_EVENT_BOOK_OFERTAS } from "constants/ApiActionTypes";
import { storeAppPrincipal } from "redux/StoreCreation";
import { BoletasThunkAction } from "types/ThunkActions";

interface ListBookProps {
  codigoAtivo: string;
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
}: ListBookProps): BoletasThunkAction => {
  return async (dispatch, getState) => {
    const {
      bookOfertaReducer: { searchedSymbol: previousSymbol },
    } = getState();

    const {
      systemReducer: { updateMode },
    } = storeAppPrincipal.getState();

    document.body.style.cursor = "wait";

    const data: BookTableResponse = await listarBookOfertaAPI(codigoAtivo);

    document.body.style.cursor = "default";

    let bookTables = {
      tabelaOfertasCompra: data.tabelaOfertasCompra,
      tabelaOfertasVenda: data.tabelaOfertasVenda,
    };

    const searchedSymbol = codigoAtivo;
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

    if (previousSymbol === searchedSymbol) {
      if (updateMode === "reactive") {
        dispatch(startReactiveOffersBookUpdateAction());
      } //
      else {
        dispatch(startProactiveOffersBookUpdateAction());
      }
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

export const startReactiveOffersBookUpdateAction = (): BoletasThunkAction => {
  return (dispatch, getState) => {
    const {
      bookOfertaReducer: {
        esource_offersBook,
        searchedSymbol,
        interval_offersBook,
      },
    } = getState();

    const {
      systemReducer: { token },
    } = storeAppPrincipal.getState();

    if (esource_offersBook) {
      esource_offersBook.close();
    }

    if (interval_offersBook) {
      clearInterval(interval_offersBook);
    }

    if (searchedSymbol) {
      setTimeout(() => {
        const source = atualizarBookAPI({
          dispatch,
          symbol: searchedSymbol,
          token,
        });
        dispatch({
          type: ATUALIZAR_SOURCE_EVENT_BOOK_OFERTAS,
          payload: source,
        });
      }, 3000);
    }
  };
};

export const startProactiveOffersBookUpdateAction = (): BoletasThunkAction => {
  return (dispatch, getState) => {
    const {
      bookOfertaReducer: {
        esource_offersBook,
        searchedSymbol,
        interval_offersBook,
      },
    } = getState();

    const {
      systemReducer: { updateInterval },
    } = storeAppPrincipal.getState();

    if (esource_offersBook) {
      esource_offersBook.close();
    }

    if (interval_offersBook) {
      clearInterval(interval_offersBook);
    }

    if (searchedSymbol) {
      const interval = setInterval(async () => {
        const data = await getProactiveOffersBookAPI(searchedSymbol);

        if (data) {
          dispatch({
            type: UPDATE_MANY_OFFER_BOOK,
            payload: {
              tabelaOfertasCompra: data.bookBuy,
              tabelaOfertasVenda: data.bookSell,
            },
          });
        }
      }, updateInterval);

      dispatch({
        type: UPDATE_MANY_OFFER_BOOK,
        payload: { interval_offersBook: interval },
      });
    }
  };
};
