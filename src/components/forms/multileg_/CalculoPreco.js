import { buscaBook } from "components/forms/multileg_/Book";

export const calculoPreco = (
  aba,
  tipo,
  booksMultileg = [],
  cotacoesMultileg = []
) => {
  let preco = 0;
  let arrayQtde = [];

  aba.tabelaMultileg.forEach((oferta, index) => {
    let book = buscaBook(booksMultileg, oferta.codigoSelecionado);
    book = book ? book : [];
    if (book.compra || book.venda || tipo === "ultimo")
      arrayQtde.push(oferta.qtde);
  });
  const mdc = calculoMDC(arrayQtde);

  if (mdc > 0)
    aba.tabelaMultileg.forEach((oferta, index) => {
      let book = buscaBook(booksMultileg, oferta.codigoSelecionado);
      book = book ? book : [];
      if (book.compra || book.venda || tipo === "ultimo") {
        switch (tipo) {
          case "max":
            if (oferta.cv === "compra" && book.venda)
              preco += book.venda.price * (oferta.qtde / mdc);
            else if (oferta.cv === "venda" && book.compra)
              preco -= book.compra.price * (oferta.qtde / mdc);
            break;
          case "min":
            if (oferta.cv === "compra" && book.compra)
              preco += book.compra.price * (oferta.qtde / mdc);
            else if (oferta.cv === "venda" && book.venda)
              preco -= book.venda.price * (oferta.qtde / mdc);
            break;
          case "ultimo":
            if (oferta.cv === "compra")
              preco += oferta.cotacao * (oferta.qtde / mdc);
            else if (oferta.cv === "venda")
              preco -= oferta.cotacao * (oferta.qtde / mdc);
            break;
          default:
            break;
        }
      }
    });
  return preco;
};

const gcd2 = (a, b) => {
  return !b ? a : gcd2(b, a % b);
};
export const calculoMDC = nums => {
  var factor = nums[0];
  for (var i = 1; i < nums.length; i++) {
    factor = gcd2(factor, nums[i]);
  }
  return factor;
};
