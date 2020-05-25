import React from "react";
import {
  StateStorePrincipal,
  DispatchStorePrincipal,
} from "components/redux/StoreCreation";
import { mudarVariavelTHLAction } from "components/redux/actions/menu_actions/THLActions";
import { erro_selecaoBook_THL } from "constants/AlertaErros";

export default ({ preco, qtde, tipo, ativo }) => {
  const reduxState = StateStorePrincipal().THLReducer;
  const dispatch = DispatchStorePrincipal();
  const { booksSelecionados } = reduxState;
  const indice = booksSelecionados.findIndex(
    (book) => book.ativo === ativo && book.tipo === tipo
  );

  const tipoBook = tipo === "compra" ? "venda" : "compra";

  const bookSelecionado =
    indice !== -1 ? ` bookSelecionado_${tipoBook}` : " bookNaoSelecionado";

  return (
    <div
      className={`divClicavel${bookSelecionado}`}
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

export const selecionarBooks = (props: {
  booksSelecionados: [],
  novosBooks: [],
  dispatch: any,
}) => {
  const { booksSelecionados, novosBooks, dispatch } = props;
  const books = [...booksSelecionados];
  let mostrarAlerta = false;

  novosBooks.forEach((novoBook) => {
    const indice = books.findIndex(
      (book) => book.ativo === novoBook.ativo && book.tipo === novoBook.tipo
    );
    if (indice === -1) {
      if (novosBooks.length === 1 && booksSelecionados.length === 6)
        mostrarAlerta = true;
      else if (novosBooks.length === 2 && booksSelecionados.length >= 5)
        mostrarAlerta = true;

      if (!mostrarAlerta)
        books.push({ ativo: novoBook.ativo, tipo: novoBook.tipo });
    } else {
      if (novosBooks.length !== 2) books.splice(indice, 1);
    }
  });
  if (mostrarAlerta) alert(erro_selecaoBook_THL);

  dispatch(mudarVariavelTHLAction("booksSelecionados", books));
};
