import {
  url_singleQuote_quote,
  url_multiQuote_quotes,
  url_multiStructure_ids,
  url_ordersExec_ids,
  url_multiBookOneLine_symbols,
  url_multiStructureBox_ids,
} from "api/url";
import { MultilegQuote } from "modules/multileg/types/multileg";
import { THLQuote } from "modules/thl/types/thl";
import proactiveAPI from "./proactiveConfig";

interface BoletaResponse {
  symbol: string;
  ultimo: number;
  ultimoHorario: string;
}

export const getProactiveBoletaQuoteAPI = async (symbol: string) => {
  return proactiveAPI
    .get<BoletaResponse>(`${url_singleQuote_quote}${symbol}`)
    .then((response) => {
      if (response.data.ultimo && response.data.ultimoHorario) {
        const data = {
          quote: response.data.ultimo,
          lastDate: response.data.ultimoHorario,
        };

        return data;
      }

      return null;
    })
    .catch((error) => {
      console.log("error boleta proativa", error.response);
      return null;
    });
};

interface MultilegResponse {
  symbol: string;
  ultimo: number;
  compra: number;
  compraQtde: number;
  venda: number;
  vendaQtde: number;
}

export const getProactiveMultilegQuotesAPI = async (
  symbols: string,
): Promise<MultilegQuote[]> => {
  return proactiveAPI
    .get<MultilegResponse[]>(`${url_multiQuote_quotes}${symbols}`)
    .then((response) => {
      if (response.data && response.data.length) {
        return response.data.map((quoteItem) => {
          const item: MultilegQuote = {
            codigo: quoteItem.symbol,
            valor: quoteItem.ultimo,
            compra: {
              price: quoteItem.compra || null,
              qtty: quoteItem.compraQtde || null,
              type: "C",
            },
            venda: {
              price: quoteItem.venda || null,
              qtty: quoteItem.vendaQtde || null,
              type: "V",
            },
          };

          return item;
        });
      }

      return [];
    })
    .catch((error) => {
      return [];
    });
};

interface BookResponse {
  bookBuy: Array<{
    price: number;
    qtty: number;
  }>;
  bookSell: Array<{
    price: number;
    qtty: number;
  }>;
}

export const getProactiveOffersBookAPI = async (symbol: string) => {
  return proactiveAPI
    .get<BookResponse[]>(`${url_multiQuote_quotes}${symbol}`)
    .then((response) => {
      if (response.data && response.data.length) {
        const data = response.data.map((quoteItem) => {
          return {
            bookBuy: quoteItem.bookBuy.map((bookItem) => ({
              price: bookItem.price,
              qtty: bookItem.qtty,
            })),
            bookSell: quoteItem.bookSell.map((bookItem) => ({
              price: bookItem.price,
              qtty: bookItem.qtty,
            })),
          };
        });

        return data[0];
      }

      return null;
    })
    .catch((error) => {
      return null;
    });
};

export const getProactiveThlStructureAPI = async (structureIds: string) => {
  return proactiveAPI
    .get(`${url_multiStructure_ids}${structureIds}`)
    .then((response) => {
      if (response.data && response.data.length) {
        return response.data;
      }

      return [];
    })
    .catch((error) => {
      console.log(error);

      return [];
    });
};

interface ThlQuoteResponse {
  symbol: string;
  ultimo: number;
}

export const getProactiveThlQuotesAPI = async (
  symbols: string,
): Promise<THLQuote[]> => {
  return proactiveAPI
    .get<ThlQuoteResponse[]>(`${url_multiQuote_quotes}${symbols}`)
    .then((response) => {
      if (response.data && response.data.length) {
        return response.data.map((quoteItem) => ({
          codigo: quoteItem.symbol,
          cotacao: quoteItem.ultimo,
        }));
      }

      return [];
    })
    .catch((error) => {
      return [];
    });
};

export const getProactiveBoxAPI = async (structureIds: string) => {
  return proactiveAPI
    .get(`${url_multiStructureBox_ids}${structureIds}`)
    .then((response) => {
      if (response.data && response.data.length) {
        return response.data;
      }

      return [];
    })
    .catch((error) => {
      return [];
    });
};

interface PositionQuoteResponse {
  symbol: string;
  ultimo: number;
}

interface BoxSymbolsBookResponse {
  symbol: string;
  ultimo: number;
  compra: number;
  compraQtde: number;
  venda: number;
  vendaQtde: number;
}

export const getProactiveBoxSymbolsBookAPI = async (
  symbols: string,
): Promise<BoxSymbolsBookResponse[]> => {
  return proactiveAPI
    .get<BoxSymbolsBookResponse[]>(`${url_multiBookOneLine_symbols}${symbols}`)
    .then((response) => {
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    })
    .catch((error) => {
      return [];
    });
};

export const getProactivePositionQuotesAPI = async (symbols: string) => {
  return proactiveAPI
    .get<PositionQuoteResponse[]>(`${url_multiQuote_quotes}${symbols}`)
    .then((response) => {
      if (response.data && response.data.length) {
        return response.data.map((quoteItem) => ({
          codigo: quoteItem.symbol,
          cotacao: quoteItem.ultimo,
        }));
      }

      return [];
    })
    .catch((error) => {
      return [];
    });
};

interface PositionEmblemResponse {
  min: number;
  max: number;
  last: number;
  id: number;
}

export const getProactivePositionEmblemsAPI = async (structureIds: string) => {
  return proactiveAPI
    .get<PositionEmblemResponse[]>(`${url_multiStructure_ids}${structureIds}`)
    .then((response) => {
      // {
      //   precoCompra: dados.min,
      //   precoVenda: dados.max,
      //   cotacaoAtual: dados.last,
      //   idEstrutura: dados.id,
      // }
      if (response.data && response.data.length) {
        return response.data.map((structureItem) => ({
          precoCompra: structureItem.min,
          precoVenda: structureItem.max,
          cotacaoAtual: structureItem.last,
          idEstrutura: structureItem.id,
        }));
      }

      return [];
    })
    .catch(() => {
      return [];
    });
};

export const getProactiveOrdersExecAPI = async (ids: string) => {
  return proactiveAPI
    .get(`${url_ordersExec_ids}${ids}`)
    .then((response) => {
      if (response.data && response.data.length) {
        return response.data;
      }

      return [];
    })
    .catch(() => {
      return [];
    });
};

interface CategorySymbolData {
  symbol: string;
  ultimo: number;
  oscilacao?: number;
}

export const getProactiveCategoriesSymbolDataAPI = async (symbols: string) => {
  return proactiveAPI
    .get<CategorySymbolData[]>(`${url_multiQuote_quotes}${symbols}`)
    .then((response) => {
      if (response.data && response.data.length) {
        return response.data;
      }

      return [];
    })
    .catch(() => {
      return [];
    });
};
