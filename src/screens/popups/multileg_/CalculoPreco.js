import {
  findMultilegBook,
  findMultilegQuote,
} from "redux/actions/multileg/utils";

export const calculoPreco = (aba, tipo, cotacoesMultileg) => {
  let preco = 0;
  let arrayQtde = [];

  aba.tabelaMultileg.forEach((oferta, index) => {
    let book = findMultilegBook({
      multilegQuotes: cotacoesMultileg,
      symbol: oferta.codigoSelecionado,
    });
    const cotacao = findMultilegQuote({
      multilegQuotes: cotacoesMultileg,
      symbol: oferta.codigoSelecionado,
    });
    if (!book && cotacao) {
      book = { compra: { price: cotacao }, venda: { price: cotacao } };
    }
    if (book || tipo === "ultimo") arrayQtde.push(oferta.qtde);
  });
  const mdc = calculoMDC(arrayQtde);

  if (mdc > 0)
    aba.tabelaMultileg.forEach((oferta, index) => {
      const codigo = oferta.codigoSelecionado;
      const cotacao = findMultilegQuote({
        multilegQuotes: cotacoesMultileg,
        symbol: codigo,
      });
      let book = findMultilegBook({
        multilegQuotes: cotacoesMultileg,
        symbol: codigo,
      });

      if (
        !book ||
        (book.compra.price === 0 && book.venda.price === 0 && cotacao)
      ) {
        book = { compra: { price: cotacao }, venda: { price: cotacao } };
      }

      if (book)
        switch (tipo) {
          case "max":
            if (oferta.cv === "compra")
              preco += book.venda.price * (oferta.qtde / mdc);
            else if (oferta.cv === "venda")
              preco -= book.compra.price * (oferta.qtde / mdc);
            break;
          case "min":
            if (oferta.cv === "compra")
              preco += book.compra.price * (oferta.qtde / mdc);
            else if (oferta.cv === "venda")
              preco -= book.venda.price * (oferta.qtde / mdc);
            break;
          case "ultimo":
            if (oferta.cv === "compra") preco += cotacao * (oferta.qtde / mdc);
            else if (oferta.cv === "venda")
              preco -= cotacao * (oferta.qtde / mdc);
            break;
          default:
            break;
        }
    });

  return preco;
};

export const calcularTotal = (props) => {
  let total = 0;
  let aba = props.multileg[props.indice];

  // const price = aba.preco
  //   ? Number(aba.preco.split(".").join("").replace(",", "."))
  //   : 0;

  aba.tabelaMultileg.forEach((oferta) => {
    const cotacao = findMultilegQuote({
      multilegQuotes: props.cotacoesMultileg,
      symbol: oferta.codigoSelecionado,
    });
    if (cotacao) {
      if (oferta.cv === "compra") total += oferta.qtde * cotacao;
      else total -= oferta.qtde * cotacao; //cotacao;
    }
  });
  return total;
};

export const calculoMDC = (nums) => {
  var factor = nums[0];
  for (var i = 1; i < nums.length; i++) {
    factor = gcd2(factor, nums[i]);
  }
  return factor;
};

const gcd2 = (a, b) => {
  return !b ? a : gcd2(b, a % b);
};

export const verificaCalculoSemBook = (tabelaMultileg, cotacoesMultileg) => {
  return tabelaMultileg.some((oferta, index) => {
    const book = findMultilegBook({
      multilegQuotes: cotacoesMultileg,
      symbol: oferta.codigoSelecionado,
    });
    const cotacao = findMultilegQuote({
      multilegQuotes: cotacoesMultileg,
      symbol: oferta.codigoSelecionado,
    });
    return (
      !book || (book.compra.price === 0 && book.venda.price === 0 && cotacao)
    );
  });
};
