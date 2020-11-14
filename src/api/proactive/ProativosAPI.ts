import { url_singleQuote_quote } from "api/url";
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

export const getProactiveMultilegQuotesAPI = async (symbols: string) => {};

export const getProactiveThlStructureAPI = async (structureIds: string) => {};
