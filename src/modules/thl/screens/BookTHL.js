import React, { useMemo } from "react";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { mudarVariavelTHLAction } from "modules/thl/duck/actions/THLActions";
import { erro_selecaoBook_THL } from "constants/AlertaErros";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

export default (props) => {
  const { preco, qtde, tipo, ativo } = props;
  const {
    thlReducer: { booksSelecionados },
  } = useStateStorePrincipal();
  const dispatch = useDispatchStorePrincipal();

  const selectedBookIndex = booksSelecionados.findIndex(
    (book) => book.ativo === ativo && book.tipo === tipo,
  );

  const bookType = tipo === "compra" ? "venda" : "compra";

  const bookIsSelected = useMemo(() => {
    return selectedBookIndex !== -1
      ? ` bookSelecionado_${bookType}`
      : " bookNaoSelecionado";
  }, [selectedBookIndex, bookType]);

  return (
    <div
      className={`divClicavel${bookIsSelected}`}
      tabIndex={0}
      onClick={(e) => {
        selecionarBooks({
          booksSelecionados,
          novosBooks: [{ ativo, tipo }],
          dispatch,
        });
        e.stopPropagation();
      }}
    >
      {preco} | {qtde}
    </div>
  );
};

export const selecionarBooks = (props) => {
  const { booksSelecionados, novosBooks, dispatch } = props;
  const books = booksSelecionados.map((book) => ({ ...book }));
  let mostrarAlerta = false;
  let qtdeAdicionar = novosBooks.length;
  qtdeAdicionar -= booksSelecionados.filter(
    (book) =>
      novosBooks.length === 2 &&
      (book.ativo === novosBooks[0].ativo ||
        book.ativo === novosBooks[1].ativo),
  ).length;

  novosBooks.forEach((novoBook) => {
    const indice = books.findIndex(
      (book) => book.ativo === novoBook.ativo && book.tipo === novoBook.tipo,
    );
    if (indice === -1) {
      if (novosBooks.length === 1 && booksSelecionados.length === 6)
        mostrarAlerta = true;
      else if (booksSelecionados.length + qtdeAdicionar >= 7)
        mostrarAlerta = true;

      if (!mostrarAlerta)
        books.push({ ativo: novoBook.ativo, tipo: novoBook.tipo });
    } //
    else {
      if (qtdeAdicionar === 0 || novosBooks.length === 1)
        books.splice(indice, 1);
    }
  });
  if (mostrarAlerta) alert(erro_selecaoBook_THL);

  dispatch(mudarVariavelTHLAction("booksSelecionados", books));
};
