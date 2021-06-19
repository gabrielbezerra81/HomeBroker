import { findMultilegBook, findMultilegQuote } from "../duck/actions/utils";
import { MultilegOffer, MultilegQuote, MultilegTab } from "../types/multileg";

interface CalculatePriceProps {
  multilegTab: MultilegTab;
  multilegQuotes: MultilegQuote[];
  type: "ultimo" | "max" | "min";
}

export const calculatePrice = ({
  multilegTab,
  multilegQuotes,
  type,
}: CalculatePriceProps) => {
  let tabPrice = 0;
  let arrayQtde: number[] = [];

  multilegTab.tabelaMultileg.forEach((oferta, index) => {
    let book = findMultilegBook({
      multilegQuotes,
      symbol: oferta.codigoSelecionado,
    });

    const quote = findMultilegQuote({
      multilegQuotes,
      symbol: oferta.codigoSelecionado,
    });

    if (book || quote || type === "ultimo") {
      arrayQtde.push(oferta.qtde);
    }
  });

  const mdc = calculateMDC(arrayQtde);

  if (mdc > 0)
    multilegTab.tabelaMultileg.forEach((offer) => {
      const codigo = offer.codigoSelecionado;

      const quote = findMultilegQuote({
        multilegQuotes,
        symbol: codigo,
      });
      let book = findMultilegBook({
        multilegQuotes,
        symbol: codigo,
      });

      // if does not have book quote is used to calculate
      if (
        (!book || (book.compra.price === 0 && book.venda.price === 0)) &&
        quote
      ) {
        book = {
          compra: { price: quote },
          venda: { price: quote },
        } as any;
      }

      if (book)
        switch (type) {
          case "max":
            if (offer.cv === "compra" && book.venda.price !== null) {
              tabPrice += book.venda.price * (offer.qtde / mdc);
            } //
            else if (offer.cv === "venda" && book.compra.price !== null) {
              tabPrice -= book.compra.price * (offer.qtde / mdc);
            }
            break;
          case "min":
            if (offer.cv === "compra" && book.compra.price !== null) {
              tabPrice += book.compra.price * (offer.qtde / mdc);
            } //
            else if (offer.cv === "venda" && book.venda.price !== null) {
              tabPrice -= book.venda.price * (offer.qtde / mdc);
            }
            break;
          case "ultimo":
            if (quote === "") {
              return;
            }

            if (offer.cv === "compra") {
              tabPrice += quote * (offer.qtde / mdc);
            } //
            else if (offer.cv === "venda") {
              tabPrice -= quote * (offer.qtde / mdc);
            }
            break;
          default:
            break;
        }
    });

  return tabPrice;
};

interface CalculateTotalProps {
  multileg: MultilegTab[];
  tabIndex: number;
  multilegQuotes: MultilegQuote[];
}

export const calculateTotal = ({
  multileg,
  multilegQuotes,
  tabIndex,
}: CalculateTotalProps) => {
  let multilegTab = multileg[tabIndex];

  const tabPrice = multilegTab.preco
    ? Number(multilegTab.preco.split(".").join("").replace(",", "."))
    : 0;

  const qttyArray = multilegTab.tabelaMultileg.map((offer) => offer.qtde);

  const qttyMDC = calculateMDC(qttyArray);

  return tabPrice * qttyMDC;

  // multilegTab.tabelaMultileg.forEach((offer) => {
  //   const cotacao = findMultilegQuote({
  //     multilegQuotes,
  //     symbol: offer.codigoSelecionado,
  //   });

  //   let usedPriceInCalc = 0;

  //   if (typeof cotacao === "number") {
  //     usedPriceInCalc = cotacao;
  //   }

  //   if (offer.cv === "compra") {
  //     total += offer.qtde * usedPriceInCalc;
  //   } //
  //   else {
  //     total -= offer.qtde * usedPriceInCalc;
  //   }
  // });
};

export const calculateMDC = (nums: number[]) => {
  var factor = nums[0];
  for (var i = 1; i < nums.length; i++) {
    factor = gcd2(factor, nums[i]);
  }
  return factor;
};

const gcd2 = (a: number, b: number): number => {
  if (!b) {
    return a;
  }

  return gcd2(b, a % b);
};

interface isPriceCalcWithoutBookProps {
  multilegOffers: MultilegOffer[];
  multilegQuotes: MultilegQuote[];
}

export const isPriceCalcWithoutBook = ({
  multilegOffers,
  multilegQuotes,
}: isPriceCalcWithoutBookProps) => {
  return multilegOffers.some((offer) => {
    const book = findMultilegBook({
      multilegQuotes,
      symbol: offer.codigoSelecionado,
    });
    const cotacao = findMultilegQuote({
      multilegQuotes,
      symbol: offer.codigoSelecionado,
    });
    return (
      !book || (book.compra.price === 0 && book.venda.price === 0 && cotacao)
    );
  });
};
