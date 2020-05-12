import React from "react";
import {
  formatarNumDecimal,
  formatarQuantidadeKMG,
} from "components/utils/Formatacoes";
import imgModeloEU from "img/modeloEU.png";
import { ReactComponent as ImgModeloUSA } from "img/modeloUSA2.svg";
import {
  StateStorePrincipal,
  DispatchStorePrincipal,
} from "components/redux/StoreCreation";
import { mudarVariavelTHLAction } from "components/redux/actions/menu_actions/THLActions";
import { erro_selecaoBook_THL } from "constants/AlertaErros";

export const CelulaMes = ({ itemColuna, id, ultimaColuna }) => {
  const reduxState = StateStorePrincipal().THLReducer;
  const dispatch = DispatchStorePrincipal();
  const {
    precosTabelaVencimentos,
    booksSelecionados,
    codigoCelulaSelecionada,
  } = reduxState;
  const ativo = itemColuna.symbol;

  let compra, compraQtde, venda, vendaQtde, min, max, qtdeMontar, qtdeDesmont;

  const strike = formatarNumDecimal(itemColuna.strike);
  const ativoStrike = `${ativo.slice(4)} (${strike})`;
  const {
    custodia,
    executando,
    qtdeExecutada,
    qtdeOferta,
  } = VerificaAtivoCustodia(itemColuna);
  const estrutura = id
    ? precosTabelaVencimentos.find(
        (item) =>
          item.id === id &&
          item.components.some((comp) => comp.stock.symbol === ativo)
      )
    : null;

  let precosColuna, precosPar;
  let booksMontar = [],
    booksDesmontar = [];

  if (estrutura) {
    max = formatarNumDecimal(estrutura.max);
    min = formatarNumDecimal(estrutura.min);

    if (estrutura.components[0].stock.symbol === ativo) {
      precosColuna = estrutura.components[0];
      precosPar = estrutura.components[1];
    } else {
      precosColuna = estrutura.components[1];
      precosPar = estrutura.components[0];
    }
  }

  if (precosColuna && precosPar) {
    compra = formatarNumDecimal(precosColuna.compra);
    compraQtde = formatarQuantidadeKMG(precosColuna.compraQtde);
    venda = formatarNumDecimal(precosColuna.venda);
    vendaQtde = formatarQuantidadeKMG(precosColuna.vendaQtde);

    qtdeMontar = formatarQuantidadeKMG(
      Math.min(precosColuna.compraQtde, precosPar.vendaQtde)
    );
    qtdeDesmont = formatarQuantidadeKMG(
      Math.min(precosColuna.vendaQtde, precosPar.compraQtde)
    );

    booksMontar = [
      { ativo: precosColuna.stock.symbol, tipo: "venda" },
      { ativo: precosPar.stock.symbol, tipo: "compra" },
    ];
    booksDesmontar = [
      { ativo: precosColuna.stock.symbol, tipo: "compra" },
      { ativo: precosPar.stock.symbol, tipo: "venda" },
    ];
  }

  const {
    corQtdeExecutando,
    classeCorPrecos,
    celulaSelecionada,
    precosCelulaSelecionada,
  } = classesDinamicas(reduxState, executando, ultimaColuna, estrutura, ativo);

  return (
    <div className="containerColunaMes">
      <div
        tabIndex={0}
        className={`divClicavel containerCelula${celulaSelecionada}`}
        onClick={() => {
          let novoCodigo = "";
          if (ativo !== codigoCelulaSelecionada) novoCodigo = ativo;
          dispatch(
            mudarVariavelTHLAction("codigoCelulaSelecionada", novoCodigo)
          );
        }}
      >
        <div
          className={`itemAtivosQtde ${
            custodia ? "itemAtivosQtdeCustodia" : ""
          }`}
        >
          <div className="itemAtivos">
            {renderModelo(itemColuna.model)}
            {ativoStrike} | id:{id}
          </div>
          {custodia ? (
            <div className={`itemQtde${corQtdeExecutando}`}>{qtdeOferta}</div>
          ) : null}
        </div>

        {precosColuna ? (
          <div className="bookAtivoTHL roxoTextoTHL">
            <RenderBook
              preco={compra}
              qtde={compraQtde}
              tipo="venda"
              ativo={ativo}
            />
            <RenderBook
              preco={venda}
              qtde={vendaQtde}
              tipo="compra"
              ativo={ativo}
            />
          </div>
        ) : null}
      </div>

      <div
        className={`containerPrecoMontDesmont${classeCorPrecos}${precosCelulaSelecionada}`}
      >
        {!ultimaColuna && estrutura ? (
          <>
            <div
              className="divClicavel"
              tabIndex={0}
              onClick={() =>
                SelecionarBooks(booksSelecionados, booksMontar, dispatch)
              }
            >
              {max} | {qtdeMontar}
            </div>
            <div
              className="divClicavel"
              tabIndex={0}
              onClick={() =>
                SelecionarBooks(booksSelecionados, booksDesmontar, dispatch)
              }
            >
              {min} | {qtdeDesmont}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

const RenderBook = ({ preco, qtde, tipo, ativo }) => {
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
        SelecionarBooks(booksSelecionados, [{ ativo, tipo }], dispatch);
        e.stopPropagation();
      }}
    >
      {preco} | {qtde}
    </div>
  );
};

const renderModelo = (modelo) => {
  return (
    <div className="mr-1">
      {modelo === "EUROPEAN" ? (
        <img src={imgModeloEU} alt="" className="imgModeloTHL" />
      ) : (
        <ImgModeloUSA
          viewBox="6 -1 17 17"
          className="imgModeloTHL"
        ></ImgModeloUSA>
      )}
    </div>
  );
};

const VerificaAtivoCustodia = (itemColuna) => {
  let executando = false;
  let custodia = false;
  let qtdeExecutada = 0;
  let qtdeOferta = 0;
  const ativoCelula = itemColuna.symbol;
  const reduxState = StateStorePrincipal().posicaoReducer;
  const { posicoesCustodia } = reduxState;
  executando = posicoesCustodia.some((posicao) => {
    const execCompra = posicao.custodiaCompra.find(
      (custCompra) => custCompra.ativo === ativoCelula
    );
    const execVenda = posicao.custodiaVenda.find(
      (custVenda) => custVenda.ativo === ativoCelula
    );
    const condicaoCust = posicao.ativos.some(
      (ativo) => ativo.symbol === ativoCelula
    );
    const condicaoExec = execCompra || execVenda;
    if (condicaoCust) custodia = true;
    if (execCompra) {
      qtdeExecutada = execCompra.qtdeExecutada;
      qtdeOferta = execCompra.qtdeOferta;
    } else if (execVenda) {
      qtdeExecutada = execVenda.qtdeExecutada;
      qtdeOferta = execVenda.qtdeOferta;
    }

    return condicaoExec;
  });

  return { executando, custodia, qtdeExecutada, qtdeOferta };
};

const SelecionarBooks = (booksSelecionados, novosBooks, dispatch) => {
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

const calculaCorPreco = (reduxState, estrutura) => {
  let classe = "";
  const { seletorMapaCalor, faixasMapaCalor } = reduxState;

  if (
    ["montar", "desmontar"].includes(seletorMapaCalor) &&
    faixasMapaCalor &&
    estrutura
  ) {
    const valor =
      seletorMapaCalor === "montar"
        ? +estrutura.max.toFixed(2)
        : +estrutura.min.toFixed(2);
    const indice = faixasMapaCalor.findIndex((faixa) => {
      const min = faixa.min;
      const max = faixa.max;

      return valor >= min && valor <= max;
    });
    if (indice !== -1) classe = ` faixa${indice + 1}Mapa`;
  }

  return classe;
};

const classesDinamicas = (
  reduxState,
  executando,
  ultimaColuna,
  estrutura,
  ativo
) => {
  const { codigoCelulaSelecionada } = reduxState;
  const corQtdeExecutando = executando ? " ativoExecutando" : "";
  const classeCorPrecos = ultimaColuna
    ? ""
    : calculaCorPreco(reduxState, estrutura);
  let celulaSelecionada = "";
  let precosCelulaSelecionada = "";
  if (codigoCelulaSelecionada === ativo) {
    celulaSelecionada = " celulaSelecionada";
    precosCelulaSelecionada = " precosCelulaSelecionada";
  }

  return {
    corQtdeExecutando,
    classeCorPrecos,
    celulaSelecionada,
    precosCelulaSelecionada,
  };
};
