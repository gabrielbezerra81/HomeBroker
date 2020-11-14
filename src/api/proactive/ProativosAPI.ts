import { url_singleQuote_quote, url_multiQuote_quotes } from "api/url";
import { MultilegQuote } from "types/multileg/multileg";
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

export const getProactiveThlStructureAPI = async (structureIds: string) => {};
